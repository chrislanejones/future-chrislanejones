// convex/browserLinks.ts
import { query, mutation, action, internalAction } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { linkSeed } from "../src/data/linkSeed";

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
      screenshotUrl,
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
    const categoriesMap = new Map<string, string>();
    links.forEach((link) => {
      if (!categoriesMap.has(link.category)) {
        categoriesMap.set(link.category, link.color);
      }
    });
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
    return await ctx.db.insert("browserLinks", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
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
    await ctx.db.patch(id, { ...updateData, updatedAt: Date.now() });
  },
});

// Mutation to delete a link
export const deleteLink = mutation({
  args: { id: v.id("browserLinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation to bulk delete links by category
export const deleteCategory = mutation({
  args: { category: v.string() },
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

/**
 * Seed initial data (now sourced from src/data/linkSeed.ts)
 */
export const seedLinks = mutation({
  handler: async (ctx) => {
    let inserted = 0;

    for (const category of linkSeed) {
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
      message: `Seeded ${inserted} links across ${linkSeed.length} categories`,
    };
  },
});

// Helper to build screenshot request URL
function buildScreenshotRequest(href: string) {
  // 1) Validate the target URL
  let target: URL;
  try {
    target = new URL(href);
    if (!/^https?:$/.test(target.protocol)) {
      throw new Error("Only http(s) URLs are allowed");
    }
  } catch {
    throw new Error(`Invalid href passed to screenshot: "${href}"`);
  }

  // 2) Provider base
  const base = process.env.SCREENSHOT_API_URL;
  if (!base) throw new Error("SCREENSHOT_API_URL missing");

  // 3) Make a proper URL and add params
  const u = new URL(base);

  // allow custom param name (defaults to "url")
  const urlParam = process.env.SCREENSHOT_API_URL_PARAM || "url";
  u.searchParams.set(urlParam, target.toString());

  // optional common params (configure in Convex env if your provider needs them)
  if (process.env.SCREENSHOT_WIDTH) {
    u.searchParams.set("width", process.env.SCREENSHOT_WIDTH);
  }
  if (process.env.SCREENSHOT_HEIGHT) {
    u.searchParams.set("height", process.env.SCREENSHOT_HEIGHT);
  }
  if (process.env.SCREENSHOT_FULLPAGE) {
    u.searchParams.set("fullPage", process.env.SCREENSHOT_FULLPAGE);
  }
  if (process.env.SCREENSHOT_DPR) {
    u.searchParams.set("deviceScaleFactor", process.env.SCREENSHOT_DPR);
  }

  return u.toString();
}

/**
 * Action: generate a screenshot for a given link and upload to UploadThing
 */
export const generateScreenshot = action({
  args: { id: v.id("browserLinks"), href: v.string() },
  handler: async (ctx, { id, href }) => {
    const uploadThingSecret = process.env.UPLOADTHING_SECRET;

    if (!uploadThingSecret) {
      throw new Error("UPLOADTHING_SECRET not configured in Convex environment");
    }

    // Step 1: Generate screenshot
    const url = buildScreenshotRequest(href);
    const headers: Record<string, string> = {};
    if (process.env.SCREENSHOT_API_KEY) {
      headers.Authorization = `Bearer ${process.env.SCREENSHOT_API_KEY}`;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) {
      let body = "";
      try {
        body = await res.text();
      } catch {}
      throw new Error(
        `Screenshot fetch failed ${res.status} ${res.statusText} – ${body?.slice(0, 300) || "no body"}`
      );
    }

    const contentType = res.headers.get("content-type") || "";

    // If API returns JSON with URL, use that directly
    if (contentType.includes("application/json")) {
      const json = await res.json();
      const screenshotUrl = json?.url;
      if (!screenshotUrl || typeof screenshotUrl !== "string") {
        throw new Error(
          `Screenshot API JSON missing "url": ${JSON.stringify(json).slice(0, 300)}`
        );
      }
      await ctx.runMutation(api.browserLinks.upsertScreenshot, {
        id,
        screenshotUrl,
      });
      return screenshotUrl;
    }

    // Step 2: Upload image to UploadThing
    if (contentType.startsWith("image/")) {
      const imageBuffer = await res.arrayBuffer();
      const fileName = `screenshot-${Date.now()}.${contentType.includes('png') ? 'png' : 'jpg'}`;

      // Get presigned URL from UploadThing (v6 API - v7 doesn't exist yet)
      const uploadRes = await fetch(`https://api.uploadthing.com/v6/uploadFiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Uploadthing-Api-Key": uploadThingSecret,
          "X-Uploadthing-Version": "6.13.0",
        },
        body: JSON.stringify({
          files: [{
            name: fileName,
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
        const errorText = await uploadRes.text();
        throw new Error(`UploadThing API failed: ${uploadRes.status} - ${errorText}`);
      }

      const uploadData = await uploadRes.json();
      const presignedPost = uploadData.data?.[0];
      const fileKey = presignedPost?.key;
      const uploadUrl = presignedPost?.url;
      const fields = presignedPost?.fields;

      if (!uploadUrl || !fileKey) {
        throw new Error(`No presigned URL from UploadThing: ${JSON.stringify(uploadData)}`);
      }

      // UploadThing v6 requires multipart/form-data with fields
      const formData = new FormData();

      // Add all the fields returned by UploadThing
      if (fields) {
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
      }

      // Add the file itself
      const blob = new Blob([imageBuffer], { type: contentType });
      formData.append("file", blob, fileName);

      // Upload using POST with multipart/form-data
      const fileUploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!fileUploadRes.ok) {
        const errorText = await fileUploadRes.text();
        throw new Error(`File upload to UploadThing failed: ${fileUploadRes.status} - ${errorText}`);
      }

      // Construct the final URL
      const screenshotUrl = `https://utfs.io/f/${fileKey}`;

      // Save to database
      await ctx.runMutation(api.browserLinks.upsertScreenshot, {
        id,
        screenshotUrl,
      });

      return screenshotUrl;
    }

    const preview = (await res.text()).slice(0, 300);
    throw new Error(
      `Unexpected content-type from screenshot API: "${contentType}". First 300 chars: ${preview}`
    );
  },
});

// Legacy alias
export const generateUPLOADTHING = generateScreenshot;

/**
 * Public action to refresh all screenshots
 */
export const refreshAllScreenshots = action({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.runQuery(api.browserLinks.getAll);
    for (const link of links) {
      try {
        await ctx.runAction(api.browserLinks.generateScreenshot, {
          id: link._id,
          href: link.href,
        });
        await new Promise((r) => setTimeout(r, 1000)); // simple throttle
      } catch (err) {
        console.error("Screenshot generation failed:", link.href, err);
      }
    }
  },
});

/**
 * Internal (cron) wrapper
 */
export const refreshAllScreenshotsInternal = internalAction({
  args: {},
  handler: async (ctx) => {
    await ctx.runAction(api.browserLinks.refreshAllScreenshots);
  },
});

// Legacy aliases
export const refreshAllUPLOADTHINGs = refreshAllScreenshots;
export const refreshAllUPLOADTHINGsInternal = refreshAllScreenshotsInternal;
