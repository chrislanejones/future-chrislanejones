import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

import { requireAdmin as requireAuth, isAdmin } from "./authz";

// The headshot the home page, link page and admin avatar all fall back to. It
// ships in /public, so the path is stable across deploys.
export const PROFILE_PHOTO_URL = "/Professional-Photo-of-Chris-Lane-Jones.webp";

// Get the profile (there should only be one). Public — name/avatar/bio/social
// are shown across the site — but the owner's email is admin-only, so strip it
// for unauthenticated callers.
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("siteSettings").first();
    if (!profile) return profile;
    if (await isAdmin(ctx)) return profile;
    // Keep the shape stable for consumers; just hide the owner's email.
    return { ...profile, email: undefined };
  },
});

// Update or create the profile
export const updateProfile = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    avatar: v.optional(v.string()),
    email: v.optional(v.string()),
    location: v.optional(v.string()),
    // NB: no socialLinks here on purpose. Social profiles live in their own
    // `socialLinks` table now (see convex/socialLinks.ts) so they can carry
    // per-surface ordering; the old embedded object is deprecated.
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("siteSettings", {
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update just the avatar
export const updateAvatar = mutation({
  args: {
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        avatar: args.avatar,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create with defaults if doesn't exist
      return await ctx.db.insert("siteSettings", {
        name: "",
        bio: "",
        avatar: args.avatar,
        updatedAt: Date.now(),
      });
    }
  },
});

// Remove avatar
export const removeAvatar = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        avatar: undefined,
        updatedAt: Date.now(),
      });
    }
  },
});

// Seed default profile data
export const seedProfile = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      // The profile row already exists in production, so a plain early return
      // would never give it the avatar the site now reads from Convex. Backfill
      // just that one field, and leave everything the admin has edited alone.
      if (!existing.avatar) {
        await ctx.db.patch(existing._id, {
          avatar: PROFILE_PHOTO_URL,
          updatedAt: Date.now(),
        });
        return { success: true, message: "Profile avatar backfilled" };
      }
      return { success: true, message: "Profile already exists" };
    }

    await ctx.db.insert("siteSettings", {
      name: "Chris Lane Jones",
      bio: "Full-stack developer specializing in Next.js, React, and WordPress. Building modern web applications for businesses and government agencies from Jacksonville, Florida.",
      avatar: PROFILE_PHOTO_URL,
      email: "",
      location: "Jacksonville, Florida",
      updatedAt: Date.now(),
    });

    return { success: true, message: "Profile seeded successfully" };
  },
});
