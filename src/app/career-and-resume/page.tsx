import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import CareerPage from "@/app/career-and-resume/CareerPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/career-and-resume");
}

export default function Career() {
  return (
    <>
      <Header />
      <ConvexBanner path="/career-and-resume" />
      <main id="main-content">
        <CareerPage />
      </main>
      <Footer />
    </>
  );
}
