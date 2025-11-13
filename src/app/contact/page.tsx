import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ContactForm from "./ContactForm";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/contact");
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <Banner
        title="Contact"
        breadcrumbPage="Contact"
        description="Get in touch with me for collaborations, inquiries, or just to say hello. I'll get back to you as soon as possible."
      />
      <main>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
