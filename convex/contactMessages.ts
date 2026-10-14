import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { enforceRateLimits, requiredEmail, requiredText } from "./rateLimits";

import { requireAdmin as requireAuth, isAdmin } from "./authz";

// Contact messages contain PII (names, emails, phone numbers). Convex queries
// are publicly callable, so these MUST gate on the caller's identity — without
// it, anyone on the internet can read every submission. We return empty results
// (rather than throwing) when unauthenticated to match the other admin queries.
//
// Anonymous callers can grow this table, so admin reads are capped. The newest
// ADMIN_LIST_LIMIT messages are returned; older ones stay in the database.
const ADMIN_LIST_LIMIT = 500;

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return [];
    return await ctx.db
      .query("contactMessages")
      .withIndex("by_created")
      .order("desc")
      .take(ADMIN_LIST_LIMIT);
  },
});

// Capped like getAll, so the badge tops out at ADMIN_LIST_LIMIT.
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return 0;
    const unread = await ctx.db
      .query("contactMessages")
      .withIndex("by_read", (q) => q.eq("read", false))
      .take(ADMIN_LIST_LIMIT);
    return unread.length;
  },
});

export const markAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.patch(args.id, { read: true });
  },
});

export const markAsUnread = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.patch(args.id, { read: false });
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.delete(args.id);
  },
});

// Every `source` the site's contact forms send (see
// src/components/page/contact-form.tsx getSource).
const CONTACT_SOURCES = new Set([
  "contact-page",
  "react-maintenance-page",
  "wordpress-maintenance-page",
]);

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    // Public, unauthenticated mutation. The client form validates, but a direct
    // Convex call bypasses that, so validate and rate-limit here.
    const name = requiredText(args.name, "Name", 200);
    const email = requiredEmail(args.email);
    const message = requiredText(args.message, "Message", 5000);
    const phone = args.phone?.trim() || undefined;
    if (phone && phone.length > 50) throw new ConvexError("Phone is too long");
    if (!CONTACT_SOURCES.has(args.source)) {
      throw new ConvexError("Unknown form source");
    }

    await enforceRateLimits(
      ctx,
      "contactPerSender",
      email.toLowerCase(),
      "contactGlobal",
    );

    return await ctx.db.insert("contactMessages", {
      name,
      email,
      phone,
      message,
      source: args.source,
      read: false,
      createdAt: Date.now(),
    });
  },
});

// Seed sample contact messages (upsert by email+message so reseed is idempotent)
export const seedMessages = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const now = Date.now();
    const samples: Array<{
      name: string;
      email: string;
      phone?: string;
      message: string;
      source: string;
      read: boolean;
      createdAt: number;
    }> = [
      {
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        message:
          "Loved your portfolio — would love to chat about a Next.js consulting project for our marketing site.",
        source: "/contact",
        read: false,
        createdAt: now - 2 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Priya Shah",
        email: "priya@example.com",
        phone: "+1 555 0134",
        message:
          "Hey Chris! Saw your WordPress maintenance page. Do you take on monthly retainer clients with mixed React + WP stacks?",
        source: "/wordpress-maintenance",
        read: false,
        createdAt: now - 5 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Jordan Kim",
        email: "jordan.kim@example.com",
        message:
          "Quick question about the image editor project — is the source available, or only the deployed demo?",
        source: "/projects",
        read: true,
        createdAt: now - 12 * 24 * 60 * 60 * 1000,
      },
    ];

    let inserted = 0;
    let skipped = 0;
    for (const msg of samples) {
      const existing = await ctx.db
        .query("contactMessages")
        .filter((q) =>
          q.and(
            q.eq(q.field("email"), msg.email),
            q.eq(q.field("message"), msg.message),
          ),
        )
        .first();
      if (existing) {
        skipped++;
      } else {
        await ctx.db.insert("contactMessages", msg);
        inserted++;
      }
    }

    return {
      success: true,
      total: samples.length,
      inserted,
      updated: skipped,
      message: `Seeded ${inserted} new messages, ${skipped} already present`,
    };
  },
});
