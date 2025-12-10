import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { linkSeed } from "../src/data/linkSeed";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("browserLinks").order("desc").collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("browserLinks")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return links.sort((a, b) => a.order - b.order);
  },
});

// NEW: Get only featured links for link-page
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db
      .query("browserLinks")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
    return links.sort((a, b) => a.order - b.order);
  },
});

export const getCategories = query({
  handler: async (ctx) => {
    const links = await ctx.db.query("browserLinks").collect();
    const categoriesMap = new Map<string, { color: string; count: number }>();

    links.forEach((link) => {
      if (!categoriesMap.has(link.category)) {
        categoriesMap.set(link.category, { color: link.color, count: 1 });
      } else {
        const existing = categoriesMap.get(link.category)!;
        categoriesMap.set(link.category, {
          ...existing,
          count: existing.count + 1,
        });
      }
    });

    return Array.from(categoriesMap.entries()).map(([category, data]) => ({
      category,
      color: data.color,
      count: data.count,
    }));
  },
});

export const create = mutation({
  args: {
    href: v.string(),
    label: v.string(),
    domain: v.string(),
    favicon: v.optional(v.string()),
    category: v.string(),
    color: v.string(),
    order: v.number(),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("browserLinks", {
      ...args,
      featured: args.featured ?? false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("browserLinks"),
    href: v.optional(v.string()),
    label: v.optional(v.string()),
    domain: v.optional(v.string()),
    favicon: v.optional(v.string()),
    category: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.optional(v.number()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    // Filter out undefined values
    const cleanedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    }

    await ctx.db.patch(id, { ...cleanedData, updatedAt: Date.now() });
  },
});

export const deleteLink = mutation({
  args: { id: v.id("browserLinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteCategory = mutation({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const linksInCategory = await ctx.db
      .query("browserLinks")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    for (const link of linksInCategory) {
      await ctx.db.delete(link._id);
    }

    return linksInCategory.length;
  },
});

// Toggle featured status for a link
export const toggleFeatured = mutation({
  args: { id: v.id("browserLinks") },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.id);
    if (!link) throw new Error("Link not found");

    await ctx.db.patch(args.id, {
      featured: !link.featured,
      updatedAt: Date.now(),
    });

    return { featured: !link.featured };
  },
});

export const seedLinks = mutation({
  handler: async (ctx) => {
    let inserted = 0;

    for (const category of linkSeed) {
      for (let i = 0; i < category.links.length; i++) {
        const link = category.links[i];
        await ctx.db.insert("browserLinks", {
          href: link.href,
          label: link.label,
          domain: link.domain,
          favicon: link.favicon,
          category: category.title,
          color: category.color,
          order: i,
          featured: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        inserted++;
      }
    }

    return {
      success: true,
      inserted,
      message: `Seeded ${inserted} links across ${linkSeed.length} categories`,
    };
  },
});
