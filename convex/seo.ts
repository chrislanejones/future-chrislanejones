import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

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
    const result = await ctx.db
      .query("seoMetadata")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();

    return result;
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

// Seed initial data with ALL pages
export const seedSEOData = mutation({
  handler: async (ctx) => {
    const pages = [
      {
        path: "/",
        title: "Chris Lane Jones | React & WordPress Developer in Virginia",
        description:
          "Full-stack developer specializing in Next.js, React, and WordPress. Building modern web applications for businesses and government agencies from Virginia.",
      },
      {
        path: "/about",
        title: "About Chris Jones | Developer, Hiker & Community Leader",
        description:
          "From video production to web development - my journey through React frameworks, leading Richmond's WordPress meetup, and life in Virginia's Shenandoah Mountains.",
      },
      {
        path: "/projects",
        title: "Web Development Projects | Next.js, React & WordPress Sites",
        description:
          "Full-stack projects featuring Next.js applications, WordPress plugins, image editors, and web tools. View my work with TypeScript, React, and modern frameworks.",
      },
      {
        path: "/career",
        title: "Career & Experience | Chris Lane Jones Web Developer",
        description:
          "10+ years from video editor to senior developer. Experience with React, Next.js, WordPress, and building solutions for Fortune 500 companies and government agencies.",
      },
      {
        path: "/browser-tabs",
        title: "Developer Resources & Tools | Curated Web Dev Bookmarks",
        description:
          "My collection of essential web development resources: React libraries, design tools, icon sets, UI frameworks, and learning materials I reference daily.",
      },
      {
        path: "/conferences",
        title: "Tech Conferences Attended | All Things Open, RenderATL & More",
        description:
          "Notes from web development conferences including All Things Open, WordCamp US, THAT Conference, RenderATL, and RVAJS. Insights from the JavaScript community.",
      },
      {
        path: "/link-page",
        title: "Connect With Chris Lane Jones | Social Media & Portfolio Links",
        description:
          "Find me on GitHub, LinkedIn, Twitter/X, and CodePen. Access my portfolio, blog posts, WordPress services, and web development resources all in one place.",
      },
      {
        path: "/logo-page",
        title: "Mountain Logo Design Story | Chris Lane Jones Brand Identity",
        description:
          "The meaning behind my mountain logo design - representing the journey through code and trails. Explore different logo variations and design philosophy.",
      },
      {
        path: "/site-history",
        title: "Portfolio Evolution | From WordPress 2.1 to Next.js React App",
        description:
          "18 years of website evolution: from the Kubrick WordPress theme in 2007 to modern Next.js. See how my portfolio transformed alongside web technology.",
      },
    ];

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
        });
        inserted++;
      } else {
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
