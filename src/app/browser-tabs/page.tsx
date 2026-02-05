import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import BrowserTabs from "./BrowserTabs";
import { getPageSEO } from "@/lib/seo";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getPageHeader } from "@/lib/page-headers";

export async function generateMetadata() {
  return await getPageSEO("/browser-tabs");
}

export default function BrowserTabsPage() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/browser-tabs",
  });
  const header = headerConvex ?? getPageHeader("/browser-tabs");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <BrowserTabs />
      </main>
      <Footer />
    </>
  );
}
