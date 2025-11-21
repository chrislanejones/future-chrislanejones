import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import BrowserTabs from "./BrowserTabs";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/data/header-data";

export async function generateMetadata() {
  return await getPageSEO("/browser-tabs");
}

export default function BrowserTabsPage() {
  const headerData = getPageHeader("/browser-tabs");

  return (
    <>
      <Header />
      <Banner
        title={headerData.title}
        breadcrumbPage={headerData.breadcrumbPage}
        description={headerData.description}
      />
      <main>
        <BrowserTabs />
      </main>
      <Footer />
    </>
  );
}
