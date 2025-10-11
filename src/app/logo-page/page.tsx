import Header from "@/components/layout/Header";
import LogoPage from "./LogoPage";
import Footer from "@/components/layout/Footer";

import { getPageSEO } from "@/lib/seo";
export async function generateMetadata() {
  return await getPageSEO("/logo-page");
}

export default function Logo() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <LogoPage />
      <Footer />
    </div>
  );
}
