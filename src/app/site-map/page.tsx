import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteMapPage from "./SiteMapPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/site-map");
}

export default function SiteMap() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <SiteMapPage />
      <Footer />
    </div>
  );
}
