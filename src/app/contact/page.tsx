import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import ContactForm from "./ContactForm";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/contact");
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <ConvexBanner path="/contact" />
      <main>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
