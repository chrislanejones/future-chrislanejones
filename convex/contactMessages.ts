import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

async function requireAuth(ctx: { auth: any }): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
}

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db
      .query("contactMessages")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const unread = await ctx.db
      .query("contactMessages")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return unread.length;
  },
});

export const markAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.patch(args.id, { read: true });
  },
});

export const markAsUnread = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.patch(args.id, { read: false });
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.delete(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
  },
});
