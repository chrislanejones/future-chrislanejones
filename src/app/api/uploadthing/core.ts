import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // General media uploader - saves to media table
  mediaUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      // You could add auth here if needed
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", metadata.uploadedBy);
      console.log("File URL:", file.url);
      console.log("File name:", file.name);
      console.log("File size:", file.size);

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
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", metadata.uploadedBy);
      console.log("File URL:", file.url);

      return { uploadedBy: metadata.uploadedBy, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
