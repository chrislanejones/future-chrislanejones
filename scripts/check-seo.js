const { ConvexHttpClient } = require("convex/browser");

async function checkSEOData() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://limitless-parakeet-517.convex.cloud";
  const convex = new ConvexHttpClient(convexUrl);

  try {
    console.log("🔍 Checking SEO data in Convex...\n");

    // Get all SEO entries
    const allSEO = await convex.query("seo:getAllSEO");

    console.log(`📊 Total SEO entries: ${allSEO.length}\n`);

    // Look for react-maintenance specifically
    const reactMaintenance = allSEO.find(entry => entry.path === "/react-maintenance");

    if (reactMaintenance) {
      console.log("✅ React Maintenance page found!");
      console.log(`   Path: ${reactMaintenance.path}`);
      console.log(`   Title: ${reactMaintenance.title}`);
      console.log(`   Description: ${reactMaintenance.description}`);
      console.log(`   Updated: ${new Date(reactMaintenance.updatedAt).toLocaleString()}\n`);
    } else {
      console.log("❌ React Maintenance page NOT found\n");
    }

    // Show all pages for reference
    console.log("📋 All pages in database:");
    allSEO.sort((a, b) => a.path.localeCompare(b.path)).forEach(entry => {
      console.log(`   ${entry.path} - ${entry.title}`);
    });

  } catch (error) {
    console.error("❌ Error checking SEO data:", error);
  }
}

checkSEOData();