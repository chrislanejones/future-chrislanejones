// src/app/site-history/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import SiteHistoryPage from "@/app/site-history/SiteHistoryPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/site-history");
}

export default function SiteHistory() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/site-history",
  });
  const header = headerConvex ?? getPageHeader("/site-history");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <SiteHistoryPage />
      </main>
      <Footer />
    </>
  );
}
