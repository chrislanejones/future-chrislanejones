import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ConferencesPage from "./ConferencesPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/data/header-data";

export async function generateMetadata() {
  return await getPageSEO("/conferences");
}

export default function ConferencesRoute() {
  const headerData = getPageHeader("/conferences");

  return (
    <>
      <Header />
      <Banner
        title={headerData.title}
        breadcrumbPage={headerData.breadcrumbPage}
        description={headerData.description}
      />
      <main>
        <ConferencesPage />
      </main>
      <Footer />
    </>
  );
}
