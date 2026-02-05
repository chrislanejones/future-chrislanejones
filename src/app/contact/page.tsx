import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ContactForm from "./ContactForm";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata() {
  return await getPageSEO("/contact");
}

export default function ContactPage() {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/contact",
  });
  const header = headerConvex ?? getPageHeader("/contact");

  return (
    <>
      <Header />
      <Banner
        title={header.title}
        breadcrumbPage={header.breadcrumbPage}
        description={header.description}
      />
      <main>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
