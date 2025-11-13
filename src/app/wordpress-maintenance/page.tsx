import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import WPMaintenanceContent from "./WP-MaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/WordPress-Maintenance");
}

export default function WordPressMaintenancePage() {
  return (
    <>
      <Header />
      <Banner
        title="WordPress Site Maintenance"
        breadcrumbPage="WordPress Services"
        description="A Monthly Action Plan That Makes Sense - Comprehensive website maintenance, including regular updates, security scans, performance optimization, and technical support."
      />
      <main>
        <WPMaintenanceContent />
      </main>
      <Footer />
    </>
  );
}
