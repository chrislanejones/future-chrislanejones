import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

const KNOWN_PATHS = new Set([
  "/",
  "/about",
  "/blog",
  "/browser-tabs",
  "/career-and-resume",
  "/conferences",
  "/contact",
  "/link-page",
  "/logo-page",
  "/projects",
  "/react-maintenance",
  "/site-history",
  "/site-map",
  "/wordpress-maintenance",
]);

async function requireAuth(ctx: { auth: any }): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
}

export const getAllSEO = query({
  handler: async (ctx) => {
    return await ctx.db.query("seoMetadata").collect();
  },
});

export const getSEOByPath = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("seoMetadata")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();
    return result;
  },
});

export const updateSEO = mutation({
  args: {
    path: v.string(),
    title: v.string(),
    description: v.string(),
    canonicalUrl: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("seoMetadata")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();

    const canonical = args.canonicalUrl ?? args.path;

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        description: args.description,
        canonicalUrl: canonical,
        ogImage: args.ogImage,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("seoMetadata", {
        path: args.path,
        title: args.title,
        description: args.description,
        canonicalUrl: canonical,
        ogImage: args.ogImage,
        updatedAt: Date.now(),
      });
    }
  },
});

export const deleteSEO = mutation({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("seoMetadata")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { deleted: true };
    }
    return { deleted: false };
  },
});

export const getStaleSEOPaths = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("seoMetadata").collect();
    return all
      .filter((entry) => !KNOWN_PATHS.has(entry.path))
      .map((entry) => ({ path: entry.path, title: entry.title }));
  },
});

export const cleanupStaleSEO = internalMutation({
  handler: async (ctx) => {
    const all = await ctx.db.query("seoMetadata").collect();
    const stale = all.filter((entry) => !KNOWN_PATHS.has(entry.path));
    for (const entry of stale) {
      await ctx.db.delete(entry._id);
    }
    return { removed: stale.length, paths: stale.map((e) => e.path) };
  },
});

export const cleanupStaleSEOPublic = mutation({
  handler: async (ctx) => {
    const all = await ctx.db.query("seoMetadata").collect();
    const stale = all.filter((entry) => !KNOWN_PATHS.has(entry.path));
    for (const entry of stale) {
      await ctx.db.delete(entry._id);
    }
    return { removed: stale.length, paths: stale.map((e) => e.path) };
  },
});

export const seedSEOData = mutation({
  handler: async (ctx) => {
    const pages = [
      {
        path: "/",
        title: "Chris Lane Jones | Senior Web Engineer & AI Automation",
        description:
          "Senior web engineer based in Richmond, VA specializing in React, Next.js, and AI-powered applications. Building modern web experiences for businesses and government agencies.",
        canonicalUrl: "https://www.chrislanejones.com",
      },
      {
        path: "/about",
        title: "About Chris Lane Jones | Developer, Hiker & Community Leader",
        description:
          "Life on the trails and the web — from video production to full-stack development, leading the Richmond WordPress meetup, and building apps from Virginia's Shenandoah Mountains.",
        canonicalUrl: "https://www.chrislanejones.com/about",
      },
      {
        path: "/blog",
        title: "Blog | Web Development, React & WordPress Insights",
        description:
          "Thoughts on web development, React, Next.js, WordPress, and building things on the internet. Tips and lessons learned from real client work.",
        canonicalUrl: "https://www.chrislanejones.com/blog",
      },
      {
        path: "/projects",
        title: "Projects | Full-Stack Apps, Tools & Client Websites",
        description:
          "A collection of full-stack applications, tools, and client sites built with React, Next.js, TypeScript, and WordPress. Focus on performance and user experience.",
        canonicalUrl: "https://www.chrislanejones.com/projects",
      },
      {
        path: "/career-and-resume",
        title: "Career & Resume | Chris Lane Jones Web Developer",
        description:
          "Following the trail from video production to senior web engineer — navigating React frameworks, open-source communities, and a decade of client work along the way.",
        canonicalUrl: "https://www.chrislanejones.com/career-and-resume",
      },
      {
        path: "/browser-tabs",
        title: "Chrome Tabs I Left Open | Curated Dev Resources & Tools",
        description:
          "A curated collection of useful resources, tools, and inspiration I keep coming back to — React libraries, design systems, icon sets, and learning materials.",
        canonicalUrl: "https://www.chrislanejones.com/browser-tabs",
      },
      {
        path: "/conferences",
        title: "Conferences | All Things Open, WordCamp, RenderATL & More",
        description:
          "Highlights and notes from web and open-source conferences I've attended — All Things Open, WordCamp US, THAT Conference, RenderATL, and RVAJS.",
        canonicalUrl: "https://www.chrislanejones.com/conferences",
      },
      {
        path: "/contact",
        title: "Contact Chris Lane Jones | Web Development Services",
        description:
          "Get in touch about web development projects, WordPress maintenance, React consulting, or speaking at a meetup. Based in Virginia, available for remote work.",
        canonicalUrl: "https://www.chrislanejones.com/contact",
      },
      {
        path: "/link-page",
        title: "Links | Find Chris Lane Jones Online",
        description:
          "GitHub, LinkedIn, Twitter/X, CodePen, and more — all my links in one place. Find my portfolio, blog, and web development services.",
        canonicalUrl: "https://www.chrislanejones.com/link-page",
      },
      {
        path: "/logo-page",
        title: "About the Logo | Mountain as Metaphor for Code & Trails",
        description:
          "The mountain in my logo represents more than a visual — it mirrors the trails I hike in the Shenandoah and the peaks conquered in code. The story behind the design.",
        canonicalUrl: "https://www.chrislanejones.com/logo-page",
      },
      {
        path: "/site-history",
        title: "Site History | From WordPress 2.1 to Next.js",
        description:
          "The evolution of chrislanejones.com through various technologies and design iterations — from the Kubrick WordPress theme in 2007 to a modern Next.js and React application.",
        canonicalUrl: "https://www.chrislanejones.com/site-history",
      },
      {
        path: "/site-map",
        title: "Site Map & Changelog | chrislanejones.com",
        description:
          "Explore all available pages on chrislanejones.com and track site updates, new features, and content additions over time.",
        canonicalUrl: "https://www.chrislanejones.com/site-map",
      },
      {
        path: "/wordpress-maintenance",
        title: "WordPress Maintenance Services | Monthly Action Plan",
        description:
          "Three hours of site changes monthly — copy edits, plugin updates, security scans, performance optimization, and US-based technical support. Keep your WordPress site healthy.",
        canonicalUrl: "https://www.chrislanejones.com/wordpress-maintenance",
      },
      {
        path: "/react-maintenance",
        title: "React App Maintenance | Monthly Support & Optimization",
        description:
          "Three hours of React app changes monthly — component updates, dependency management, security audits, performance reviews, and US-based consulting for Next.js applications.",
        canonicalUrl: "https://www.chrislanejones.com/react-maintenance",
      },
    ];

    // Migrate stale /career path → /career-and-resume
    const staleCareer = await ctx.db
      .query("seoMetadata")
      .withIndex("by_path", (q) => q.eq("path", "/career"))
      .first();
    if (staleCareer) {
      await ctx.db.delete(staleCareer._id);
    }

    let inserted = 0;
    let updated = 0;
    for (const page of pages) {
      const existing = await ctx.db
        .query("seoMetadata")
        .withIndex("by_path", (q) => q.eq("path", page.path))
        .first();

      if (!existing) {
        await ctx.db.insert("seoMetadata", {
          ...page,
          updatedAt: Date.now(),
          canonicalUrl: page.canonicalUrl || page.path,
        });
        inserted++;
      } else {
        await ctx.db.patch(existing._id, {
          title: page.title,
          description: page.description,
          canonicalUrl: page.canonicalUrl || page.path,
          updatedAt: Date.now(),
        });
        updated++;
      }
    }

    return {
      success: true,
      total: pages.length,
      inserted,
      updated,
      message: `Seeded ${inserted} new pages, ${updated} already existed`,
    };
  },
});
