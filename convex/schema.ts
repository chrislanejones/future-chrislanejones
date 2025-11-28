import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  seoMetadata: defineTable({
    path: v.string(),
    title: v.string(),
    description: v.string(),
    canonicalUrl: v.optional(v.string()), // Added canonicalUrl
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
});
