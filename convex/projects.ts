// convex/projects.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

async function requireAuth(ctx: { auth: any }): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
}

export const getAll = query({
  handler: async (ctx) => {
    return ctx.db.query("projects").order("desc").collect();
  },
});

export const getFeatured = query({
  handler: async (ctx) => {
    const items = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
    return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    features: v.optional(v.array(v.string())),
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
    features: v.optional(v.array(v.string())),
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

// Swap the order values of two featured projects (for reordering in admin)
export const swapFeaturedOrder = mutation({
  args: { idA: v.id("projects"), idB: v.id("projects") },
  handler: async (ctx, { idA, idB }) => {
    const a = await ctx.db.get(idA);
    const b = await ctx.db.get(idB);
    if (!a || !b) throw new Error("Project not found");
    const now = Date.now();
    await ctx.db.patch(idA, { order: b.order ?? 999, updatedAt: now });
    await ctx.db.patch(idB, { order: a.order ?? 999, updatedAt: now });
  },
});

export const seedProjects = mutation({
  args: {},
  handler: async (ctx) => {

    // Check per category so existing app projects don't block website seeding
    const existingApps = await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", "app"))
      .collect();
    const existingWebsites = await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", "website"))
      .collect();

    const now = Date.now();
    const projects = [
      // ── App projects ──────────────────────────────────────────────
      {
        title: "Image Editor & Optimizer",
        description:
          "Next.js + TanStack app for cropping, painting, blur tools, and batch processing. Optimized for performance with Tailwind and Plotly for data visualization.",
        category: "app",
        features: [
          "Offline-friendly and keyboard-navigable",
          "Undo/redo, rotation/flip, pagination",
          "Bulk crop mirroring across selected images",
          "Performance optimized with Web Workers",
          "Real-time image processing pipeline",
        ],
        image: "/projects/Image-Horse-App.webp",
        githubUrl:
          "https://github.com/chrislanejones/multi-image-compress-and-edit",
        vercelUrl: "https://rust-wasm-photo-tool.netlify.app/",
        featured: true,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Go Web Crawler",
        description:
          "This Go-based web crawler automatically scans multiple websites—recursively and intelligently—for specified links or text across HTML, PDF, and DOCX content, while detecting connectivity issues, network errors, and anti-bot protections.",
        category: "app",
        features: [
          "Built in Go (Golang) for high concurrency and efficient network operations",
          "Integrates PDF and DOCX parsing through external libraries (pdfcpu and gooxml)",
          "Features bot protection detection for systems like Cloudflare, Incapsula, and Sucuri",
          "Provides real-time progress tracking and detailed error categorization",
          "Supports multi-target, multi-site scanning with summarized CSV reporting per job",
        ],
        image: "/projects/Web-Crawler-Golang-App.webp",
        githubUrl: "https://github.com/chrislanejones/webcrawler-go",
        featured: true,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Vim/Neovim Shortcut Finder",
        description:
          "Interactive app to discover and master Vim/Neovim shortcuts via intuitive search and contextual learning.",
        category: "app",
        features: [
          "Interactive shortcut search and filtering",
          "Context-aware command suggestions",
          "Custom shortcut collection builder",
          "Practice mode with typing challenges",
          "Plugin compatibility checker",
        ],
        image: "/projects/MPC-Vim-Filter-Tool.webp",
        githubUrl: "https://github.com/chrislanejones/MPC-Vim-filter-tool",
        vercelUrl: "https://mpc-vim-filter-tool.vercel.app/",
        featured: true,
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
      // ── Website / client projects ─────────────────────────────────
      {
        title: "Alembic - AI Marketing Analytics Platform",
        description:
          "Enterprise-grade marketing intelligence platform that uses advanced causality models and AI to provide predictive insights and measure marketing ROI across all channels.",
        category: "website",
        features: [
          "Next.js 14 with App Router and server-side rendering",
          "Sanity CMS integration for dynamic content management",
          "Tailwind CSS for responsive enterprise UI/UX",
          "TypeScript for type-safe development",
          "Optimized image delivery and performance",
        ],
        image: "/projects/Get-Alembic-Website.webp",
        customUrl: "https://getalembic.com/",
        featured: false,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Job Listing Plugin for WordPress with Elementor Theme",
        description:
          "A comprehensive WordPress plugin that integrates with the Ashby job board API to display current job listings on your website using Elementor.",
        category: "website",
        features: [
          "Scheduled API data fetching at customizable times",
          "Database storage for improved performance",
          "Elementor widget for easy display",
          "Responsive card-based UI with customizable styling",
          "Admin interface for setup and management",
        ],
        image: "/projects/Job-Listing-WordPress-Plugin.webp",
        githubUrl: "https://github.com/chrislanejones/job-listing-plugin",
        featured: false,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Wheelock Communities - Real Estate Development",
        description:
          "Corporate website for Wheelock Communities, showcasing master-planned communities, luxury condominiums, and resort development projects across the United States.",
        category: "website",
        features: [
          "WordPress with custom theme development",
          "Advanced Custom Fields for flexible content management",
          "Responsive design with mobile-first approach",
          "Project portfolio with filterable gallery",
          "Optimized image delivery and lazy loading",
        ],
        image: "/projects/Wheelock-Communities.webp",
        customUrl: "https://wheel.chrislanejones.com/",
        featured: false,
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
    ];

    let inserted = 0;

    // Only seed each category if that category is completely empty
    if (existingApps.length === 0) {
      for (const project of projects.filter((p) => p.category === "app")) {
        await ctx.db.insert("projects", project);
        inserted++;
      }
    }
    if (existingWebsites.length === 0) {
      for (const project of projects.filter((p) => p.category === "website")) {
        await ctx.db.insert("projects", project);
        inserted++;
      }
    }

    return {
      message:
        inserted > 0
          ? `Inserted ${inserted} project(s)`
          : "Projects already seeded for all categories",
      inserted,
      existingApps: existingApps.length,
      existingWebsites: existingWebsites.length,
    };
  },
});
