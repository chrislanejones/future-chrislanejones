import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

// Helper type for uploaded files
export type UploadedFile = {
  url: string;
  name: string;
  size: number;
};
