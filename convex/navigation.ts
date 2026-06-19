import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

async function requireAuth(ctx: { auth: any }): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
}
// CORRECTED IMPORT PATH: Use the path alias "@/data/navigation-seed"
import {
  staticHeaderNavItems,
  staticFooterNavLinks,
} from "@/scripts/navigation-seed"; // <-- CHANGED THIS LINE

// --- Header Navigation ---
export const getHeaderNavItems = query({
  args: {},
  handler: async (ctx) => {
    const mainItems = await ctx.db
      .query("headerNavItems")
      .filter((q) => q.eq(q.field("parentId"), undefined))
      .order("asc")
      .collect();

    const itemsWithChildren = await Promise.all(
      mainItems.map(async (item) => {
        const children = await ctx.db
          .query("headerNavItems")
          .filter((q) => q.eq(q.field("parentId"), item._id))
          .order("asc")
          .collect();
        return {
          ...item,
          children: children.length > 0 ? children : undefined,
        };
      })
    );
    return itemsWithChildren;
  },
});

export const addHeaderNavItem = mutation({
  args: {
    label: v.string(),
    href: v.optional(v.string()),
    isExternal: v.optional(v.boolean()),
    parentId: v.optional(v.id("headerNavItems")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("headerNavItems", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateHeaderNavItem = mutation({
  args: {
    id: v.id("headerNavItems"),
    label: v.optional(v.string()),
    href: v.optional(v.string()),
    isExternal: v.optional(v.boolean()),
    parentId: v.optional(v.id("headerNavItems")), // Can move items to new parent
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...updateData } = args;
    await ctx.db.patch(id, { ...updateData, updatedAt: Date.now() });
  },
});

export const deleteHeaderNavItem = mutation({
  args: { id: v.id("headerNavItems") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    // Delete children first if it's a parent
    const children = await ctx.db
      .query("headerNavItems")
      .filter((q) => q.eq(q.field("parentId"), args.id))
      .collect();
    for (const child of children) {
      await ctx.db.delete(child._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const reorderHeaderNavItems = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("headerNavItems"),
        order: v.number(),
        parentId: v.optional(v.id("headerNavItems")), // Allow changing parent during reorder
      })
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const now = Date.now();
    for (const update of args.updates) {
      await ctx.db.patch(update.id, {
        order: update.order,
        // Ensure that parentId is `undefined` (not `null`) for top-level items
        parentId: update.parentId === null ? undefined : update.parentId,
        updatedAt: now,
      });
    }
  },
});

// --- Footer Navigation ---
export const getFooterNavSections = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("footerNavSections")
      .order("asc")
      .collect();

    const sectionsWithLinks = await Promise.all(
      sections.map(async (section) => {
        const links = await ctx.db
          .query("footerNavLinks")
          .filter((q) => q.eq(q.field("sectionId"), section._id))
          .order("asc")
          .collect();
        return {
          ...section,
          links: links,
        };
      })
    );
    return sectionsWithLinks;
  },
});

export const addFooterNavSection = mutation({
  args: {
    title: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("footerNavSections", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateFooterNavSection = mutation({
  args: {
    id: v.id("footerNavSections"),
    title: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...updateData } = args;
    await ctx.db.patch(id, { ...updateData, updatedAt: Date.now() });
  },
});

export const deleteFooterNavSection = mutation({
  args: { id: v.id("footerNavSections") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    // Delete all links in this section first
    const links = await ctx.db
      .query("footerNavLinks")
      .filter((q) => q.eq(q.field("sectionId"), args.id))
      .collect();
    for (const link of links) {
      await ctx.db.delete(link._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const addFooterNavLink = mutation({
  args: {
    sectionId: v.id("footerNavSections"),
    label: v.string(),
    href: v.string(),
    isExternal: v.optional(v.boolean()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("footerNavLinks", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateFooterNavLink = mutation({
  args: {
    id: v.id("footerNavLinks"),
    sectionId: v.optional(v.id("footerNavSections")), // Allow moving links between sections
    label: v.optional(v.string()),
    href: v.optional(v.string()),
    isExternal: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...updateData } = args;
    await ctx.db.patch(id, { ...updateData, updatedAt: Date.now() });
  },
});

export const deleteFooterNavLink = mutation({
  args: { id: v.id("footerNavLinks") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
  },
});

export const reorderFooterNavLinks = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("footerNavLinks"),
        order: v.number(),
        sectionId: v.optional(v.id("footerNavSections")), // Allow changing section during reorder
      })
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const now = Date.now();
    for (const update of args.updates) {
      await ctx.db.patch(update.id, {
        order: update.order,
        sectionId: update.sectionId,
        updatedAt: now,
      });
    }
  },
});

// --- Footer Section Reorder Mutation (Added in previous step, confirming presence) ---
export const reorderFooterNavSections = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("footerNavSections"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const now = Date.now();
    for (const update of args.updates) {
      await ctx.db.patch(update.id, {
        order: update.order,
        updatedAt: now,
      });
    }
  },
});

// One-time migration: add Old Website link to Resources footer section
export const addOldWebsiteLink = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const sections = await ctx.db.query("footerNavSections").collect();
    const resourcesSection = sections.find((s) => s.title === "Resources");
    if (!resourcesSection) return "Resources section not found";

    const existingLinks = await ctx.db
      .query("footerNavLinks")
      .filter((q) => q.eq(q.field("sectionId"), resourcesSection._id))
      .collect();

    const alreadyExists = existingLinks.some(
      (l) => l.href === "https://old.chrislanejones.com"
    );
    if (alreadyExists) return "Link already exists";

    const maxOrder =
      existingLinks.length > 0
        ? Math.max(...existingLinks.map((l) => l.order)) + 1
        : 0;

    await ctx.db.insert("footerNavLinks", {
      sectionId: resourcesSection._id,
      label: "Old Website",
      href: "https://old.chrislanejones.com",
      isExternal: true,
      order: maxOrder,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return "Old website link added!";
  },
});

// --- Seeding Mutations ---
export const seedNavigationData = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const existingHeaderItems = await ctx.db.query("headerNavItems").collect();
    if (existingHeaderItems.length === 0) {
      console.log("Seeding header navigation items...");
      let order = 0;
      for (const item of staticHeaderNavItems) {
        if (item.children) {
          const parentId = await ctx.db.insert("headerNavItems", {
            label: item.label,
            href: item.href,
            order: order++,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          let childOrder = 0;
          for (const child of item.children) {
            await ctx.db.insert("headerNavItems", {
              label: child.label,
              href: child.href,
              isExternal: child.isExternal,
              parentId: parentId,
              order: childOrder++,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        } else {
          await ctx.db.insert("headerNavItems", {
            label: item.label,
            href: item.href,
            isExternal: item.isExternal,
            order: order++,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }
      console.log("Header navigation seeded.");
    }

    const existingFooterSections = await ctx.db
      .query("footerNavSections")
      .collect();
    if (existingFooterSections.length === 0) {
      console.log("Seeding footer navigation sections and links...");
      let sectionOrder = 0;
      for (const section of staticFooterNavLinks) {
        const sectionId = await ctx.db.insert("footerNavSections", {
          title: section.title,
          order: sectionOrder++,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        let linkOrder = 0;
        for (const link of section.links) {
          await ctx.db.insert("footerNavLinks", {
            sectionId: sectionId,
            label: link.label,
            href: link.href,
            isExternal: link.isExternal,
            order: linkOrder++,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }
      console.log("Footer navigation seeded.");
    }

    return "Navigation data seeded successfully!";
  },
});
