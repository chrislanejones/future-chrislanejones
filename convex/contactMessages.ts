import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mutation to create a new contact message
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("contactMessages", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      message: args.message,
      createdAt: Date.now(),
      read: false,
    });
    return messageId;
  },
});

// Query to get all contact messages
export const getAll = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("contactMessages")
      .order("desc")
      .collect();
    return messages;
  },
});

// Query to get unread messages count
export const getUnreadCount = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("contactMessages")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return messages.length;
  },
});

// Mutation to mark message as read
export const markAsRead = mutation({
  args: {
    id: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

// Mutation to delete a message
export const deleteMessage = mutation({
  args: {
    id: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation to mark all messages as read
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