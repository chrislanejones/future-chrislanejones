import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import LogoPage from "./LogoPage";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/logo-page");
}

export default function Logo() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/logo-page",
  });
  const header = headerConvex ?? getPageHeader("/logo-page");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <LogoPage />
      </main>
      <Footer />
    </>
  );
}
