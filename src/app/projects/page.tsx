// app/projects/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectGrid from "@/app/projects/ProjectPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/projects");
}

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <ProjectGrid />
      <Footer />
    </>
  );
}
