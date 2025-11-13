import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import LogoPage from "./LogoPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/logo-page");
}

export default function Logo() {
  return (
    <>
      <Header />
      <Banner
        title="About the Logo"
        breadcrumbPage="Logo"
        description=" The mountain in my logo represents more than just a visual
            element—it's a symbol of the journey. Each peak conquered in code,
            each valley navigated through debugging, mirrors the trails I hike
            in the Shenandoah Mountains."
      />
      <main>
        <LogoPage />
      </main>
      <Footer />
    </>
  );
}
