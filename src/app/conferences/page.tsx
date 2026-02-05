import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ConferencesPage from "./ConferencesPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/conferences");
}

export default function ConferencesRoute() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/conferences",
  });
  const header = headerConvex ?? getPageHeader("/conferences");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <ConferencesPage />
      </main>
      <Footer />
    </>
  );
}
