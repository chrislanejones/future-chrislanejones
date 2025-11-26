// src/app/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/page/card";

// Import content components (no longer "boxes")
import HeroContent from "@/components/main/hero-content";
import QuoteContent from "@/components/main/quote-content";
import ProjectsContent from "@/components/main/projects-content";
import MusicPlayerContent from "@/components/main/music-player-content";
import BlogContent from "@/components/main/blog-content";
import ImageGalleryContent from "@/components/main/image-gallery-content";
import ClientSliderContent from "@/components/main/client-slider-content";
import TechStackContent from "@/components/main/tech-stack-content";

import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/");
}

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-min">
          <Card
            size="hero"
            height="large"
            shadow="soft"
            border="thin"
            delay={0.1}
          >
            <HeroContent />
          </Card>

          <Card
            size="large"
            height="large"
            shadow="soft"
            border="thin"
            delay={0.2}
          >
            <QuoteContent />
          </Card>

          <Card
            size="full"
            height="large"
            layout="split"
            shadow="soft"
            border="thin"
            delay={0.3}
          >
            <ProjectsContent />
          </Card>

          <Card
            size="large"
            height="large"
            layout="media-top"
            shadow="soft"
            border="thin"
            delay={0.4}
          >
            <MusicPlayerContent />
          </Card>

          <Card
            size="large"
            height="large"
            shadow="soft"
            border="thin"
            delay={0.5}
          >
            <BlogContent />
          </Card>

          <Card
            size="large"
            height="large"
            layout="media-top"
            shadow="soft"
            border="thin"
            delay={0.6}
          >
            <ImageGalleryContent />
          </Card>

          <Card
            size="full"
            height="medium"
            shadow="soft"
            border="thin"
            delay={0.7}
          >
            <ClientSliderContent />
          </Card>

          <Card
            size="full"
            height="medium"
            shadow="soft"
            border="thin"
            delay={0.8}
          >
            <TechStackContent />
          </Card>
        </section>
      </main>

      <Footer />
    </>
  );
}
