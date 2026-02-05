import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import WPMaintenanceContent from "./WP-MaintenanceContent";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/WordPress-Maintenance");
}

export default function WordPressMaintenancePage() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/wordpress-maintenance",
  });
  const header = headerConvex ?? getPageHeader("/wordpress-maintenance");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <WPMaintenanceContent />
      </main>
      <Footer />
    </>
  );
}
