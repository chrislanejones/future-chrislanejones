// convex/projects.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return ctx.db.query("projects").order("desc").collect();
  },
});

export const getFeatured = query({
  handler: async (ctx) => {
    return ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("asc")
      .collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    image: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    codebergUrl: v.optional(v.string()),
    vercelUrl: v.optional(v.string()),
    customUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("projects", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    image: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    codebergUrl: v.optional(v.string()),
    vercelUrl: v.optional(v.string()),
    customUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updateData }) => {
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleFeatured = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");
    await ctx.db.patch(args.id, {
      featured: !project.featured,
      updatedAt: Date.now(),
    });
    return { featured: !project.featured };
  },
});

export const seedProjects = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("projects").collect();
    if (existing.length > 0) {
      return { message: "Projects already exist", count: existing.length };
    }

    const now = Date.now();
    const projects = [
      {
        title: "Image Editor & Optimizer",
        description:
          "Next.js + TanStack app for cropping, painting, blur tools, and batch processing. Optimized for performance with Tailwind and Plotly for data visualization.",
        category: "app",
        image: "/projects/Image-Horse-App.webp",
        githubUrl: "https://github.com/chrislanejones",
        featured: true,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Web Crawler (Golang)",
        description:
          "A performant web crawler built with Go, featuring concurrent scraping, rate limiting, and structured data extraction for SEO analysis and content auditing.",
        category: "app",
        image: "/projects/Web-Crawler-Golang-App.webp",
        githubUrl: "https://github.com/chrislanejones",
        featured: true,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "MPC Vim Filter Tool",
        description:
          "CLI tool for filtering and managing Music Player Daemon playlists with Vim-style keybindings. Built for keyboard-driven workflow efficiency.",
        category: "app",
        image: "/projects/MPC-Vim-Filter-Tool.webp",
        githubUrl: "https://github.com/chrislanejones",
        featured: true,
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const project of projects) {
      await ctx.db.insert("projects", project);
    }

    return { message: "Projects seeded successfully", count: projects.length };
  },
});
