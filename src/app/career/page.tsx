import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import CareerPage from "@/app/career/CareerPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/career");
}

export default function Career() {
  return (
    <>
      <Header />
      <ConvexBanner path="/career" />
      <main>
        <CareerPage />
      </main>
      <Footer />
    </>
  );
}
