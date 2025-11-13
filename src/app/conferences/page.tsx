import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ConferencesPage from "./ConferencesPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/conferences");
}

export default function ConferencesRoute() {
  return (
    <>
      <Header />
      <Banner
        title="Conferences"
        breadcrumbPage="Conferences"
        description="Highlights and notes from events I've attended—open source, web, and community conferences across the years."
      />
      <main>
        <ConferencesPage />
      </main>
      <Footer />
    </>
  );
}
