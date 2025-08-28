"use client";

import ClientSliderBox from "./main/client-slider-box";
import MusicPlayerBox from "./main/music-player-box";
import QuoteGeneratorCard from "./main/quote-generator-card";
import TechStackBox from "./main/tech-stack-box";
import ProjectsBox from "./main/projects-box";
import ImageGalleryBox from "./main/image-gallery-box";
import HeroCard from "./main/hero-box";
import LinkCard from "./main/link-box";
import Footer from "./Footer";

export default function BentoGrid() {
  return (
    <>
      <main className="max-w-6xl mx-auto px-5 pb-24">
        <section className="grid grid-cols-1 md:grid-cols-6 gap-5 auto-rows-[180px] md:auto-rows-[210px]">
          <HeroCard />
          <QuoteGeneratorCard />
          <MusicPlayerBox />
          <ProjectsBox />
          <TechStackBox />
          <ImageGalleryBox />
          <LinkCard />
          <ClientSliderBox />
        </section>
      </main>
      <Footer />
    </>
  );
}
