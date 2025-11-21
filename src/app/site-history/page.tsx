// src/app/site-history/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import SiteHistoryPage from "@/app/site-history/SiteHistoryPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/data/header-data";

export async function generateMetadata() {
  return await getPageSEO("/site-history");
}

export default function SiteHistory() {
  const headerData = getPageHeader("/site-history");

  return (
    <>
      <Header />
      <Banner
        title={headerData.title}
        breadcrumbPage={headerData.breadcrumbPage}
        description={headerData.description}
      />
      <main>
        <SiteHistoryPage />
      </main>
      <Footer />
    </>
  );
}
