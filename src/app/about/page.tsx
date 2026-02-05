import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import AboutPage from "@/app/about/AboutPage";
import { getPageSEO } from "@/lib/seo";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getPageHeader } from "@/lib/page-headers";

export async function generateMetadata() {
  return await getPageSEO("/about");
}

export default function About() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/about",
  });
  const header = headerConvex ?? getPageHeader("/about");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
