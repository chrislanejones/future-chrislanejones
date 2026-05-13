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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chris Lane Jones",
  url: "https://www.chrislanejones.com",
  image: "https://www.chrislanejones.com/Professional-Photo-of-Chris-Lane-Jones.webp",
  sameAs: [
    "https://github.com/chrislanejones",
    "https://www.linkedin.com/in/chrislanejones",
    "https://twitter.com/chrislanejones",
  ],
  jobTitle: "Full-Stack Web Developer",
  worksFor: {
    "@type": "Organization",
    name: "Chris Lane Jones Web Development",
  },
  description:
    "Full-stack developer specializing in Next.js, React, and WordPress. Building modern web applications for businesses and government agencies from Virginia.",
  knowsAbout: ["React", "Next.js", "WordPress", "TypeScript", "Web Development"],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Virginia",
    addressCountry: "US",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Header />

      <main id="main-content">
        <section className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-min">
          <Card size="hero" height="large" delay={0.1}>
            <HeroContent />
          </Card>

          <Card size="large" height="large" delay={0.2}>
            <QuoteContent />
          </Card>

          <Card size="full" height="large" layout="split" delay={0.3}>
            <ProjectsContent />
          </Card>

          <Card size="large" height="large" layout="media-top" delay={0.4}>
            <MusicPlayerContent />
          </Card>

          <Card size="large" height="large" delay={0.5}>
            <BlogContent />
          </Card>

          <Card size="large" height="large" layout="media-top" delay={0.6}>
            <ImageGalleryContent />
          </Card>

          <Card size="full" height="large" delay={0.7}>
            <ClientSliderContent />
          </Card>

          <Card size="full" height="large" delay={0.8}>
            <TechStackContent />
          </Card>
        </section>
      </main>

      <Footer />
    </>
  );
}
