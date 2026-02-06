import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import ConferencesPage from "./ConferencesPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/conferences");
}

export default function ConferencesRoute() {
  return (
    <>
      <Header />
      <ConvexBanner path="/conferences" />
      <main>
        <ConferencesPage />
      </main>
      <Footer />
    </>
  );
}
