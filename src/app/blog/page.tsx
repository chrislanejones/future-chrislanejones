// src/app/blog/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import BlogPage from "./BlogPage";
import { getPageSEO } from "@/lib/seo";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getPageHeader } from "@/lib/page-headers";

export async function generateMetadata() {
  return await getPageSEO("/blog");
}

export default function Page() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/blog",
  });
  const header = headerConvex ?? getPageHeader("/blog");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <BlogPage />
      </main>
      <Footer />
    </>
  );
}
