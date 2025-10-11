import Header from "@/components/layout/Header";
import CareerPage from "@/app/career/CareerPage";
import Footer from "@/components/layout/Footer";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/career");
}

export default function About() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <CareerPage />
      <Footer />
    </div>
  );
}
