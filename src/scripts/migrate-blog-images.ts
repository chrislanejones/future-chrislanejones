/**
 * Migration script to upload existing blog post images to UploadThing
 * and create media entries in Convex
 */

import { UTApi } from "uploadthing/server";
import * as fs from "fs";
import * as path from "path";

// UTApi needs UPLOADTHING_TOKEN - use API_KEY as fallback
const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_API_KEY,
});

interface BlogImage {
  localPath: string;
  blogPostSlug: string;
  blogPostTitle: string;
}

const imagesToMigrate: BlogImage[] = [
  {
    localPath: "public/projects/multi-image-compress-and-edit-app.webp",
    blogPostSlug: "building-modern-react-applications-with-nextjs-14",
    blogPostTitle: "Building Modern React Applications with Next.js 14",
  },
  {
    localPath: "public/gallery/Richmond-WordPress-Meetup.webp",
    blogPostSlug: "wordpress-vs-modern-frameworks-when-to-choose-what",
    blogPostTitle: "WordPress vs Modern Frameworks: When to Choose What",
  },
  {
    localPath: "public/gallery/Standing-Desk-Setup.webp",
    blogPostSlug: "remote-work-setup-perfect-development-environment",
    blogPostTitle: "Remote Work Setup: Building the Perfect Development Environment",
  },
];

async function migrateImages() {
  console.log("🚀 Starting blog image migration to UploadThing...\n");

  for (const image of imagesToMigrate) {
    try {
      console.log(`📤 Uploading: ${path.basename(image.localPath)}`);

      // Read the file
      const filePath = path.join(process.cwd(), image.localPath);
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(image.localPath);

      // Create a File object
      const file = new File([fileBuffer], fileName, {
        type: "image/webp",
      });

      // Upload to UploadThing
      const response = await utapi.uploadFiles([file]);

      if (response[0].data) {
        const uploadedUrl = response[0].data.url;
        const fileSize = fileBuffer.length;

        console.log(`✅ Uploaded successfully!`);
        console.log(`   URL: ${uploadedUrl}`);
        console.log(`   Size: ${(fileSize / 1024).toFixed(1)} KB`);
        console.log(`   Blog Post: ${image.blogPostTitle}\n`);

        // Output the Convex mutation data for manual entry
        console.log(`📝 Convex Media Entry:`);
        console.log(JSON.stringify({
          url: uploadedUrl,
          filename: fileName,
          size: fileSize,
          assignedToType: "blogPost",
          assignedToSlug: image.blogPostSlug,
          assignedToTitle: image.blogPostTitle,
        }, null, 2));
        console.log("\n---\n");
      } else {
        console.error(`❌ Failed to upload ${fileName}`);
        console.error(response[0].error);
      }
    } catch (error) {
      console.error(`❌ Error uploading ${image.localPath}:`, error);
    }
  }

  console.log("✨ Migration complete!");
}

migrateImages().catch(console.error);
