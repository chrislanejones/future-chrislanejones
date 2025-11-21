// app/projects/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import ProjectGrid from "@/app/projects/ProjectGrid";
import { getPageSEO } from "@/lib/seo";
import { getPageHeader } from "@/data/header-data";

export async function generateMetadata() {
  return await getPageSEO("/projects");
}

export default function ProjectsPage() {
  const headerData = getPageHeader("/projects");

  return (
    <>
      <Header />
      <Banner
        title={headerData.title}
        breadcrumbPage={headerData.breadcrumbPage}
        description={headerData.description}
      />
      <main>
        <ProjectGrid />
      </main>
      <Footer />
    </>
  );
}
