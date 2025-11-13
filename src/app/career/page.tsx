import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import CareerPage from "@/app/career/CareerPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/career");
}

export default function About() {
  return (
    <>
      <Header />
      <Banner
        title="Career"
        breadcrumbPage="Career"
        description="Following the trail from video production to web development—navigating frameworks, communities, and mountain views along the way."
      />
      <main>
        <CareerPage />
      </main>
      <Footer />
    </>
  );
}
