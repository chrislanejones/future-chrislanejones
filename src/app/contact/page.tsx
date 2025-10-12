import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "./ContactForm";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/contact");
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <ContactForm />
      <Footer />
    </div>
  );
}