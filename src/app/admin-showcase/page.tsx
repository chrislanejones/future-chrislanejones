import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import AdminShowcasePage from "./AdminShowcasePage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/admin-showcase");
}

export default function AdminShowcase() {
  return (
    <>
      <Header />
      <ConvexBanner path="/admin-showcase" />
      <main id="main-content">
        <AdminShowcasePage />
      </main>
      <Footer />
    </>
  );
}
