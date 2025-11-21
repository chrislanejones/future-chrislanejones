import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ContactForm from "./ContactForm";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/data/header-data";

export async function generateMetadata() {
  return await getPageSEO("/contact");
}

export default function ContactPage() {
  const headerData = getPageHeader("/contact");

  return (
    <>
      <Header />
      <Banner
        title={headerData.title}
        breadcrumbPage={headerData.breadcrumbPage}
        description={headerData.description}
      />
      <main>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
