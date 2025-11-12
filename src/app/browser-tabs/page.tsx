// app/projects/page.tsx
import Header from "@/components/layout/Header";
import BrowserTabs from "./BrowserTabs";
import Footer from "@/components/layout/Footer";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/browser-tabs");
}

export default function BrowserTabsPage() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <BrowserTabs />
      <Footer />
    </div>
  );
}
