import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConferencesPage from "./ConferencesPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/conferences");
}

export default function ConferencesRoute() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <ConferencesPage />
      <Footer />
    </div>
  );
}
