import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

import { requireAdmin as requireAuth, isAdmin } from "./authz";

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
      .withIndex("by_created")
      .order("desc")
      .filter((q) => q.eq(q.field("published"), true))
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

// Admin: Get all posts including unpublished. Convex functions are publicly
// callable regardless of the Next.js middleware, so drafts must be gated here.
// (The old "identity isn't propagated in dev" issue was middleware.ts sitting
// at the repo root where next dev ignored it — fixed by moving it into src/.)
export const getAllPostsAdmin = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return [];
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
    await requireAuth(ctx);
    // Slugs are the public URL and getPostBySlug uses .first(), so a duplicate
    // would make one post permanently unreachable. Reject the collision.
    const clash = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (clash) {
      throw new Error(`A post with slug "${args.slug}" already exists`);
    }
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
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...updateData } = args;
    // If the slug is changing, make sure no OTHER post already owns it.
    if (updateData.slug) {
      const clash = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", updateData.slug!))
        .first();
      if (clash && clash._id !== id) {
        throw new Error(`A post with slug "${updateData.slug}" already exists`);
      }
    }
    return await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    // Cascade: without this, deleting a post orphans its likes (still counted
    // in getAllLikesAdmin), its comments (shown as "Unknown Post" forever in
    // moderation), and its media (pinned to a dead id).
    const likes = await ctx.db
      .query("blogLikes")
      .withIndex("by_post", (q) => q.eq("postId", args.id))
      .collect();
    for (const like of likes) await ctx.db.delete(like._id);

    const comments = await ctx.db
      .query("blogComments")
      .withIndex("by_post", (q) => q.eq("postId", args.id))
      .collect();
    for (const comment of comments) await ctx.db.delete(comment._id);

    const media = await ctx.db
      .query("media")
      .withIndex("by_assigned_id", (q) => q.eq("assignedToId", args.id))
      .filter((q) => q.eq(q.field("assignedToType"), "blogPost"))
      .collect();
    for (const m of media) {
      await ctx.db.patch(m._id, {
        assignedToType: undefined,
        assignedToId: undefined,
        assignedToTitle: undefined,
        updatedAt: Date.now(),
      });
    }

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
    // Public — userIdentifier is an arbitrary client string; cap it so it can't
    // be used to write oversized rows.
    if (args.userIdentifier.length > 100) {
      throw new Error("Invalid identifier");
    }
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
    // Public, unauthenticated — cap lengths so it can't be used to bloat the DB.
    if (
      args.authorName.length > 200 ||
      args.authorEmail.length > 320 ||
      args.content.length > 5000
    ) {
      throw new Error("Comment exceeds allowed length");
    }
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
    if (!(await isAdmin(ctx))) return [];
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
    if (!(await isAdmin(ctx))) return 0;
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
    if (!(await isAdmin(ctx))) return { total: 0, byPost: [] };
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
    await requireAuth(ctx);
    return await ctx.db.patch(args.commentId, {
      approved: true,
      updatedAt: Date.now(),
    });
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("blogComments") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.delete(args.commentId);
  },
});

// Seed blog posts (upsert by slug so reseed works even when posts already exist)
export const seedBlogPosts = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
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

    let inserted = 0;
    let updated = 0;
    for (const post of blogPosts) {
      const existing = await ctx.db
        .query("blogPosts")
        .filter((q) => q.eq(q.field("slug"), post.slug))
        .first();
      if (existing) {
        const { likesCount: _ignoredLikes, createdAt: _ignoredCreated, ...rest } = post;
        await ctx.db.patch(existing._id, { ...rest, updatedAt: now });
        updated++;
      } else {
        await ctx.db.insert("blogPosts", post);
        inserted++;
      }
    }

    return {
      success: true,
      total: blogPosts.length,
      inserted,
      updated,
      message: `Seeded ${inserted} new posts, ${updated} updated`,
    };
  },
});

// One-off seed: Rust borrow checker vs garbage collector post with an
// interactive widget. Upserts by slug so re-running is safe.
export const seedRustVsGcPost = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const now = Date.now();
    const slug = "rust-borrow-checker-vs-garbage-collector";

    const content = `This post grew out of [ForrestKnight's video on the borrow checker](https://www.youtube.com/watch?v=meEXag1XCFw) — the one that finally pulled me away from Go and Zig and convinced me to reach for Rust the next time I needed something fast sitting next to a React app. If the borrow checker has been the thing keeping you on the fence, [his channel](https://www.youtube.com/@fknight) is worth a follow.

What clicked for me from that video was less "Rust syntax" and more *who is responsible for memory at each moment* — so this post tries to make that visible.

Most "Rust vs garbage-collected language" debates argue about syntax, or about whether the borrow checker is "worth the fight." The cleaner way to see the difference is to watch the memory itself — where the value lives, when it dies, and *who decides*.

So here's a side-by-side. Step through each line and watch how the two strategies diverge from the same starting point: a value on the heap.

<div class="not-prose" data-stepper="rust-vs-gc"></div>

## Two correct answers, two currencies

Both approaches are correct, but they pay for correctness in different currencies.

**Rust pays at compile time.** The borrow checker reads your code, proves that every reference is valid for as long as it's used, and emits the deallocation at the exact point the owner leaves scope. No runtime, no pauses, no late cleanup. The cost is that some programs that *would* be correct at runtime won't compile — you have to restructure them to satisfy the proof.

**A tracing GC pays at runtime.** Aliasing is free, the language doesn't care which reference "owns" what, and the collector handles cleanup whenever it decides to — usually triggered by allocation pressure. The cost is unpredictable pause times and a memory ceiling that lives above your actual working set.

## When each shines

- **Rust** fits well when you control the deploy, want predictable latency, and don't mind designing data structures around ownership. Game engines, embedded, command-line tools, network services where p99 matters more than developer velocity.
- **GC languages** fit well when objects move fast and ownership genuinely changes hands often, when the application is short-lived per request (most web backends), or when you want to ship features and let the runtime handle bookkeeping.

The "borrow checker is fighting me" frustration usually comes from trying to write GC-shaped code in Rust. Once you stop reaching for shared mutable graphs and start modeling ownership as a tree, the checker mostly gets out of the way — and the bug it's trying to prevent really would have bitten you in the GC version too, just later and quieter.
`;

    const tags = ["Rust", "Memory Management", "Performance", "Programming Languages"];
    const excerpt = "Compile-time ownership vs runtime tracing — stepped through side by side. Watch the same heap value live, alias, move, and die under two different memory strategies.";
    const title = "Rust borrow checker vs garbage collector";
    const coverImage = "/blog/rust-vs-gc.webp";

    const existing = await ctx.db
      .query("blogPosts")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        title,
        excerpt,
        content,
        coverImage,
        tags,
        published: true,
        updatedAt: now,
      });
      return { success: true, action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("blogPosts", {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags,
      published: true,
      likesCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    return { success: true, action: "inserted", id };
  },
});
// One-off migration: replace the inline widget blobs (container div + <style> +
// <script>) in the two interactive posts with a lightweight marker rendered by
// the shared <BlogStepper> React component. Safe to re-run (no-op once migrated).
export const migrateStepperWidgets = internalMutation({
  args: {},
  handler: async (ctx) => {
    const targets = [
      { slug: "rust-borrow-checker-vs-garbage-collector", widgetId: "rust-vs-gc", rootClass: "rgc-root" },
      { slug: "undo-snapshots-vs-operation-log", widgetId: "undo-vs-oplog", rootClass: "uhl-root" },
    ];
    const results: Array<{ slug: string; status: string }> = [];
    for (const { slug, widgetId, rootClass } of targets) {
      const post = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (!post) {
        results.push({ slug, status: "not found" });
        continue;
      }
      const re = new RegExp(
        `<div class="not-prose ${rootClass}">[\\s\\S]*?</script>`
      );
      if (!re.test(post.content)) {
        results.push({ slug, status: "already migrated / no widget block" });
        continue;
      }
      const marker = `<div class="not-prose" data-stepper="${widgetId}"></div>`;
      const content = post.content.replace(re, marker);
      await ctx.db.patch(post._id, { content, updatedAt: Date.now() });
      results.push({ slug, status: "migrated" });
    }
    return results;
  },
});
