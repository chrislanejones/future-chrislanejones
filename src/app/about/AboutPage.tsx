"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import { Card } from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";
import ConferenceSliderBox from "@/components/main/conference-slider-box";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

// Simple function to parse markdown links and render them as JSX
function parseMarkdownLinks(text: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the link with proper styling
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[color:var(--color-ink)] underline decoration-accent decoration-2 underline-offset-2 hover:text-accent transition-colors"
      >
        {match[1]}
      </a>
    );

    lastIndex = linkRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

type AboutSection = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageDescription: string;
};

const aboutSections: AboutSection[] = [
  {
    title: "From Video Production to Web Development",
    description:
      "I am passionate about design and development on React platforms; Next.js and Astro. I also work on WordPress websites. I'm big on learning new things in a rapid-paced, ever-changing tech industry — never a dull moment in JavaScript, PHP, and their frameworks.\n\nIn 2013, I graduated after three communications internships at the University of North Florida. I started my career in video editing but after spending hours working and designing my website, I decided to switch careers to build websites. I work with React Frameworks like Next.js and WordPress websites.",
    image: "/gallery/Me-Recording-A-Video.webp",
    imageAlt: "Chris recording a video",
    imageDescription: "Recording a video in the field in 2013",
  },
  {
    title: "Local Meetup Host & Community Leader",
    description:
      "I led Richmond's local WordPress meetup and hosted monthly meetups from January 2022 till January 2025. We discussed WordPress topics, general web knowledge, and provide support for developers in the Glen Allen area.\n\nPreviously served as Digital Director for The JOMM (Jacksonville Online Marketing Meetup), where I increased monthly attendance and website engagement.",
    image: "/gallery/Richmond-WordPress-Meetup.webp",
    imageAlt: "Richmond WordPress Meetup",
    imageDescription: "WPRVA Event Banner",
  },
  {
    title: "Living in the Shenandoah Mountains",
    description:
      "Our dreams came true five years ago when I moved to Harrisonburg, Virginia. I later moved closer to Richmond, VA and now work remotely in the small town of Louisa, Virginia.\n\nMy wife runs a local equine-assisted private practice counseling service — [Heaven's Rays Ministries](https://heavensraysministries.com/). In Louisa, I am close to several cities and the Shenandoah mountains.",
    image: "/gallery/Me-on-a-Bike-Trail.webp",
    imageAlt: "Me on my bike at the Bike Trails by Piney River",
    imageDescription: "Exploring bike trails near the Piney River",
  },
  {
    title: "Adventure & Travel",
    description:
      "I love adventure and traveling. In 2016 my wife (Becky) and I traveled to the mountains in Washington and Oregon. The trails of Cannon Beach and the cliffs were the trip's highlights.\n\nAfter this trip, we started looking for work in the towns adjacent to the Appalachian Mountains. We love hiking, biking, and exploring the outdoors. We ended up moving to Harrisonburg, Virginia in 2018 and then moved to Central Virginia in 2019.",
    image: "/gallery/Becky-and-I-at-Glacier-National-Park.webp",
    imageAlt: "Glacier National Park",
    imageDescription: "Adventures at Glacier National Park",
  },
];

function AboutCard({
  section,
  index,
}: {
  section: AboutSection;
  index: number;
}) {
  // Determine if this card should have image on the left (even indices) or right (odd indices)
  const isImageLeft = index % 2 === 0;

  return (
    <Card
      size="page-full"
      padding="none"
      hover="lift"
      border="standard"
      shadow="soft"
      height="auto"
      delay={0.05 + index * 0.05}
      className="overflow-hidden"
    >
      <div className="grid md:grid-cols-2 gap-0 h-full">
        {/* Text Content */}
        <div
          className={cn(
            "flex flex-col justify-center p-6 sm:p-8",
            isImageLeft ? "md:order-2" : "md:order-1"
          )}
        >
          <h2 className="h2 font-semibold text-ink tracking-tight mb-4">{section.title}</h2>
          <div className="p text-ink/80 leading-relaxed whitespace-pre-line">
            {parseMarkdownLinks(section.description)}
          </div>
        </div>

        {/* Image */}
        <div
          className={cn(
            "relative min-h-[300px] md:min-h-full",
            isImageLeft ? "md:order-1" : "md:order-2"
          )}
        >
          <Image
            src={section.image}
            alt={section.imageAlt}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
          <div className="absolute bottom-4 right-4 text-xs px-3 py-1.5 rounded-full bg-base/80 backdrop-blur-sm border border-[color:var(--color-border)]">
            {section.imageDescription}
          </div>
        </div>
      </div>
    </Card>
  );
}

function AboutGridSection({ sections }: { sections: AboutSection[] }) {
  return (
    <motion.section
      className="grid grid-cols-1 gap-6 auto-rows-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {sections.map((section, index) => (
        <AboutCard key={section.title} section={section} index={index} />
      ))}
      <ConferenceSliderBox size="page-full" delay={0.05} />
    </motion.section>
  );
}

export default function AboutPage() {
  return (
    <main className="site-container py-12">
      <Banner
        title="About Me"
        breadcrumbPage="About"
        description="Life on the trails and the web, building modern React applications and leading the local WordPress community."
      />

      <FullWidthLayout>
        <AboutGridSection sections={aboutSections} />
      </FullWidthLayout>
    </main>
  );
}
