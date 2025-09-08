// app/projects/page.tsx
import Header from "@/components/Header";
import BrowserGrid from "./BrowserGrid";
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
      <BrowserGrid />
      <Footer />
    </div>
  );
}
