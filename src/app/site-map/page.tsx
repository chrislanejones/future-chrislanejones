import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import SiteMapPage from "./SiteMapPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/site-map");
}

export default function SiteMap() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/site-map",
  });
  const header = headerConvex ?? getPageHeader("/site-map");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <SiteMapPage />
      </main>
      <Footer />
    </>
  );
}
