import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import BrowserTabs from "./BrowserTabs";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/browser-tabs");
}

export default function BrowserTabsPage() {
  return (
    <>
      <Header />
      <Banner
        title="Chrome Tabs I Left Open"
        breadcrumbPage="Links"
        description="A curated collection of useful resources, tools, and inspiration that I keep coming back to."
      />
      <main>
        <BrowserTabs />
      </main>
      <Footer />
    </>
  );
}
