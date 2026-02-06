import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import BrowserTabs from "./BrowserTabs";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/browser-tabs");
}

export default function BrowserTabsPage() {
  return (
    <>
      <Header />
      <ConvexBanner path="/browser-tabs" />
      <main>
        <BrowserTabs />
      </main>
      <Footer />
    </>
  );
}
