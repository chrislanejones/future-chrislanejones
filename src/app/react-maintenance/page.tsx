import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ReactMaintenanceContent from "./ReactMaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/react-maintenance");
}

export default function ReactMaintenancePage() {
  return (
    <>
      <Header />
      <Banner
        title="WordPress Site Maintenance"
        breadcrumbPage="WordPress Services"
        description="A Monthly Action Plan That Makes Sense - Comprehensive website maintenance, including regular updates, security scans, performance optimization, and technical support."
      />
      <main>
        <ReactMaintenanceContent />
      </main>
      <Footer />
    </>
  );
}
