// convex/contactMessages.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    source: v.string(), // Added source field
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("contactMessages", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      message: args.message,
      source: args.source, // Store the source
      createdAt: Date.now(),
      read: false,
    });
    return messageId;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("contactMessages")
      .order("desc")
      .collect();
    return messages;
  },
});

export const getUnreadCount = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("contactMessages")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return messages.length;
  },
});

export const markAsRead = mutation({
  args: {
    id: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

export const deleteMessage = mutation({
  args: {
    id: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const markAllAsRead = mutation({
  handler: async (ctx) => {
    const unreadMessages = await ctx.db
      .query("contactMessages")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    for (const message of unreadMessages) {
      await ctx.db.patch(message._id, { read: true });
    }
    return unreadMessages.length;
  },
});
