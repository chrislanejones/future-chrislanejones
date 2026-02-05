import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import CareerPage from "@/app/career/CareerPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/career");
}

export default function Career() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/career",
  });
  const header = headerConvex ?? getPageHeader("/career");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <CareerPage />
      </main>
      <Footer />
    </>
  );
}
