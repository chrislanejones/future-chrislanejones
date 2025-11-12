import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all media items
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("media").order("desc").collect();
  },
});

// Get media by assignment type
export const getByAssignedType = query({
  args: { assignedToType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("media")
      .withIndex("by_assigned_type", (q) =>
        q.eq("assignedToType", args.assignedToType)
      )
      .collect();
  },
});

// Get media by assignment ID
export const getByAssignedId = query({
  args: { assignedToId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("media")
      .withIndex("by_assigned_id", (q) =>
        q.eq("assignedToId", args.assignedToId)
      )
      .collect();
  },
});

// Get unassigned media
export const getUnassigned = query({
  args: {},
  handler: async (ctx) => {
    const allMedia = await ctx.db.query("media").collect();
    return allMedia.filter((item) => !item.assignedToType);
  },
});

// Get media organized by pages and blog posts
export const getOrganized = query({
  args: {},
  handler: async (ctx) => {
    const allMedia = await ctx.db.query("media").collect();
    const blogPosts = await ctx.db.query("blogPosts").order("desc").collect();

    // Define static pages
    const pages = [
      { id: "home", title: "Home Page" },
      { id: "about", title: "About Page" },
      { id: "gallery", title: "Gallery" },
      { id: "projects", title: "Projects" },
      { id: "browser-tabs", title: "Browser Tabs" },
    ];

    const organized = {
      pages: pages.map((page) => ({
        ...page,
        images: allMedia.filter(
          (m) => m.assignedToType === "page" && m.assignedToId === page.id
        ),
      })),
      blogPosts: blogPosts.map((post) => ({
        id: post._id,
        title: post.title,
        slug: post.slug,
        images: allMedia.filter(
          (m) => m.assignedToType === "blogPost" && m.assignedToId === post._id
        ),
      })),
      unassigned: allMedia.filter((m) => !m.assignedToType),
    };

    return organized;
  },
});

// Create media item
export const create = mutation({
  args: {
    url: v.string(),
    filename: v.string(),
    altText: v.optional(v.string()),
    size: v.optional(v.number()),
    mimeType: v.optional(v.string()),
    assignedToType: v.optional(v.string()),
    assignedToId: v.optional(v.string()),
    assignedToTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("media", {
      ...args,
      uploadedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update media item
export const update = mutation({
  args: {
    id: v.id("media"),
    url: v.optional(v.string()),
    filename: v.optional(v.string()),
    altText: v.optional(v.string()),
    assignedToType: v.optional(v.string()),
    assignedToId: v.optional(v.string()),
    assignedToTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Assign media to a page or blog post
export const assign = mutation({
  args: {
    mediaId: v.id("media"),
    assignedToType: v.string(), // "page" or "blogPost"
    assignedToId: v.string(),
    assignedToTitle: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.mediaId, {
      assignedToType: args.assignedToType,
      assignedToId: args.assignedToId,
      assignedToTitle: args.assignedToTitle,
      updatedAt: Date.now(),
    });
  },
});

// Unassign media
export const unassign = mutation({
  args: {
    mediaId: v.id("media"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.mediaId, {
      assignedToType: undefined,
      assignedToId: undefined,
      assignedToTitle: undefined,
      updatedAt: Date.now(),
    });
  },
});

// Delete media item
export const deleteMedia = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Migration: Create media entries for UploadThing blog images
export const migrateBlogImages = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Image data from UploadThing uploads
    const images = [
      {
        url: "https://utfs.io/f/WbGhhMpTlU7mEsKiTJxZ0cjQnFCgNvh8xaB3zspKHTDtk5oV",
        filename: "multi-image-compress-and-edit-app.webp",
        size: 47274,
        slug: "building-modern-react-applications-nextjs-14",
        title: "Building Modern React Applications with Next.js 14",
      },
      {
        url: "https://utfs.io/f/WbGhhMpTlU7mH7dqcoMBay2oLWJYseqwlDOE6NIS1PCThpi4",
        filename: "Richmond-WordPress-Meetup.webp",
        size: 23216,
        slug: "wordpress-vs-modern-frameworks-when-to-choose-what",
        title: "WordPress vs Modern Frameworks: When to Choose What",
      },
      {
        url: "https://utfs.io/f/WbGhhMpTlU7mhPmrQXRcSNuyLQ3Vrs9vaJjZn8WOTp6oFkKd",
        filename: "Standing-Desk-Setup.webp",
        size: 25642,
        slug: "remote-work-setup-perfect-development-environment",
        title: "Remote Work Setup: Building the Perfect Development Environment",
      },
    ];

    const results = [];

    for (const image of images) {
      // Find the blog post by slug
      const post = await ctx.db
        .query("blogPosts")
        .filter((q) => q.eq(q.field("slug"), image.slug))
        .first();

      if (post) {
        // Check if media already exists for this post
        const existingMedia = await ctx.db
          .query("media")
          .filter((q) => q.eq(q.field("assignedToId"), post._id))
          .first();

        if (existingMedia) {
          results.push({
            success: true,
            filename: image.filename,
            postTitle: image.title,
            mediaId: existingMedia._id,
            skipped: true,
          });
        } else {
          // Create media entry
          const mediaId = await ctx.db.insert("media", {
            url: image.url,
            filename: image.filename,
            size: image.size,
            mimeType: "image/webp",
            assignedToType: "blogPost",
            assignedToId: post._id,
            assignedToTitle: image.title,
            uploadedAt: now,
            updatedAt: now,
          });

          results.push({
            success: true,
            filename: image.filename,
            postTitle: image.title,
            mediaId,
            created: true,
          });
        }
      } else {
        results.push({
          success: false,
          filename: image.filename,
          error: `Blog post not found for slug: ${image.slug}`,
        });
      }
    }

    return results;
  },
});
