// src/app/site-history/page.tsx
import Header from "@/components/layout/Header";
import SiteHistoryPage from "@/app/site-history/SiteHistoryPage";
import Footer from "@/components/layout/Footer";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/site-history");
}

export default function SiteHistory() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <SiteHistoryPage />
      <Footer />
    </div>
  );
}
