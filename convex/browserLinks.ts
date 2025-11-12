// convex/browserLinks.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { linkSeed } from "../src/data/linkSeed";

/**
 * Query: get all saved browser links
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("browserLinks").order("desc").collect();
  },
});

// Query to get links by category
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

// Query to get all unique categories with their colors
export const getCategories = query({
  handler: async (ctx) => {
    const links = await ctx.db.query("browserLinks").collect();
    const categoriesMap = new Map<string, string>();
    links.forEach((link) => {
      if (!categoriesMap.has(link.category)) {
        categoriesMap.set(link.category, link.color);
      }
    });
    return Array.from(categoriesMap.entries()).map(([category, color]) => ({
      category,
      color,
    }));
  },
});

// Mutation to create a new link
export const create = mutation({
  args: {
    href: v.string(),
    label: v.string(),
    domain: v.string(),
    favicon: v.optional(v.string()),
    category: v.string(),
    color: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("browserLinks", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Mutation to update a link
export const update = mutation({
  args: {
    id: v.id("browserLinks"),
    href: v.string(),
    label: v.string(),
    domain: v.string(),
    favicon: v.optional(v.string()),
    category: v.string(),
    color: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, { ...updateData, updatedAt: Date.now() });
  },
});

// Mutation to delete a link
export const deleteLink = mutation({
  args: { id: v.id("browserLinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation to bulk delete links by category
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

/**
 * Seed initial data (now sourced from src/data/linkSeed.ts)
 */
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

