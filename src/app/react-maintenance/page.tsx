import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import ReactMaintenanceContent from "./ReactMaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/react-maintenance");
}

export default function ReactMaintenancePage() {
  return (
    <>
      <Header />
      <ConvexBanner path="/react-maintenance" />
      <main>
        <ReactMaintenanceContent />
      </main>
      <Footer />
    </>
  );
}
