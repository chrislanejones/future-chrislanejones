// src/app/site-history/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import SiteHistoryPage from "@/app/site-history/SiteHistoryPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/site-history");
}

export default function SiteHistory() {
  return (
    <>
      <Header />
      <Banner
        title="Site History"
        breadcrumbPage="Site History"
        description="The evolution of chrislanejones.com through various technologies, frameworks, and design iterations—from WordPress 2.1 to modern Next.js."
      />
      <main>
        <SiteHistoryPage />
      </main>
      <Footer />
    </>
  );
}
