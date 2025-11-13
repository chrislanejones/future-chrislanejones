// app/projects/page.tsx
import Header from "@/components/layout/Header";
import ProjectGrid from "@/app/projects/ProjectGrid";
import Footer from "@/components/layout/Footer";

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
