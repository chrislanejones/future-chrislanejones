import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import SiteMapPage from "./SiteMapPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/site-map");
}

export default function SiteMap() {
  return (
    <>
      <Header />
      <ConvexBanner path="/site-map" />
      <main>
        <SiteMapPage />
      </main>
      <Footer />
    </>
  );
}
