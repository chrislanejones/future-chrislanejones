import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import AboutPage from "@/app/about/AboutPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/data/header-data";

export async function generateMetadata() {
  return await getPageSEO("/about");
}

export default function About() {
  const headerData = getPageHeader("/about");

  return (
    <>
      <Header />
      <Banner
        title={headerData.title}
        breadcrumbPage={headerData.breadcrumbPage}
        description={headerData.description}
      />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
