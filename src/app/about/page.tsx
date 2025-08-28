import Header from "@/components/Header";
import AboutPage from "@/app/about/AboutPage";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About | Chris Lane Jones — Dev & Hiker",
  description:
    "Learn about my journey from video production to web development, community leadership in Richmond's WordPress meetup, and life in the Shenandoah Mountains.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <AboutPage />
      <Footer />
    </div>
  );
}
