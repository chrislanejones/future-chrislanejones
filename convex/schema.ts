import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  siteSettings: defineTable({
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
      }),
    ),
    updatedAt: v.number(),
  }),

  seoMetadata: defineTable({
    path: v.string(),
    title: v.string(),
    description: v.string(),
    canonicalUrl: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_path", ["path"]),

  pageHeaders: defineTable({
    path: v.string(),
    title: v.string(),
    breadcrumbPage: v.string(),
    description: v.string(),
    updatedAt: v.number(),
  }).index("by_path", ["path"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
    source: v.string(),
  }).index("by_created", ["createdAt"]),

  browserLinks: defineTable({
    href: v.string(),
    label: v.string(),
    domain: v.string(),
    favicon: v.optional(v.string()),
    category: v.string(),
    color: v.string(),
    order: v.number(),
    featured: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
    screenshotUrl: v.optional(v.string()),
    screenshotUpdatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"])
    .index("by_featured", ["featured"]),

  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.boolean(),
    likesCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_created", ["createdAt"]),

  blogLikes: defineTable({
    postId: v.id("blogPosts"),
    userIdentifier: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user_post", ["userIdentifier", "postId"]),

  blogComments: defineTable({
    postId: v.id("blogPosts"),
    parentId: v.optional(v.id("blogComments")),
    authorName: v.string(),
    authorEmail: v.string(),
    content: v.string(),
    approved: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_parent", ["parentId"])
    .index("by_approved", ["approved"])
    .index("by_created", ["createdAt"]),

  careerTimeline: defineTable({
    year: v.string(),
    title: v.string(),
    description: v.string(),
    location: v.optional(v.string()),
    iconName: v.string(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_created", ["createdAt"]),

  media: defineTable({
    url: v.string(),
    filename: v.string(),
    altText: v.optional(v.string()),
    size: v.optional(v.number()),
    mimeType: v.optional(v.string()),
    assignedToType: v.optional(v.string()),
    assignedToId: v.optional(v.string()),
    assignedToTitle: v.optional(v.string()),
    uploadedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_assigned_type", ["assignedToType"])
    .index("by_assigned_id", ["assignedToId"])
    .index("by_uploaded", ["uploadedAt"]),

  headerNavItems: defineTable({
    label: v.string(),
    href: v.optional(v.string()),
    isExternal: v.optional(v.boolean()),
    order: v.number(),
    parentId: v.optional(v.id("headerNavItems")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_parent_order", ["parentId", "order"]),

  footerNavSections: defineTable({
    title: v.string(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_order", ["order"]),

  footerNavLinks: defineTable({
    sectionId: v.id("footerNavSections"),
    label: v.string(),
    href: v.string(),
    isExternal: v.optional(v.boolean()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_section_order", ["sectionId", "order"]),

  homeGallery: defineTable({
    position: v.number(), // 1 = featured, 2-6 = other slots
    url: v.string(),
    alt: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_position", ["position"]),

  projects: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "app" or "website"
    image: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    codebergUrl: v.optional(v.string()),
    vercelUrl: v.optional(v.string()),
    customUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_featured", ["featured"])
    .index("by_category", ["category"])
    .index("by_order", ["order"])
    .index("by_created", ["createdAt"]),
});
