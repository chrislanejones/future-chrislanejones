import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// Clerk user ids allowed to upload. Any signed-up Clerk user is NOT enough —
// sign-ups are open, so gate on the owner allowlist (matches convex/authz.ts).
// Defaults to the owner; override with the ADMIN_USER_IDS env var.
const ADMIN_USER_IDS = (
  process.env.ADMIN_USER_IDS ?? "user_36c1KtgcpJ5waZjYB39KKwB5pU3"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Only the site owner may upload. Without this, the file router is a public
// endpoint any registered user can use to push files into the account.
async function requireAdmin() {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    throw new UploadThingError("Unauthorized");
  }
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
