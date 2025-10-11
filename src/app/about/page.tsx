import Header from "@/components/layout/Header";
import AboutPage from "@/app/about/AboutPage";
import Footer from "@/components/layout/Footer";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/about");
}

export default function About() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <AboutPage />
      <Footer />
    </div>
  );
}
