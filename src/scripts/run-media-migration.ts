/**
 * Run the Convex media migration to create media entries
 * for the UploadThing blog images
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function runMigration() {
  console.log("🚀 Running media migration in Convex...\n");

  try {
    const results = await client.mutation(api.media.migrateBlogImages, {});

    console.log("✅ Migration complete!\n");
    console.log("Results:");
    console.log(JSON.stringify(results, null, 2));

    const successCount = results.filter((r: any) => r.success).length;
    const failCount = results.filter((r: any) => !r.success).length;

    console.log(`\n✨ Success: ${successCount}, Failed: ${failCount}`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
