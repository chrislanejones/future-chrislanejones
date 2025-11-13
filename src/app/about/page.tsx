import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import AboutPage from "@/app/about/AboutPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/about");
}

export default function About() {
  return (
    <>
      <Header />
      <Banner
        title="About Me"
        breadcrumbPage="About"
        description="Life on the trails and the web, building modern React applications and leading the local WordPress community."
      />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
