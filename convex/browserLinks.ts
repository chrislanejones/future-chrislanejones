// convex/browserLinks.ts
import { query, mutation, action, internalAction } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

/**
 * Query: get all saved browser links
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("browserLinks").order("desc").collect();
  },
});

export const upsertScreenshot = mutation({
  args: {
    id: v.id("browserLinks"),
    screenshotUrl: v.string(),
  },
  handler: async (ctx, { id, screenshotUrl }) => {
    await ctx.db.patch(id, {
      screenshotUrl: screenshotUrl,
      screenshotUpdatedAt: Date.now(),
    });
  },
});

// Mutation to delete all screenshots
export const deleteAllScreenshots = mutation({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db.query("browserLinks").collect();

    for (const link of links) {
      await ctx.db.patch(link._id, {
        screenshotUrl: undefined,
        screenshotUpdatedAt: undefined,
        // Also clear legacy fields
        UPLOADTHINGUrl: undefined,
        UPLOADTHINGUpdatedAt: undefined,
      });
    }

    return { deleted: links.length };
  },
});

// Query to get links by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("browserLinks")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    return links.sort((a, b) => a.order - b.order);
  },
});

// Query to get all unique categories with their colors
export const getCategories = query({
  handler: async (ctx) => {
    const links = await ctx.db.query("browserLinks").collect();

    // Create a map of unique categories with their colors
    const categoriesMap = new Map<string, string>();
    links.forEach((link) => {
      if (!categoriesMap.has(link.category)) {
        categoriesMap.set(link.category, link.color);
      }
    });

    // Convert to array of objects
    return Array.from(categoriesMap.entries()).map(([category, color]) => ({
      category,
      color,
    }));
  },
});

// Mutation to create a new link
export const create = mutation({
  args: {
    href: v.string(),
    label: v.string(),
    domain: v.string(),
    favicon: v.optional(v.string()),
    category: v.string(),
    color: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const linkId = await ctx.db.insert("browserLinks", {
      href: args.href,
      label: args.label,
      domain: args.domain,
      favicon: args.favicon,
      category: args.category,
      color: args.color,
      order: args.order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return linkId;
  },
});

// Mutation to update a link
export const update = mutation({
  args: {
    id: v.id("browserLinks"),
    href: v.string(),
    label: v.string(),
    domain: v.string(),
    favicon: v.optional(v.string()),
    category: v.string(),
    color: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to delete a link
export const deleteLink = mutation({
  args: {
    id: v.id("browserLinks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation to bulk delete links by category
export const deleteCategory = mutation({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const linksInCategory = await ctx.db
      .query("browserLinks")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    for (const link of linksInCategory) {
      await ctx.db.delete(link._id);
    }

    return linksInCategory.length;
  },
});

// Mutation to seed initial data from BrowserTabs component
export const seedLinks = mutation({
  handler: async (ctx) => {
    const linkCategories = [
      {
        title: "Development Tools",
        color: "orange",
        links: [
          {
            href: "https://effect.website/",
            label: "Effect - TypeScript Library",
            domain: "effect.website",
            favicon: "https://effect.website/favicon.ico",
          },
          {
            href: "https://effect.website/docs/getting-started/using-generators/",
            label: "Effect Generators Guide",
            domain: "effect.website",
            favicon: "https://effect.website/favicon.ico",
          },
          {
            href: "https://github.com/aulianza/aulianza.id",
            label: "aulianza.id",
            domain: "github.com",
            favicon: "https://github.com/favicon.ico",
          },
          {
            href: "https://www.augmentcode.com/",
            label: "Augment Code",
            domain: "augmentcode.com",
            favicon: "https://www.augmentcode.com/favicon.ico",
          },
          {
            href: "https://bun.sh/docs",
            label: "Bun Documentation",
            domain: "bun.sh",
            favicon: "https://bun.sh/favicon.ico",
          },
        ],
      },
      {
        title: "Design & UI Resources",
        color: "cyan",
        links: [
          {
            href: "https://www.chakra-ui.com/playground",
            label: "Chakra UI Playground",
            domain: "chakra-ui.com",
            favicon: "https://www.chakra-ui.com/favicon.ico",
          },
          {
            href: "https://pro.aceternity.com/products/navbars",
            label: "Aceternity UI Components",
            domain: "aceternity.com",
            favicon: "https://pro.aceternity.com/favicon.ico",
          },
          {
            href: "https://www.heroui.com/docs/components/number-input",
            label: "Hero UI Components",
            domain: "heroui.com",
            favicon: "https://www.heroui.com/favicon.ico",
          },
          {
            href: "https://www.radix-ui.com/",
            label: "Radix UI",
            domain: "radix-ui.com",
            favicon: "https://www.radix-ui.com/favicon.ico",
          },
          {
            href: "https://www.framer.com/motion/",
            label: "Framer Motion",
            domain: "framer.com",
            favicon: "https://www.framer.com/favicon.ico",
          },
        ],
      },
      {
        title: "Learning & Tutorials",
        color: "purple",
        links: [
          {
            href: "https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/",
            label: "Josh Comeau - SVG Guide",
            domain: "joshwcomeau.com",
            favicon: "https://www.joshwcomeau.com/favicon.ico",
          },
          {
            href: "https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/",
            label: "Shaders with R3F",
            domain: "blog.maximeheckel.com",
            favicon: "https://blog.maximeheckel.com/favicon.ico",
          },
          {
            href: "https://learnxinyminutes.com/zig/",
            label: "Learn X in Y minutes",
            domain: "learnxinyminutes.com",
            favicon: "https://learnxinyminutes.com/favicon.ico",
          },
          {
            href: "https://developer.mozilla.org/",
            label: "MDN Web Docs",
            domain: "developer.mozilla.org",
            favicon: "https://developer.mozilla.org/favicon.ico",
          },
          {
            href: "https://samwho.dev/load-balancing/",
            label: "Load Balancing Guide",
            domain: "samwho.dev",
            favicon: "https://samwho.dev/favicon.ico",
          },
        ],
      },
      {
        title: "Layout & Design Patterns",
        color: "green",
        links: [
          {
            href: "https://blog.openreplay.com/bento-box--a-refreshing-layout-approach-for-websites/",
            label: "Bento Box Layouts",
            domain: "blog.openreplay.com",
            favicon: "https://blog.openreplay.com/favicon.ico",
          },
          {
            href: "https://iamsteve.me/blog/bento-layout-css-grid",
            label: "Bento Layout CSS Grid",
            domain: "iamsteve.me",
            favicon: "https://iamsteve.me/favicon.ico",
          },
          {
            href: "https://bentogrids.com/",
            label: "Bento Grids",
            domain: "bentogrids.com",
            favicon: "https://bentogrids.com/favicon.ico",
          },
          {
            href: "https://dev.to/terenvelan/creating-variants-of-react-component-2b8m",
            label: "React Component Variants",
            domain: "dev.to",
            favicon: "https://dev.to/favicon.ico",
          },
          {
            href: "https://icograms.com/designer",
            label: "Icograms Designer",
            domain: "icograms.com",
            favicon: "https://icograms.com/favicon.ico",
          },
        ],
      },
      {
        title: "Icon Libraries",
        color: "blue",
        links: [
          {
            href: "https://lucide.dev/icons/",
            label: "Lucide Icons",
            domain: "lucide.dev",
            favicon: "https://lucide.dev/favicon.ico",
          },
          {
            href: "https://react-icons.github.io/react-icons/",
            label: "React Icons",
            domain: "react-icons.github.io",
            favicon: "https://react-icons.github.io/favicon.ico",
          },
          {
            href: "https://simpleicons.org/",
            label: "Simple Icons",
            domain: "simpleicons.org",
            favicon: "https://simpleicons.org/favicon.ico",
          },
          {
            href: "https://feathericons.com/",
            label: "Feather Icons",
            domain: "feathericons.com",
            favicon: "https://feathericons.com/favicon.ico",
          },
          {
            href: "https://flowbite.com/icons/",
            label: "Flowbite Icons",
            domain: "flowbite.com",
            favicon: "https://flowbite.com/favicon.ico",
          },
        ],
      },
      {
        title: "Developer Portfolios",
        color: "pink",
        links: [
          {
            href: "https://www.ericwu.me/",
            label: "Eric Wu",
            domain: "ericwu.me",
            favicon: "https://www.ericwu.me/favicon.ico",
          },
          {
            href: "https://www.braydoncoyer.dev/",
            label: "Braydon Coyer",
            domain: "braydoncoyer.dev",
            favicon: "https://www.braydoncoyer.dev/favicon.ico",
          },
          {
            href: "https://www.rachelhow.com/",
            label: "Rachel How",
            domain: "rachelhow.com",
            favicon: "https://www.rachelhow.com/favicon.ico",
          },
          {
            href: "https://kentcdodds.com/",
            label: "Kent C. Dodds",
            domain: "kentcdodds.com",
            favicon: "https://kentcdodds.com/favicon.ico",
          },
          {
            href: "https://azumbrunnen.me/",
            label: "Adrian Zumbrunnen",
            domain: "azumbrunnen.me",
            favicon: "https://azumbrunnen.me/favicon.ico",
          },
        ],
      },
      {
        title: "FOSS",
        color: "red",
        links: [
          {
            href: "https://github.com/immich-app/immich",
            label: "Immich - Photo Backup",
            domain: "github.com",
            favicon: "https://github.com/favicon.ico",
          },
          {
            href: "https://omarchy.org/",
            label: "Omarchy Linux",
            domain: "omarchy.org",
            favicon: "https://omarchy.org/favicon.ico",
          },
          {
            href: "https://jellyfin.org/",
            label: "Jellyfin - Media Server",
            domain: "jellyfin.org",
            favicon: "https://jellyfin.org/favicon.ico",
          },
          {
            href: "https://github.com/meichthys/foss_photo_libraries",
            label: "FOSS Photo Software",
            domain: "github.com",
            favicon: "https://github.com/favicon.ico",
          },
        ],
      },
    ];

    let inserted = 0;

    for (const category of linkCategories) {
      for (let i = 0; i < category.links.length; i++) {
        const link = category.links[i];
        await ctx.db.insert("browserLinks", {
          href: link.href,
          label: link.label,
          domain: link.domain,
          favicon: link.favicon,
          category: category.title,
          color: category.color,
          order: i,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        inserted++;
      }
    }

    return {
      success: true,
      inserted,
      message: `Seeded ${inserted} links across ${linkCategories.length} categories`,
    };
  },
});

/**
 * Action: generate a screenshot for a given link
 * Env:
 *   SCREENSHOT_API_URL (e.g. https://api.screenshotone.com/take?access_key=KEY&url=)
 *   UPLOADTHING_SECRET (for uploading to UploadThing)
 *   UPLOADTHING_APP_ID (for uploading to UploadThing)
 *
 * Flow: Screenshot API → UploadThing Storage → Save URL to database
 */
export const generateScreenshot = action({
  args: {
    id: v.id("browserLinks"),
    href: v.string(),
  },
  handler: async (ctx, { id, href }) => {
    const screenshotApiUrl = process.env.SCREENSHOT_API_URL;
    const uploadThingSecret = process.env.UPLOADTHING_SECRET;
    const uploadThingAppId = process.env.UPLOADTHING_APP_ID;

    // Check for UploadThing credentials
    if (!uploadThingSecret || !uploadThingAppId) {
      throw new Error(
        "UploadThing not configured. Set UPLOADTHING_SECRET and UPLOADTHING_APP_ID in Convex env"
      );
    }
    console.log("UploadThing Secret (masked):", uploadThingSecret.substring(0, 5) + "...");
    console.log("UploadThing App ID:", uploadThingAppId);

    // Check for screenshot API
    if (!screenshotApiUrl) {
      throw new Error(
        "SCREENSHOT_API_URL not configured. Run: npx convex env set SCREENSHOT_API_URL \"https://your-api.com/screenshot?url=\" - See SCREENSHOT_API_SETUP.md"
      );
    }

    // Step 1: Generate screenshot using screenshot API
    // Note: Thum.io and some other services need the URL NOT encoded, just appended
    const url = `${screenshotApiUrl}${href}`;
    const screenshotRes = await fetch(url);

    if (!screenshotRes.ok) {
      throw new Error(`Screenshot API failed: ${screenshotRes.status} ${screenshotRes.statusText}`);
    }

    // Get screenshot image bytes
    const imageBuffer = await screenshotRes.arrayBuffer();
    const contentType = screenshotRes.headers.get("content-type") || "image/png";

    // Step 2: Upload to UploadThing
    const uploadRes = await fetch(`https://api.uploadthing.com/v6/uploadFiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Uploadthing-Api-Key": uploadThingSecret,
        "X-Uploadthing-Version": "6.4.0",
      },
      body: JSON.stringify({
        files: [{
          name: `screenshot-${Date.now()}.${contentType.includes('png') ? 'png' : 'jpg'}`,
          size: imageBuffer.byteLength,
          type: contentType,
        }],
        metadata: {
          linkId: id,
          url: href,
        },
      }),
    });

    if (!uploadRes.ok) {
      throw new Error(`UploadThing API failed: ${uploadRes.status}`);
    }

    const uploadData = await uploadRes.json();

    // Get the presigned URL for upload
    const presignedUrl = uploadData.data?.[0]?.url;
    if (!presignedUrl) {
      throw new Error("No presigned URL from UploadThing");
    }

    // Upload the actual file
    const fileUploadRes = await fetch(presignedUrl, {
      method: "PUT",
      body: imageBuffer,
      headers: {
        "Content-Type": "image/png",
      },
    });

    if (!fileUploadRes.ok) {
      throw new Error(`File upload failed: ${fileUploadRes.status}`);
    }

    // Get the final file URL
    const fileKey = uploadData.data?.[0]?.key;
    const screenshotUrl = `https://utfs.io/f/${fileKey}`;

    // Step 3: Save to database
    await ctx.runMutation(api.browserLinks.upsertScreenshot, {
      id,
      screenshotUrl,
    });

    return screenshotUrl;
  },
});

// Legacy action name for backward compatibility
export const generateUPLOADTHING = generateScreenshot;

/**
 * Action: refresh all screenshots (public, can be called from UI)
 */
export const refreshAllScreenshots = action({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.runQuery(api.browserLinks.getAll);

    // For large datasets, consider chunking / retries / rate limiting
    for (const link of links) {
      try {
        await ctx.runAction(api.browserLinks.generateScreenshot, {
          id: link._id,
          href: link.href,
        });
        // Add a 1-second delay to avoid rate-limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error("Screenshot generation failed:", link.href, err);
      }
    }
  },
});

/**
 * Internal Action: refresh all screenshots (for monthly cron)
 * Cron should call this (see convex/crons.ts)
 */
export const refreshAllScreenshotsInternal = internalAction({
  args: {},
  handler: async (ctx) => {
    // Just call the public action
    await ctx.runAction(api.browserLinks.refreshAllScreenshots);
  },
});

// Legacy names for backward compatibility
export const refreshAllUPLOADTHINGs = refreshAllScreenshots;
export const refreshAllUPLOADTHINGsInternal = refreshAllScreenshotsInternal;
