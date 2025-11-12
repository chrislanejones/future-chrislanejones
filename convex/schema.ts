import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  seoMetadata: defineTable({
    path: v.string(),
    title: v.string(),
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
  }).index("by_created", ["createdAt"]),

  browserLinks: defineTable({
    href: v.string(),
    label: v.string(),
    domain: v.string(),
    favicon: v.optional(v.string()),
    category: v.string(),
    color: v.string(), // Chrome tab group color
    order: v.number(), // For sorting within category
    createdAt: v.number(),
    updatedAt: v.number(),
    screenshotUrl: v.optional(v.string()),
    screenshotUpdatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"]),

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
    userIdentifier: v.string(), // Can be IP address or user ID
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user_post", ["userIdentifier", "postId"]),

  blogComments: defineTable({
    postId: v.id("blogPosts"),
    parentId: v.optional(v.id("blogComments")), // For nested replies
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
    iconName: v.string(), // Store icon name as string (e.g., "GradIcon", "VideoIcon")
    order: v.number(), // For sorting events
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_created", ["createdAt"]),

  media: defineTable({
    url: v.string(), // UploadThing URL
    filename: v.string(), // Original filename
    altText: v.optional(v.string()), // Alt text for accessibility
    size: v.optional(v.number()), // File size in bytes
    mimeType: v.optional(v.string()), // image/jpeg, image/png, etc.
    // Assignment tracking
    assignedToType: v.optional(v.string()), // "blogPost", "page", "gallery", "project", null/undefined = unassigned
    assignedToId: v.optional(v.string()), // blogPost _id, or page name like "home", "about"
    assignedToTitle: v.optional(v.string()), // Display name for what it's assigned to
    // Metadata
    uploadedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_assigned_type", ["assignedToType"])
    .index("by_assigned_id", ["assignedToId"])
    .index("by_uploaded", ["uploadedAt"]),
});
