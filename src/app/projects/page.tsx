// app/projects/page.tsx
import Header from "@/components/layout/Header";
import ProjectGrid from "@/app/projects/ProjectGrid";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Chrome Tabs Left Open | Chris Lane Jones — Dev & Hiker",
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
