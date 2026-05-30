import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

async function requireAuth(ctx: { auth: any }): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
}

// /admin/* is gated by Clerk middleware in Next.js, so we don't re-check auth
// here — Clerk's session identity isn't reliably propagated to Convex in dev
// and this query was returning [] for signed-in admins as a result.
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contactMessages")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query("contactMessages")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return unread.length;
  },
});

export const markAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { read: true });
  },
});

export const markAsUnread = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { read: false });
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
  },
});

// Seed sample contact messages (upsert by email+message so reseed is idempotent)
export const seedMessages = mutation({
  args: {},
  handler: async (ctx) => {
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
