import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import LogoPage from "./LogoPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/data/header-data";

export async function generateMetadata() {
  return await getPageSEO("/logo-page");
}

export default function Logo() {
  const headerData = getPageHeader("/logo-page");

  return (
    <>
      <Header />
      <Banner
        title={headerData.title}
        breadcrumbPage={headerData.breadcrumbPage}
        description={headerData.description}
      />
      <main>
        <LogoPage />
      </main>
      <Footer />
    </>
  );
}
