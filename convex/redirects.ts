import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("redirects").order("desc").collect();
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("redirects")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const create = mutation({
  args: {
    from: v.string(),
    to: v.string(),
    statusCode: v.number(),
    isActive: v.boolean(),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {

    return ctx.db.insert("redirects", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("redirects"),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    statusCode: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {

    const { id, ...fields } = args;
    return ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const deleteRedirect = mutation({
  args: { id: v.id("redirects") },
  handler: async (ctx, args) => {

    return ctx.db.delete(args.id);
  },
});

export const seedRedirects = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("redirects").collect();
    if (existing.length > 0) {
      return { success: true, message: "Redirects already seeded" };
    }
    const seed = [
      { from: "/links", to: "/link-page", statusCode: 301, isActive: true, label: "Links page shortcut" },
      { from: "/docs", to: "/career", statusCode: 301, isActive: true, label: "Docs → Career" },
      { from: "/docs/", to: "/career", statusCode: 301, isActive: true, label: "Docs/ → Career" },
    ];
    for (const r of seed) {
      await ctx.db.insert("redirects", { ...r, createdAt: Date.now(), updatedAt: Date.now() });
    }
    return { success: true, inserted: seed.length };
  },
});

export const toggleActive = mutation({
  args: { id: v.id("redirects") },
  handler: async (ctx, args) => {

    const redirect = await ctx.db.get(args.id);
    if (!redirect) throw new Error("Redirect not found");
    return ctx.db.patch(args.id, {
      isActive: !redirect.isActive,
      updatedAt: Date.now(),
    });
  },
});
