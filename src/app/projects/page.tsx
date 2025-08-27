// app/projects/page.tsx
import Header from "@/components/Header";
import ProjectGrid from "@/components/ProjectGrid";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Projects | Chris Lane Jones — Dev & Hiker",
  description:
    "Explore my full-stack development projects featuring Next.js, TypeScript, and modern web technologies.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <ProjectGrid />
      <Footer />
    </div>
  );
}
