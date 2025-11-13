import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import SiteMapPage from "./SiteMapPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/site-map");
}

export default function SiteMap() {
  return (
    <>
      <Header />
      <Banner
        title="Site Map & Changelog"
        breadcrumbPage="Changelog"
        description="Explore all available pages on chrislanejones.com and Track site updates"
      />
      <main>
        <SiteMapPage />
      </main>
      <Footer />
    </>
  );
}
