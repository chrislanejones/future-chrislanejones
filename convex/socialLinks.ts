import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

import { requireAdmin as requireAuth } from "./authz";

// These links are site chrome (header icons, footer icons, link page buttons),
// so every read is public. Each surface reads its own index range, which skips
// the rows that have no slot on it and needs no sort afterwards. The table is
// bounded by hand — one row per social profile plus a handful of other links —
// so the admin's whole-table read is fine, same as `clients.getAll`.

const kindValidator = v.union(v.literal("social"), v.literal("extra"));

// Everything, social first, each group in its own order. Powers the admin panel.
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const social = await ctx.db
      .query("socialLinks")
      .withIndex("by_kind_order", (q) => q.eq("kind", "social"))
      .collect();
    const extra = await ctx.db
      .query("socialLinks")
      .withIndex("by_kind_order", (q) => q.eq("kind", "extra"))
      .collect();
    return [...social, ...extra];
  },
});

// Site header icon row. A row opts in by having a headerOrder; that number is
// the slot it renders in. The index range skips rows with no slot (undefined
// sorts before every number) and hands them back already in slot order, so
// there is nothing left to filter or sort in JavaScript.
export const getForHeader = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialLinks")
      .withIndex("by_header_order", (q) => q.gte("headerOrder", 0))
      .collect();
  },
});

// Site footer icon row — same contract as the header, separate slot numbers.
export const getForFooter = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialLinks")
      .withIndex("by_footer_order", (q) => q.gte("footerOrder", 0))
      .collect();
  },
});

// The link page mixes social and extra links in one grid — Home first, services
// last — so it orders by its own slot rather than by `kind`.
export const getForLinkPage = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialLinks")
      .withIndex("by_link_page_order", (q) => q.gte("linkPageOrder", 0))
      .collect();
  },
});

export const create = mutation({
  args: {
    kind: kindValidator,
    label: v.string(),
    href: v.string(),
    iconKey: v.string(),
    isExternal: v.optional(v.boolean()),
    order: v.number(),
    headerOrder: v.optional(v.number()),
    footerOrder: v.optional(v.number()),
    linkPageOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("socialLinks", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Patches only the fields provided. The three slot fields are nullable on the
// wire: `null` clears the slot (pulling the link off that surface), while
// omitting the field leaves the stored slot alone.
export const update = mutation({
  args: {
    id: v.id("socialLinks"),
    kind: v.optional(kindValidator),
    label: v.optional(v.string()),
    href: v.optional(v.string()),
    iconKey: v.optional(v.string()),
    isExternal: v.optional(v.boolean()),
    order: v.optional(v.number()),
    headerOrder: v.optional(v.union(v.number(), v.null())),
    footerOrder: v.optional(v.union(v.number(), v.null())),
    linkPageOrder: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, headerOrder, footerOrder, linkPageOrder, ...fields } = args;
    const slot = (value: number | null | undefined, key: string) =>
      value === undefined ? {} : { [key]: value === null ? undefined : value };
    await ctx.db.patch(id, {
      ...fields,
      ...slot(headerOrder, "headerOrder"),
      ...slot(footerOrder, "footerOrder"),
      ...slot(linkPageOrder, "linkPageOrder"),
      updatedAt: Date.now(),
    });
  },
});

export const deleteLink = mutation({
  args: { id: v.id("socialLinks") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
  },
});

// Drag-to-reorder within a group.
export const reorder = mutation({
  args: {
    items: v.array(v.object({ id: v.id("socialLinks"), order: v.number() })),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    for (const item of args.items) {
      await ctx.db.patch(item.id, { order: item.order, updatedAt: Date.now() });
    }
  },
});

// Renumber one surface from a full ordered list of the links on it. Links left
// out of `ids` lose their slot, so this doubles as add/remove for that surface.
export const setSurfaceOrder = mutation({
  args: {
    surface: v.union(
      v.literal("header"),
      v.literal("footer"),
      v.literal("linkPage"),
    ),
    ids: v.array(v.id("socialLinks")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const field = (
      { header: "headerOrder", footer: "footerOrder", linkPage: "linkPageOrder" } as const
    )[args.surface];
    const all = await ctx.db.query("socialLinks").collect();
    for (const link of all) {
      const slot = args.ids.indexOf(link._id);
      const next = slot === -1 ? undefined : slot;
      if (link[field] === next) continue;
      await ctx.db.patch(link._id, { [field]: next, updatedAt: Date.now() });
    }
  },
});

// Seed the links the site shipped hard-coded. The three slot fields reproduce
// exactly what each surface rendered before this table existed:
//   header    — X, GitHub, Codeberg, LinkedIn
//   footer    — the same four plus CodePen
//   link page — the live order, which interleaves social and other links:
//               Home first, the services buttons last.
// Links added in this pass (Threads, Codeberg, Browser Tabs, Career & Resume)
// are appended to the link page so the existing twelve keep their slots.
export const seedSocialLinks = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("socialLinks").take(1);
    if (existing.length > 0) {
      return { success: true, message: "Social links already seeded" };
    }

    const now = Date.now();

    type Seed = {
      kind: "social" | "extra";
      label: string;
      href: string;
      iconKey: string;
      headerOrder?: number;
      footerOrder?: number;
      linkPageOrder?: number;
    };

    const links: Seed[] = [
      // ── Social profiles ──
      {
        kind: "social",
        label: "X.com",
        href: "https://x.com/cljwebdev",
        iconKey: "x-twitter",
        headerOrder: 0,
        footerOrder: 0,
        linkPageOrder: 1,
      },
      {
        kind: "social",
        label: "BlueSky",
        href: "https://bsky.app/profile/chrislanejones.com",
        iconKey: "bluesky",
        linkPageOrder: 2,
      },
      {
        kind: "social",
        label: "GitHub",
        href: "https://github.com/chrislanejones",
        iconKey: "github",
        headerOrder: 1,
        footerOrder: 1,
        linkPageOrder: 3,
      },
      {
        kind: "social",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/chrislanejones",
        iconKey: "linkedin",
        headerOrder: 3,
        footerOrder: 3,
        linkPageOrder: 4,
      },
      {
        kind: "social",
        label: "YouTube",
        href: "https://www.youtube.com/@chrislanejones",
        iconKey: "youtube",
        linkPageOrder: 5,
      },
      {
        kind: "social",
        label: "TikTok",
        href: "https://www.tiktok.com/@cljwebdev",
        iconKey: "tiktok",
        linkPageOrder: 6,
      },
      {
        kind: "social",
        label: "CodePen",
        href: "https://codepen.io/chrislanejones",
        iconKey: "codepen",
        footerOrder: 4,
        linkPageOrder: 7,
      },
      {
        kind: "social",
        label: "Dev.to",
        href: "https://dev.to/chrislanejones",
        iconKey: "devto",
        linkPageOrder: 8,
      },
      {
        kind: "social",
        label: "Coffee",
        href: "https://buymeacoffee.com/chrislanejones",
        iconKey: "buymeacoffee",
        linkPageOrder: 9,
      },
      {
        kind: "social",
        label: "Codeberg",
        href: "https://codeberg.org/chrislanejones",
        iconKey: "codeberg",
        headerOrder: 2,
        footerOrder: 2,
        linkPageOrder: 13,
      },
      {
        kind: "social",
        label: "Threads",
        href: "https://www.threads.com/@chrislanejones/",
        iconKey: "threads",
        linkPageOrder: 12,
      },

      // ── Other links ──
      { kind: "extra", label: "Home", href: "/", iconKey: "home", linkPageOrder: 0 },
      {
        kind: "extra",
        label: "React Services",
        href: "/react-maintenance",
        iconKey: "react",
        linkPageOrder: 10,
      },
      {
        kind: "extra",
        label: "WordPress Services",
        href: "/wordpress-maintenance",
        iconKey: "wordpress",
        linkPageOrder: 11,
      },
      {
        kind: "extra",
        label: "Browser Tabs",
        href: "/browser-tabs",
        iconKey: "chrome",
        linkPageOrder: 14,
      },
      {
        kind: "extra",
        label: "Career & Resume",
        href: "/career-and-resume",
        iconKey: "resume",
        linkPageOrder: 15,
      },
    ];

    // `order` is the position in the admin panel's own list, numbered per group.
    const nextOrder = { social: 0, extra: 0 };
    for (const link of links) {
      await ctx.db.insert("socialLinks", {
        ...link,
        isExternal: link.href.startsWith("http"),
        order: nextOrder[link.kind]++,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { success: true, inserted: links.length };
  },
});
