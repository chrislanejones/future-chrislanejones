import { v } from "convex/values";
import { internalMutation, mutation, query, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { isAdmin, requireAdmin } from "./authz";

// The resume is served from Convex storage so it stays out of the git repo.
// Upload from Admin -> Career Timeline (owner only) or the CLI script,
// scripts/upload-resume.sh; both end in replaceFile().

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

type Kind = "pdf" | "docx";

const CONTENT_TYPES: Record<Kind, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
const MAX_BYTES = 10 * 1024 * 1024;

// Point a format at a freshly uploaded file and delete the blob it replaces.
async function replaceFile(
  ctx: MutationCtx,
  args: { kind: Kind; storageId: Id<"_storage">; filename: string },
) {
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
}

export const setFile = internalMutation({
  args: { kind, storageId: v.id("_storage"), filename: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await replaceFile(ctx, args);
    return null;
  },
});

// Owner-only upload URL for the admin resume panel.
export const generateAdminUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

// Publish an uploaded file as the live resume for one format. The stored
// blob's size and (when recorded) content type are checked server-side.
// A rejected upload is deleted and the reason returned, not thrown: a thrown
// error would roll back the delete along with everything else.
export const publish = mutation({
  args: { kind, storageId: v.id("_storage") },
  returns: v.union(v.null(), v.object({ error: v.string() })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const file = await ctx.db.system.get("_storage", args.storageId);
    if (!file) return { error: "Upload not found." };
    const wrongType = file.contentType !== undefined && file.contentType !== CONTENT_TYPES[args.kind];
    if (wrongType || file.size > MAX_BYTES) {
      await ctx.storage.delete(args.storageId);
      return {
        error: wrongType
          ? `That isn't a ${args.kind === "pdf" ? "PDF" : "Word (.docx)"} file.`
          : "That file is over 10 MB.",
      };
    }
    await replaceFile(ctx, {
      kind: args.kind,
      storageId: args.storageId,
      filename: `Chris_Lane_Jones_Resume.${args.kind}`,
    });
    return null;
  },
});

// What's live for each format, for the admin panel.
export const getAdminStatus = query({
  args: {},
  returns: v.array(
    v.object({
      kind,
      filename: v.string(),
      size: v.union(v.number(), v.null()),
      updatedAt: v.number(),
      url: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return [];
    const files = await ctx.db.query("resumeFiles").take(10);
    return await Promise.all(
      files.map(async (f) => ({
        kind: f.kind,
        filename: f.filename,
        size: (await ctx.db.system.get("_storage", f.storageId))?.size ?? null,
        updatedAt: f.updatedAt,
        url: await ctx.storage.getUrl(f.storageId),
      })),
    );
  },
});
