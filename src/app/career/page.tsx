import Header from "@/components/layout/Header";
import CareerPage from "@/app/career/CareerPage";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Career | Chris Lane Jones — Dev & Hiker",
  description:
    "See My Career - Explore my professional journey, skills, and experiences in software development and beyond.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <CareerPage />
      <Footer />
    </div>
  );
}
