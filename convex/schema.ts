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
});
