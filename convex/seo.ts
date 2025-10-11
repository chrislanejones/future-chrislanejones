import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all SEO metadata
export const getAllSEO = query({
  handler: async (ctx) => {
    return await ctx.db.query("seoMetadata").collect();
  },
});

// Get SEO for specific path
export const getSEOByPath = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("seoMetadata")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();
  },
});

// Update or create SEO metadata
export const updateSEO = mutation({
  args: {
    path: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("seoMetadata")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        description: args.description,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("seoMetadata", {
        path: args.path,
        title: args.title,
        description: args.description,
        updatedAt: Date.now(),
      });
    }
  },
});

// Seed initial data
export const seedSEOData = mutation({
  handler: async (ctx) => {
    const pages = [
      {
        path: "/",
        title: "Chris Lane Jones — Dev & Hiker",
        description:
          "I Consult, Design, and Develop Web Interfaces for Businesses and Government Agencies.",
      },
      {
        path: "/about",
        title: "About | Chris Lane Jones — Dev & Hiker",
        description:
          "Learn about my journey from video production to web development, community leadership in Richmond's WordPress meetup, and life in the Shenandoah Mountains.",
      },
      {
        path: "/projects",
        title: "Projects I Worked On | Chris Lane Jones — Dev & Hiker",
        description:
          "Explore my full-stack development projects featuring Next.js, TypeScript, and modern web technologies.",
      },
      {
        path: "/career",
        title: "Career | Chris Lane Jones — Dev & Hiker",
        description:
          "See My Career - Explore my professional journey, skills, and experiences in software development and beyond.",
      },
    ];

    for (const page of pages) {
      const existing = await ctx.db
        .query("seoMetadata")
        .withIndex("by_path", (q) => q.eq("path", page.path))
        .first();

      if (!existing) {
        await ctx.db.insert("seoMetadata", {
          ...page,
          updatedAt: Date.now(),
        });
      }
    }

    return { success: true, count: pages.length };
  },
});
