import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import WPMaintenanceContent from "./WP-MaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/WordPress-Maintenance");
}

export default function WordPressMaintenancePage() {
  return (
    <>
      <Header />
      <ConvexBanner path="/wordpress-maintenance" />
      <main>
        <WPMaintenanceContent />
      </main>
      <Footer />
    </>
  );
}
