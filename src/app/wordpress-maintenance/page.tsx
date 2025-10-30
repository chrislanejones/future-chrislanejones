import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WPMaintenanceContent from "./WP-MaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/WordPress-Maintenance");
}

export default function WordPressMaintenancePage() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <WPMaintenanceContent />
      <Footer />
    </div>
  );
}
