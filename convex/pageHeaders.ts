// ================================================================
// convex/pageHeaders.ts
// CRUD operations for page header/banner data
// ================================================================

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { staticPageHeaders } from "../src/lib/page-headers";

// Get all page headers
export const getAllPageHeaders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pageHeaders").collect();
  },
});

// Get page header by path
export const getPageHeaderByPath = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pageHeaders")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();
  },
});

// Update or create page header
export const updatePageHeader = mutation({
  args: {
    path: v.string(),
    title: v.string(),
    breadcrumbPage: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pageHeaders")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        breadcrumbPage: args.breadcrumbPage,
        description: args.description,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("pageHeaders", {
        path: args.path,
        title: args.title,
        breadcrumbPage: args.breadcrumbPage,
        description: args.description,
        updatedAt: Date.now(),
      });
    }
  },
});

// Create page header (errors if path exists)
export const createPageHeader = mutation({
  args: {
    path: v.string(),
    title: v.string(),
    breadcrumbPage: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pageHeaders")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();

    if (existing) {
      throw new Error(`Page header for path "${args.path}" already exists`);
    }

    return await ctx.db.insert("pageHeaders", {
      path: args.path,
      title: args.title,
      breadcrumbPage: args.breadcrumbPage,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

// Delete page header
export const deletePageHeader = mutation({
  args: { id: v.id("pageHeaders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed page headers from static data
export const seedPageHeaders = mutation({
  args: {},
  handler: async (ctx) => {
    const paths = Object.keys(staticPageHeaders);
    let inserted = 0;
    let updated = 0;

    for (const path of paths) {
      const data = staticPageHeaders[path];
      const existing = await ctx.db
        .query("pageHeaders")
        .withIndex("by_path", (q) => q.eq("path", path))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          title: data.title,
          breadcrumbPage: data.breadcrumbPage,
          description: data.description,
          updatedAt: Date.now(),
        });
        updated++;
      } else {
        await ctx.db.insert("pageHeaders", {
          path,
          title: data.title,
          breadcrumbPage: data.breadcrumbPage,
          description: data.description,
          updatedAt: Date.now(),
        });
        inserted++;
      }
    }

    return { inserted, updated, total: paths.length };
  },
});
