import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReactMaintenanceContent from "./ReactMaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/react-maintenance");
}

export default function ReactMaintenancePage() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <ReactMaintenanceContent />
      <Footer />
    </div>
  );
}
