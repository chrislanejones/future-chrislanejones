import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

async function requireAuth(ctx: { auth: any }): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
}

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

// Admin: Get all posts including unpublished
// Note: /admin/* is gated by Clerk middleware at the Next.js layer, so we don't
// re-check auth here — Clerk's session identity isn't always propagated to
// Convex queries in dev, which made this query return [] for signed-in admins.
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
    await requireAuth(ctx);
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { total: 0, byPost: [] };
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

<div class="not-prose rgc-root">
  <div class="rgc-banner" id="rgc-banner">Both languages put a value on the heap. From here their memory strategies diverge.</div>
  <div class="rgc-grid">
    <div class="rgc-panel">
      <div class="rgc-phead"><span class="rgc-ptitle">Rust — borrow checker</span><span class="rgc-pbadge">compile-time · zero runtime cost</span></div>
      <div class="rgc-code" id="rgc-r-code">let s = String::from("hi");</div>
      <p class="rgc-zone-label">Stack (bindings)</p>
      <div class="rgc-zone" id="rgc-r-stack"></div>
      <div class="rgc-divider"></div>
      <p class="rgc-zone-label">Heap</p>
      <div class="rgc-zone" id="rgc-r-heap"></div>
      <p class="rgc-note" id="rgc-r-note"></p>
    </div>
    <div class="rgc-panel">
      <div class="rgc-phead"><span class="rgc-ptitle">Garbage collector</span><span class="rgc-pbadge">runtime · traced</span></div>
      <div class="rgc-code" id="rgc-g-code">Node a = new Node("hi");</div>
      <p class="rgc-zone-label">Roots (references)</p>
      <div class="rgc-zone" id="rgc-g-stack"></div>
      <div class="rgc-divider"></div>
      <p class="rgc-zone-label">Heap</p>
      <div class="rgc-zone" id="rgc-g-heap"></div>
      <p class="rgc-note" id="rgc-g-note"></p>
    </div>
  </div>
  <div class="rgc-controls">
    <button class="rgc-btn" id="rgc-prev" aria-label="Previous step">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
    </button>
    <button class="rgc-btn" id="rgc-play">
      <svg id="rgc-play-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>
      <span id="rgc-play-label">Play</span>
    </button>
    <button class="rgc-btn" id="rgc-next" aria-label="Next step">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
    <div class="rgc-dots" id="rgc-dots"></div>
  </div>
</div>

<style>
.rgc-root{font-family:inherit;color:var(--color-ink);margin:24px 0}
.rgc-banner{background:var(--color-muted-accent);border:1px solid var(--color-border);border-radius:12px;padding:12px 16px;font-size:14px;line-height:1.6;margin:0 0 18px;min-height:52px}
.rgc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.rgc-panel{background:var(--color-panel);border:1px solid var(--color-border);border-radius:12px;padding:14px 16px}
.rgc-phead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.rgc-ptitle{font-size:15px;font-weight:600;color:var(--color-ink)}
.rgc-pbadge{font-size:11px;padding:3px 8px;border-radius:8px;background:var(--color-muted-accent);color:var(--color-muted);white-space:nowrap}
.rgc-code{font-family:ui-monospace,"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;font-size:13px;background:var(--color-inner-card);color:var(--color-ink);border-radius:8px;padding:8px 10px;margin-bottom:12px;min-height:18px;white-space:pre;overflow-x:auto}
.rgc-zone-label{font-size:11px;color:var(--color-muted);margin:0 0 6px;text-transform:uppercase;letter-spacing:.04em}
.rgc-zone{display:flex;flex-direction:column;gap:6px;min-height:34px;margin-bottom:12px}
.rgc-chip,.rgc-obj{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;font-family:ui-monospace,"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;font-size:13px;border:1px solid var(--color-border);transition:background .35s,color .35s}
.rgc-chip .rgc-ptr,.rgc-obj .rgc-badge{font-size:11px;opacity:.85}
.rgc-owner,.rgc-root-state,.rgc-live{background:color-mix(in srgb,var(--color-accent) 18%,transparent);color:var(--color-accent);border-color:color-mix(in srgb,var(--color-accent) 35%,transparent)}
.rgc-borrow{background:color-mix(in srgb,var(--color-accent-alt) 18%,transparent);color:var(--color-accent-alt);border-color:color-mix(in srgb,var(--color-accent-alt) 35%,transparent)}
.rgc-moved,.rgc-gone,.rgc-freed,.rgc-collected{background:var(--color-muted-accent);color:var(--color-muted);text-decoration:line-through;text-decoration-color:color-mix(in srgb,var(--color-muted) 70%,transparent)}
.rgc-unreachable{background:rgba(245,158,11,.18);color:#b45309;border-color:rgba(245,158,11,.45)}
html[data-theme="dark"] .rgc-unreachable{color:#fbbf24}
.rgc-note{font-size:12px;line-height:1.5;color:var(--color-muted);min-height:48px;margin:0}
.rgc-divider{height:1px;background:var(--color-border);margin:0 0 12px;opacity:.7}
.rgc-controls{display:flex;align-items:center;gap:10px;margin-top:18px;flex-wrap:wrap}
.rgc-btn{font:inherit;font-size:13px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;background:transparent;color:var(--color-ink);border:1px solid var(--color-border);border-radius:8px;padding:7px 11px;transition:background .15s,transform .1s,border-color .15s}
.rgc-btn:hover{background:var(--color-surface-hover);border-color:color-mix(in srgb,var(--color-accent) 40%,var(--color-border))}
.rgc-btn:active{transform:scale(.97)}
.rgc-btn svg{width:15px;height:15px;display:block}
.rgc-dots{display:flex;gap:6px;margin-left:auto}
.rgc-dot{width:8px;height:8px;border-radius:50%;background:var(--color-border);transition:background .25s}
.rgc-dot.rgc-on{background:var(--color-accent)}
</style>

<script>
(function(){
  var banners=[
   "Both languages put a value on the heap. From here their memory strategies diverge.",
   "Rust <b>moves</b> ownership — the old name dies. A GC just adds another reference; aliasing is fine.",
   "Rust verifies every borrow at compile time. The GC builds a reachability graph at runtime.",
   "Rust frees the value the instant its owner leaves scope — exact and predictable. The GC's objects are now garbage but still sitting in memory.",
   "Rust already cleaned up — there is no collector phase. The GC runs later, traces, and sweeps, costing pauses and unpredictable timing."
  ];
  var rust=[
   {code:'let s = String::from("hi");',stack:[{n:'s',p:'owns #1',s:'rgc-owner'}],heap:[{id:'#1',v:'"hi"',b:'live',s:'rgc-live'}],note:'s is the sole owner of the heap value. Exactly one owner, always.'},
   {code:'let t = s;',stack:[{n:'s',p:'moved',s:'rgc-moved'},{n:'t',p:'owns #1',s:'rgc-owner'}],heap:[{id:'#1',v:'"hi"',b:'live',s:'rgc-live'}],note:'Ownership moves to t. Touching s now is a compile error. Nothing is copied.'},
   {code:'let r = &t;',stack:[{n:'s',p:'moved',s:'rgc-moved'},{n:'t',p:'owns #1',s:'rgc-owner'},{n:'r',p:'borrows t',s:'rgc-borrow'}],heap:[{id:'#1',v:'"hi"',b:'live',s:'rgc-live'}],note:'r borrows t. The checker proves t outlives r and no aliasing rule is broken — all at compile time.'},
   {code:'}   // t leaves scope',stack:[{n:'t',p:'dropped',s:'rgc-gone'}],heap:[{id:'#1',v:'"hi"',b:'freed',s:'rgc-freed'}],note:'Owner leaves scope, so the value is dropped and freed right here. Deterministic, no collector.'},
   {code:'// no collector exists',stack:[],heap:[{id:'#1',v:'freed',b:'freed',s:'rgc-freed'}],note:'Already reclaimed at the brace above. Rust has no separate runtime collection phase at all.'}
  ];
  var gc=[
   {code:'Node a = new Node("hi");',stack:[{n:'a',p:'→ A',s:'rgc-root-state'}],heap:[{id:'A',v:'"hi"',b:'reachable',s:'rgc-live'}],note:'a references a freshly allocated object.'},
   {code:'Node b = a;',stack:[{n:'a',p:'→ A',s:'rgc-root-state'},{n:'b',p:'→ A',s:'rgc-root-state'}],heap:[{id:'A',v:'"hi"',b:'reachable',s:'rgc-live'}],note:'Two references to one object. Aliasing is allowed — there is no ownership concept.'},
   {code:'a.next = new Node("!");',stack:[{n:'a',p:'→ A',s:'rgc-root-state'},{n:'b',p:'→ A',s:'rgc-root-state'}],heap:[{id:'A',v:'"hi" → B',b:'reachable',s:'rgc-live'},{id:'B',v:'"!"',b:'reachable',s:'rgc-live'}],note:'The object graph grows. Reachability flows from the roots along references.'},
   {code:'a = null; b = null;',stack:[{n:'—',p:'no roots',s:'rgc-gone'}],heap:[{id:'A',v:'"hi" → B',b:'unreachable',s:'rgc-unreachable'},{id:'B',v:'"!"',b:'unreachable',s:'rgc-unreachable'}],note:'A and B are now unreachable — but still occupying memory. Nothing has been freed.'},
   {code:'// GC runs (sometime later)',stack:[{n:'—',p:'no roots',s:'rgc-gone'}],heap:[{id:'A',v:'collected',b:'collected',s:'rgc-collected'},{id:'B',v:'collected',b:'collected',s:'rgc-collected'}],note:'The collector traces from roots, marks A and B dead, then sweeps them. Timing is unpredictable.'}
  ];
  var step=0,timer=null;
  function $(id){return document.getElementById(id);}
  function chip(c){return '<div class="rgc-chip '+c.s+'"><span>'+c.n+'</span><span class="rgc-ptr">'+c.p+'</span></div>';}
  function obj(o){return '<div class="rgc-obj '+o.s+'"><span>'+o.id+' '+o.v+'</span><span class="rgc-badge">'+o.b+'</span></div>';}
  function render(){
    var r=rust[step],g=gc[step];
    $('rgc-banner').innerHTML=banners[step];
    $('rgc-r-code').textContent=r.code;
    $('rgc-r-stack').innerHTML=r.stack.map(chip).join('');
    $('rgc-r-heap').innerHTML=r.heap.map(obj).join('');
    $('rgc-r-note').textContent=r.note;
    $('rgc-g-code').textContent=g.code;
    $('rgc-g-stack').innerHTML=g.stack.map(chip).join('');
    $('rgc-g-heap').innerHTML=g.heap.map(obj).join('');
    $('rgc-g-note').textContent=g.note;
    var dotsEl=$('rgc-dots');
    for(var i=0;i<dotsEl.children.length;i++){
      if(i===step) dotsEl.children[i].classList.add('rgc-on');
      else dotsEl.children[i].classList.remove('rgc-on');
    }
  }
  function go(n){step=(n+rust.length)%rust.length;render();}
  var dots=$('rgc-dots');
  for(var i=0;i<rust.length;i++){
    var d=document.createElement('div');
    d.className='rgc-dot'+(i===0?' rgc-on':'');
    dots.appendChild(d);
  }
  function stop(){
    if(timer){
      clearInterval(timer);timer=null;
      $('rgc-play-icon').innerHTML='<path d="M8 5v14l11-7z"/>';
      $('rgc-play-label').textContent='Play';
    }
  }
  $('rgc-next').onclick=function(){stop();go(step+1);};
  $('rgc-prev').onclick=function(){stop();go(step-1);};
  $('rgc-play').onclick=function(){
    if(timer){stop();return;}
    $('rgc-play-icon').innerHTML='<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>';
    $('rgc-play-label').textContent='Pause';
    timer=setInterval(function(){go(step+1);},2200);
  };
  render();
})();
</script>

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