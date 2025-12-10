import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get the profile (there should only be one)
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("siteSettings").first();
    return profile;
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
    socialLinks: v.optional(
      v.object({
        github: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        codepen: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
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
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      return { success: true, message: "Profile already exists" };
    }

    await ctx.db.insert("siteSettings", {
      name: "Chris Lane Jones",
      bio: "Full-stack developer specializing in Next.js, React, and WordPress. Building modern web applications for businesses and government agencies from Virginia.",
      email: "",
      location: "Louisa, Virginia",
      socialLinks: {
        github: "https://github.com/chrislanejones",
        linkedin: "https://linkedin.com/in/chrislanejones",
        twitter: "https://twitter.com/chrislanejones",
        codepen: "https://codepen.io/chrislanejones",
      },
      updatedAt: Date.now(),
    });

    return { success: true, message: "Profile seeded successfully" };
  },
});
