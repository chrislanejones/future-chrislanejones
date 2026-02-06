import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import AboutPage from "@/app/about/AboutPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/about");
}

export default function About() {
  return (
    <>
      <Header />
      <ConvexBanner path="/about" />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
