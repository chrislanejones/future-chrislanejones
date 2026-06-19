import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// Only the authenticated admin may upload. Without this, the file router is a
// public endpoint anyone can use to push files into the account.
async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new UploadThingError("Unauthorized");
  return userId;
}

export const ourFileRouter = {
  // General media uploader - saves to media table
  mediaUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      const userId = await requireAdmin();
      return { uploadedBy: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.uploadedBy,
        url: file.url,
        filename: file.name,
        size: file.size,
      };
    }),

  // Legacy blog image uploader (keeping for backwards compatibility)
  blogImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const userId = await requireAdmin();
      return { uploadedBy: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.uploadedBy, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
