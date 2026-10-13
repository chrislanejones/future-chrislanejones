// app/projects/page.tsx
import { CoastalPageShell } from "@/components/coastal/page-shell";
import ProjectGrid from "@/app/projects/ProjectPage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/projects");
}

export default function ProjectsPage() {
  return (
    <CoastalPageShell>
      <ProjectGrid />
    </CoastalPageShell>
  );
}
