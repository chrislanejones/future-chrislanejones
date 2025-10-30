import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .collect();
  },
});

export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .filter((q) =>
        q.and(
          q.eq(q.field("slug"), args.slug),
          q.eq(q.field("published"), true)
        )
      )
      .first();
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", {
      ...args,
      published: args.published ?? false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Like functionality
export const toggleLike = mutation({
  args: {
    postId: v.id("blogPosts"),
    userIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already liked this post
    const existingLike = await ctx.db
      .query("blogLikes")
      .withIndex("by_user_post", (q) =>
        q.eq("userIdentifier", args.userIdentifier).eq("postId", args.postId)
      )
      .first();

    if (existingLike) {
      // Remove like
      await ctx.db.delete(existingLike._id);

      // Update likes count
      const post = await ctx.db.get(args.postId);
      if (post) {
        await ctx.db.patch(args.postId, {
          likesCount: Math.max(0, (post.likesCount || 0) - 1),
        });
      }
      return { liked: false };
    } else {
      // Add like
      await ctx.db.insert("blogLikes", {
        postId: args.postId,
        userIdentifier: args.userIdentifier,
        createdAt: Date.now(),
      });

      // Update likes count
      const post = await ctx.db.get(args.postId);
      if (post) {
        await ctx.db.patch(args.postId, {
          likesCount: (post.likesCount || 0) + 1,
        });
      }
      return { liked: true };
    }
  },
});

export const getUserLikeStatus = query({
  args: {
    postId: v.id("blogPosts"),
    userIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("blogLikes")
      .withIndex("by_user_post", (q) =>
        q.eq("userIdentifier", args.userIdentifier).eq("postId", args.postId)
      )
      .first();

    return { liked: !!like };
  },
});

// Comment functionality
export const addComment = mutation({
  args: {
    postId: v.id("blogPosts"),
    parentId: v.optional(v.id("blogComments")),
    authorName: v.string(),
    authorEmail: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogComments", {
      ...args,
      approved: false, // Comments need approval by default
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getComments = query({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogComments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .filter((q) => q.eq(q.field("approved"), true))
      .order("asc")
      .collect();
  },
});

export const approveComment = mutation({
  args: { commentId: v.id("blogComments") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.commentId, {
      approved: true,
      updatedAt: Date.now(),
    });
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("blogComments") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.commentId);
  },
});