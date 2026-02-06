import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import LogoPage from "./LogoPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/logo-page");
}

export default function Logo() {
  return (
    <>
      <Header />
      <ConvexBanner path="/logo-page" />
      <main>
        <LogoPage />
      </main>
      <Footer />
    </>
  );
}
