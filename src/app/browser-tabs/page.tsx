// app/projects/page.tsx
import Header from "@/components/layout/Header";
import BrowserGrid from "./BrowserGrid";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Projects | Chris Lane Jones — Dev & Hiker",
  description:
    "See My Open Browser tabs - A curated collection of useful resources, tools, and inspiration that I keep coming back to.",
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
