"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";
import ConferenceSliderBox from "@/components/main/conference-slider-box";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

type AboutSection = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const aboutSections: AboutSection[] = [
  {
    title: "From Video Production to Web Development",
    description:
      "I am passionate about design and development on React platforms; Next.js and Astro. I also work on WordPress websites. I'm big on learning new things in a rapid-paced, ever-changing tech industry – never a dull moment in JavaScript, PHP, and their frameworks. In 2013, I graduated after three communications internships at the University of North Florida. I started my career in video editing but after spending hours working and designing my website, I decided to switch careers to build websites. I work with React Frameworks like Next.js and WordPress websites.",
    image: "/gallery/Me-Recording-A-Video.webp",
    imageAlt: "Chris recording a video",
  },
  {
    title: "My Home Office Setup",
    description:
      "Working remotely from Louisa, Virginia with a dual-monitor standing desk setup that keeps me productive and healthy during long development sessions.",
    image: "/gallery/Standing-Desk-Setup.webp",
    imageAlt: "Adjustable Standing Desk with Two Displays and Laptop",
  },
  {
    title: "Richmond WordPress Chapter Host",
    description:
      "I lead Richmond's local WordPress meetup and host monthly meetups since January 2022. We discuss WordPress topics, general web knowledge, and provide support for developers in the Glen Allen area. Previously served as Digital Director for The JOMM (Jacksonville Online Marketing Meetup), where I increased monthly attendance and website engagement.",
    image: "/gallery/Richmond-WordPress-Meetup.webp",
    imageAlt: "Richmond WordPress Meetup",
  },
  {
    title: "Living in the Shenandoah Mountains",
    description:
      "Our dreams came true five years ago when I moved to Harrisonburg, Virginia. I later moved closer to Richmond, VA and now work remotely in the small town of Louisa, Virginia. My wife runs a local equine-assisted private practice counseling service – Heaven's Rays Ministries. In Louisa, I am close to several cities and the Shenandoah mountains.",
    image: "/gallery/Me-on-a-Bike-Trail.webp",
    imageAlt: "Bike Trails by Piney River",
  },
  {
    title: "Adventure & Travel",
    description:
      "I love adventure and traveling. In 2016 my wife (Becky) and I traveled to the mountains in Washington and Oregon. The trails of Cannon Beach and the cliffs were the trip's highlights. After this trip, we started looking for work in the towns adjacent to the Appalachian Mountains.",
    image: "/gallery/Becky-and-I-at-Glacier-National-Park.webp",
    imageAlt: "Glacier National Park",
  },
];

function AboutCard({
  section,
  index,
  total,
}: {
  section: AboutSection;
  index: number;
  total: number;
}) {
  return (
    <Card
      size="page-full"
      className="grid md:grid-cols-2 gap-8"
      delay={0.1 + index * 0.1}
    >
      {/* Text Content */}
      <div
        className={cn(
          "flex flex-col justify-center",
          index % 2 === 0 ? "order-1" : "order-2 md:order-1"
        )}
      >
        <h2 className="font-bold text-2xl mb-6">{section.title}</h2>
        <p className="text-muted leading-relaxed text-base">
          {section.description}
        </p>
      </div>

      {/* Image */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[300px]",
          index % 2 === 0 ? "order-2" : "order-1 md:order-2"
        )}
      >
        <Image
          src={section.image}
          alt={section.imageAlt}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
        <div className="absolute bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-base/80 backdrop-blur-sm">
          {section.imageAlt}
        </div>
      </div>
    </Card>
  );
}

function AboutGridSection({ sections }: { sections: AboutSection[] }) {
  return (
    <motion.section
      className="grid grid-cols-1 gap-8 auto-rows-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <ConferenceSliderBox size="page-full" delay={0.5} />
      {sections.map((section, index) => (
        <AboutCard
          key={section.title}
          section={section}
          index={index}
          total={sections.length}
        />
      ))}
    </motion.section>
  );
}

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
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
