const { ConvexHttpClient } = require("convex/browser");

async function seedSEOData() {
  // Get Convex URL from environment variables
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    console.error("❌ NEXT_PUBLIC_CONVEX_URL environment variable is required");
    process.exit(1);
  }

  const convex = new ConvexHttpClient(convexUrl);

  try {
    console.log("🌱 Seeding SEO data...");

    // Import the mutation - this works because Convex generates the API
    const result = await convex.mutation("seo:seedSEOData");

    console.log("✅ SEO data seeded successfully!");
    console.log(`📊 Result: ${result.message}`);
    console.log(`   - Total pages: ${result.total}`);
    console.log(`   - New pages inserted: ${result.inserted}`);
    console.log(`   - Existing pages: ${result.updated}`);

  } catch (error) {
    console.error("❌ Error seeding SEO data:", error);
    process.exit(1);
  }
}

// Run the script
seedSEOData();