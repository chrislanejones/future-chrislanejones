// src/app/site-history/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import SiteHistoryPage from "@/app/site-history/SiteHistoryPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/site-history");
}

export default function SiteHistory() {
  return (
    <>
      <Header />
      <ConvexBanner path="/site-history" />
      <main>
        <SiteHistoryPage />
      </main>
      <Footer />
    </>
  );
}
