import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Helper to get media for a blog post
async function getPostMedia(ctx: any, postId: string) {
  const media = await ctx.db
    .query("media")
    .withIndex("by_assigned_id", (q: any) => q.eq("assignedToId", postId))
    .filter((q: any) => q.eq(q.field("assignedToType"), "blogPost"))
    .collect();
  return media[0]?.url; // Return first image URL
}

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .collect();

    // Enrich with media URLs
    return await Promise.all(
      posts.map(async (post) => {
        const mediaUrl = await getPostMedia(ctx, post._id);
        return {
          ...post,
          coverImage: mediaUrl || post.coverImage, // Use media first, fallback to old field
        };
      })
    );
  },
});

// Admin: Get all posts including unpublished
export const getAllPostsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .order("desc")
      .collect();

    // Enrich with media URLs
    return await Promise.all(
      posts.map(async (post) => {
        const mediaUrl = await getPostMedia(ctx, post._id);
        return {
          ...post,
          coverImage: mediaUrl || post.coverImage, // Use media first, fallback to old field
        };
      })
    );
  },
});

export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .filter((q) =>
        q.and(
          q.eq(q.field("slug"), args.slug),
          q.eq(q.field("published"), true)
        )
      )
      .first();

    if (!post) return null;

    // Enrich with media URL
    const mediaUrl = await getPostMedia(ctx, post._id);
    return {
      ...post,
      coverImage: mediaUrl || post.coverImage,
    };
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

// Admin: Get all comments including unapproved
export const getAllCommentsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const comments = await ctx.db
      .query("blogComments")
      .order("desc")
      .collect();

    // Enrich comments with post information
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const post = await ctx.db.get(comment.postId);
        return {
          ...comment,
          postTitle: post?.title || "Unknown Post",
          postSlug: post?.slug || "",
        };
      })
    );

    return enrichedComments;
  },
});

// Admin: Get pending comments count
export const getPendingCommentsCount = query({
  args: {},
  handler: async (ctx) => {
    const pendingComments = await ctx.db
      .query("blogComments")
      .filter((q) => q.eq(q.field("approved"), false))
      .collect();
    return pendingComments.length;
  },
});

// Admin: Get all likes with post info
export const getAllLikesAdmin = query({
  args: {},
  handler: async (ctx) => {
    const likes = await ctx.db
      .query("blogLikes")
      .order("desc")
      .collect();

    // Group by post
    const postLikesMap = new Map<string, number>();
    likes.forEach((like) => {
      const postId = like.postId;
      postLikesMap.set(postId, (postLikesMap.get(postId) || 0) + 1);
    });

    // Get post info
    const postsWithLikes = await Promise.all(
      Array.from(postLikesMap.entries()).map(async ([postId, count]) => {
        const post = await ctx.db.get(postId as Id<"blogPosts">);
        // Type guard: check if post has blogPost properties
        const blogPost = post && 'title' in post && 'slug' in post ? post : null;
        return {
          postId,
          postTitle: blogPost?.title || "Unknown Post",
          postSlug: blogPost?.slug || "",
          likesCount: count,
        };
      })
    );

    return {
      total: likes.length,
      byPost: postsWithLikes.sort((a, b) => b.likesCount - a.likesCount),
    };
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

// Seed blog posts
export const seedBlogPosts = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if blog posts already exist
    const existingPosts = await ctx.db.query("blogPosts").collect();
    if (existingPosts.length > 0) {
      return "Blog posts already exist";
    }

    const now = Date.now();

    const blogPosts = [
      {
        title: "Building Modern React Applications with Next.js 14",
        slug: "building-modern-react-applications-nextjs-14",
        excerpt: "Explore the latest features in Next.js 14 and how they can transform your React development workflow. From app router to server components, we'll cover it all.",
        content: `
# Building Modern React Applications with Next.js 14

Next.js 14 has brought some incredible improvements to the React ecosystem. In this post, we'll explore the key features that make it a game-changer for modern web development.

## App Router Revolution

The new App Router in Next.js 14 provides a more intuitive way to structure your applications. With file-based routing and nested layouts, building complex applications has never been easier.

## Server Components

Server Components allow us to render components on the server, reducing the JavaScript bundle size and improving performance significantly.

## Key Benefits

- Improved performance
- Better SEO
- Enhanced developer experience
- Simplified data fetching

Whether you're building a simple website or a complex web application, Next.js 14 provides the tools you need to succeed.
        `,
        coverImage: "/projects/multi-image-compress-and-edit-app.webp",
        tags: ["React", "Next.js", "Web Development", "JavaScript"],
        published: true,
        likesCount: 12,
        createdAt: now - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        updatedAt: now - 7 * 24 * 60 * 60 * 1000,
      },
      {
        title: "WordPress vs Modern Frameworks: When to Choose What",
        slug: "wordpress-vs-modern-frameworks-when-to-choose-what",
        excerpt: "A comprehensive comparison between WordPress and modern JavaScript frameworks. Learn when each approach makes sense for your project.",
        content: `
# WordPress vs Modern Frameworks: When to Choose What

Choosing the right technology stack for your project can be challenging. Let's break down when WordPress makes sense versus when you should reach for modern JavaScript frameworks.

## WordPress: The Reliable Choice

WordPress powers over 40% of the web for good reasons:

- Content management made easy
- Extensive plugin ecosystem
- SEO-friendly out of the box
- Large community support

## Modern Frameworks: The Future

Frameworks like React, Vue, and Svelte offer:

- Better performance
- More flexibility
- Modern development experience
- Enhanced user interactions

## Making the Decision

Consider these factors when choosing:

1. **Content needs**: Heavy content management? WordPress wins.
2. **Performance requirements**: Need lightning-fast interactions? Go modern.
3. **Team expertise**: Use what your team knows best.
4. **Budget and timeline**: WordPress can be faster to launch.

The best choice depends on your specific project requirements and constraints.
        `,
        coverImage: "/gallery/Richmond-WordPress-Meetup.webp",
        tags: ["WordPress", "React", "Web Development", "CMS"],
        published: true,
        likesCount: 8,
        createdAt: now - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        updatedAt: now - 3 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Remote Work Setup: Building the Perfect Development Environment",
        slug: "remote-work-setup-perfect-development-environment",
        excerpt: "From standing desks to multiple monitors, discover how to create a productive remote development environment that boosts your coding efficiency.",
        content: `
# Remote Work Setup: Building the Perfect Development Environment

Working remotely as a developer requires the right setup to maintain productivity and comfort. Here's how I've optimized my home office over the years.

## The Hardware Essentials

### Monitor Setup
A good monitor setup is crucial for productivity:
- Primary: 32" 4K monitor for main work
- Secondary: Vertical 24" for documentation and Slack
- Laptop screen for terminal and system monitoring

### Ergonomics Matter
- Standing desk for health and energy
- Ergonomic chair for long coding sessions
- External keyboard and mouse
- Proper lighting to reduce eye strain

## Software and Tools

### Development Environment
- VS Code with essential extensions
- Terminal setup with Oh My Zsh
- Git workflows and aliases
- Docker for consistent environments

### Productivity Tools
- Time tracking with focus sessions
- Note-taking system (Obsidian/Notion)
- Calendar blocking for deep work
- Communication boundaries

## Creating the Right Atmosphere

The environment affects productivity:
- Dedicated workspace separate from relaxation areas
- Plants for better air quality and mood
- Background music or noise cancellation
- Regular breaks and movement

## The Mountain Office Advantage

Working from the Shenandoah Mountains provides natural inspiration and a change of pace that fuels creativity. Sometimes the best debugging happens on a hiking trail!

Remember: the perfect setup is personal. Experiment and adjust based on what works for your workflow and preferences.
        `,
        coverImage: "/gallery/Standing-Desk-Setup.webp",
        tags: ["Remote Work", "Productivity", "Development Environment", "Home Office"],
        published: true,
        likesCount: 15,
        createdAt: now - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        updatedAt: now - 1 * 24 * 60 * 60 * 1000,
      },
    ];

    // Insert all blog posts
    for (const post of blogPosts) {
      await ctx.db.insert("blogPosts", post);
    }

    return `Successfully seeded ${blogPosts.length} blog posts`;
  },
});