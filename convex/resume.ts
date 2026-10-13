import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// The resume is served from Convex storage so it stays out of the git repo.
// Uploads are CLI-only (internal functions) — run scripts/upload-resume.sh.

const kind = v.union(v.literal("pdf"), v.literal("docx"));

// Public: the career page's download route reads this. The resume is meant to
// be downloadable by anyone, so the signed URL is not a secret.
export const getDownload = query({
  args: { kind },
  returns: v.union(
    v.null(),
    v.object({ url: v.string(), filename: v.string() })
  ),
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query("resumeFiles")
      .withIndex("by_kind", (q) => q.eq("kind", args.kind))
      .unique();
    if (!file) return null;
    const url = await ctx.storage.getUrl(file.storageId);
    if (!url) return null;
    return { url, filename: file.filename };
  },
});

export const generateUploadUrl = internalMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Point a format at a freshly uploaded file and delete the blob it replaces.
export const setFile = internalMutation({
  args: { kind, storageId: v.id("_storage"), filename: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("resumeFiles")
      .withIndex("by_kind", (q) => q.eq("kind", args.kind))
      .unique();
    if (existing) {
      if (existing.storageId !== args.storageId) {
        await ctx.storage.delete(existing.storageId);
      }
      await ctx.db.patch(existing._id, {
        storageId: args.storageId,
        filename: args.filename,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("resumeFiles", { ...args, updatedAt: Date.now() });
    }
    return null;
  },
});
