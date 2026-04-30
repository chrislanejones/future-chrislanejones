import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import WPMaintenanceContent from "./WP-MaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/wordpress-maintenance");
}

export default function WordPressMaintenancePage() {
  return (
    <>
      <Header />
      <ConvexBanner path="/wordpress-maintenance" />
      <main id="main-content">
        <WPMaintenanceContent />
      </main>
      <Footer />
    </>
  );
}
