import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all gallery items ordered by position
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("homeGallery")
      .withIndex("by_position")
      .collect();
    return items.sort((a, b) => a.position - b.position);
  },
});

// Get gallery for public display (returns in format for the gallery component)
export const getGalleryPhotos = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("homeGallery")
      .withIndex("by_position")
      .collect();

    return items
      .sort((a, b) => a.position - b.position)
      .map((item) => ({
        src: item.url,
        alt: item.alt,
        description: item.description || item.alt,
      }));
  },
});

// Set image at a specific position (upsert)
export const setPosition = mutation({
  args: {
    position: v.number(),
    url: v.string(),
    alt: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if position already exists
    const existing = await ctx.db
      .query("homeGallery")
      .withIndex("by_position")
      .filter((q) => q.eq(q.field("position"), args.position))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        url: args.url,
        alt: args.alt,
        description: args.description,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new
      return await ctx.db.insert("homeGallery", {
        position: args.position,
        url: args.url,
        alt: args.alt,
        description: args.description,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Remove image from a position
export const removePosition = mutation({
  args: {
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("homeGallery")
      .withIndex("by_position")
      .filter((q) => q.eq(q.field("position"), args.position))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { success: true };
    }
    return { success: false };
  },
});

// Update alt text and description for a position
export const updateMetadata = mutation({
  args: {
    position: v.number(),
    alt: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("homeGallery")
      .withIndex("by_position")
      .filter((q) => q.eq(q.field("position"), args.position))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        alt: args.alt,
        description: args.description,
        updatedAt: Date.now(),
      });
      return { success: true };
    }
    return { success: false };
  },
});

// Seed with initial data from the static gallery
export const seedGallery = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Initial gallery photos from the static file
    const initialPhotos = [
      {
        position: 1,
        url: "/gallery/fan-gallery/Theo-and-I-at-RenderATL.webp",
        alt: "Theo Browne and Chris at Render 2024",
        description: "Theo Browne and I at Render 2024",
      },
      {
        position: 2,
        url: "/gallery/fan-gallery/Jason-Lengstorf-and-I.webp",
        alt: "Jason Lengstorf and I at Epic Web Conf 2025",
        description: "Jason Lengstorf and I at Epic Web Conf 2025",
      },
      {
        position: 3,
        url: "/gallery/fan-gallery/Group-Photo-With-Kent-C-Dodds-at-THAT-Conf.webp",
        alt: "Group Photo with Kent C. Dodds at THAT Conf WI 2024",
        description: "Group Photo with Kent C. Dodds at THAT Conf WI 2024",
      },
      {
        position: 4,
        url: "/gallery/fan-gallery/Kevin-Powell-And-I-THAT-Conf.webp",
        alt: "Kevin Powell And I THAT Conference WI 2025",
        description: "Kevin Powell And I THAT Conf WI 2025",
      },
      {
        position: 5,
        url: "/gallery/fan-gallery/ChrisSev-Avindra-and-I-ATO-2024.webp",
        alt: "Chris Sev, Avindra Fernando, and I at ATO 2024",
        description: "Chris Sev, Avindra Fernando, and I at ATO 2024",
      },
    ];

    let inserted = 0;
    let updated = 0;

    for (const photo of initialPhotos) {
      const existing = await ctx.db
        .query("homeGallery")
        .withIndex("by_position")
        .filter((q) => q.eq(q.field("position"), photo.position))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          url: photo.url,
          alt: photo.alt,
          description: photo.description,
          updatedAt: now,
        });
        updated++;
      } else {
        await ctx.db.insert("homeGallery", {
          ...photo,
          createdAt: now,
          updatedAt: now,
        });
        inserted++;
      }
    }

    return { success: true, inserted, updated, total: initialPhotos.length };
  },
});
