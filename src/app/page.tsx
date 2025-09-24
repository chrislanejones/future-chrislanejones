// src/app/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import all the card components directly
import ClientSliderBox from "@/components/main/client-slider-box";
import MusicPlayerBox from "@/components/main/music-player-box";
import QuoteGeneratorCard from "@/components/main/quote-generator-card";
import TechStackBox from "@/components/main/tech-stack-box";
import ProjectsBox from "@/components/main/projects-box";
import ImageGalleryBox from "@/components/main/image-gallery-box";
import HeroBox from "@/components/main/hero-box";
import LinkCard from "@/components/main/link-box";

export default function Home() {
  return (
    <div className="min-h-screen bg-base">
      <Header />

      {/* Bento Grid - directly in page.tsx */}
      <main className="max-w-6xl mx-auto px-5 pb-24">
        <section className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-min">
          <HeroBox size="hero" delay={0.1} />
          <QuoteGeneratorCard size="large" delay={0.2} />
          <MusicPlayerBox size="large" delay={0.3} />
          <ProjectsBox size="hero" delay={0.4} />
          <TechStackBox size="large" delay={0.5} />
          <ImageGalleryBox size="large" delay={0.6} />
          <LinkCard size="large" delay={0.7} />
          <ClientSliderBox size="full" delay={0.8} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
