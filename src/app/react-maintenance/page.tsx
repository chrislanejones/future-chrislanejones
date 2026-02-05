import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ReactMaintenanceContent from "./ReactMaintenanceContent";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/react-maintenance");
}

export default function ReactMaintenancePage() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/react-maintenance",
  });
  const header = headerConvex ?? getPageHeader("/react-maintenance");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <ReactMaintenanceContent />
      </main>
      <Footer />
    </>
  );
}
