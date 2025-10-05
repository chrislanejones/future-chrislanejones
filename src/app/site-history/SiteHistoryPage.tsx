// src/app/site-history/SiteHistoryPage.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

type SiteVersion = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageDescription: string;
};

const siteVersions: SiteVersion[] = [
  {
    title: "Version 1.0 - WordPress Beginnings (2013-2015)",
    description:
      "My first professional website built on WordPress using a premium theme. This was when I was transitioning from video production to web development, learning the basics of HTML, CSS, and PHP customization.\n\nFeatured a blog-centric design with portfolio sections for video work. Used popular WordPress plugins for contact forms, SEO, and social sharing. This site taught me the fundamentals of content management and web hosting.",
    image: "/gallery/Standing-Desk-Setup.webp",
    imageAlt: "Early WordPress site design",
    imageDescription: "WordPress era - learning the basics",
  },
  {
    title: "Version 2.0 - Custom WordPress Theme (2015-2017)",
    description:
      "Moved away from premium themes to build my first custom WordPress theme from scratch. This was a major learning experience in theme development, PHP templating, and the WordPress loop.\n\nImplemented Advanced Custom Fields for flexible content management and began focusing more on web development projects in my portfolio. Started experimenting with CSS frameworks and responsive design patterns.",
    image: "/gallery/Pandemic-Office-Setup-2021.webp",
    imageAlt: "Custom WordPress theme design",
    imageDescription: "Custom theme development phase",
  },
  {
    title: "Version 3.0 - React Exploration (2018-2020)",
    description:
      "Began experimenting with React and modern JavaScript frameworks. Built a static site using Create React App, learning component-based architecture and state management.\n\nThis version introduced interactive UI elements and smoother animations. Integrated with WordPress as a headless CMS via the REST API, combining the editing experience of WordPress with the performance of a static React frontend.",
    image: "/gallery/Me-Recording-A-Video.webp",
    imageAlt: "React-based site design",
    imageDescription: "First steps into React development",
  },
  {
    title: "Version 4.0 - Gatsby Static Site (2020-2022)",
    description:
      "Rebuilt the site using Gatsby for improved performance and SEO. Leveraged GraphQL for data queries and implemented automatic image optimization.\n\nFocused heavily on Core Web Vitals and accessibility. Added a blog with MDX support for rich content authoring. This version taught me modern build tools, static site generation, and performance optimization techniques.",
    image: "/gallery/Richmond-WordPress-Meetup.webp",
    imageAlt: "Gatsby-powered website",
    imageDescription: "Static site generation with Gatsby",
  },
  {
    title: "Version 5.0 - Next.js & Modern Stack (2022-2024)",
    description:
      "Complete rebuild using Next.js 13+ with the App Router. Implemented server components, streaming, and modern React patterns. Added Tailwind CSS for rapid styling and Framer Motion for smooth animations.\n\nIntroduced the bento grid layout, dark mode, and TypeScript throughout. Focused on creating a unique, portfolio-first experience that showcases both projects and personality. This version represents my current understanding of modern web development.",
    image: "/gallery/Me-on-a-Bike-Trail.webp",
    imageAlt: "Current Next.js site",
    imageDescription: "Modern Next.js architecture",
  },
  {
    title: "The Future - Continuous Evolution",
    description:
      "Looking ahead, I plan to experiment with edge functions, real-time features, and advanced animations. Exploring Astro for content-heavy sections and continuing to push the boundaries of what's possible with modern web technologies.\n\nThe site will always be a playground for learning new tools and techniques, documenting my growth as a developer while serving as a functional portfolio and personal brand.",
    image: "/gallery/Becky-and-I-at-Glacier-National-Park.webp",
    imageAlt: "Future development plans",
    imageDescription: "Always evolving, always learning",
  },
];

function SiteVersionCard({
  version,
  index,
  total,
}: {
  version: SiteVersion;
  index: number;
  total: number;
}) {
  const isImageLeft = index % 2 === 0;

  return (
    <Card
      size="page-full"
      className="grid md:grid-cols-2 gap-8"
      delay={0.1 + index * 0.1}
    >
      <div
        className={cn(
          "flex flex-col justify-center",
          "order-1",
          isImageLeft ? "md:order-2" : "md:order-1"
        )}
      >
        <h2 className="font-bold text-2xl mb-6">{version.title}</h2>
        <p className="text-muted leading-relaxed text-base whitespace-pre-line">
          {version.description}
        </p>
      </div>

      <div
        className={cn(
          "relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[300px]",
          "order-2",
          isImageLeft ? "md:order-1" : "md:order-2"
        )}
      >
        <Image
          src={version.image}
          alt={version.imageAlt}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
        <div className="absolute bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-base/80 backdrop-blur-sm">
          {version.imageDescription}
        </div>
      </div>
    </Card>
  );
}

function SiteHistoryGrid({ versions }: { versions: SiteVersion[] }) {
  return (
    <motion.section
      className="grid grid-cols-1 gap-8 auto-rows-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {versions.map((version, index) => (
        <SiteVersionCard
          key={version.title}
          version={version}
          index={index}
          total={versions.length}
        />
      ))}
    </motion.section>
  );
}

export default function SiteHistoryPage() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="Site History"
        breadcrumbPage="Site History"
        description="The evolution of chrislanejones.com through various technologies, frameworks, and design iterations over the years."
      />

      <FullWidthLayout>
        <SiteHistoryGrid versions={siteVersions} />
      </FullWidthLayout>
    </main>
  );
}
