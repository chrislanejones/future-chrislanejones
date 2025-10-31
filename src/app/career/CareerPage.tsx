"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";
import { Button } from "@/components/ui/button";
import GalleryDrawer, { GalleryPhoto } from "@/components/page/gallery-drawer";
import { timelineEvents } from "@/data/career-timeline";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

const photos: GalleryPhoto[] = [
  {
    src: "/setups/Samsung-49-inch-Odyssey-G9.webp",
    alt: "Samsung 49-inch Odyssey G9 monitor setup",
    description: "Samsung 49-inch Odyssey G9 Gaming Monitor Setup",
  },
  {
    src: "/gallery/FCC-2017-Bold-Bean.webp",
    alt: "Coding at Bold Bean Jacksonville 2017",
    description: "Coding with Friends in Bold Bean Jax 2017",
  },
  {
    src: "/setups/Post-Pandemic-Dual-Monitor-Setup.webp",
    alt: "Post-pandemic dual monitor workstation",
    description: "Post-Pandemic Dual Monitor Setup",
  },
  {
    src: "/setups/Pandemic-Office-Setup-2021.webp",
    alt: "Home office setup during pandemic",
    description: "Pandemic Office Setup 2021",
  },
  {
    src: "/setups/Parents-House-Setup.webp",
    alt: "Temporary setup at parents house",
    description: "Parents House Setup During Transition",
  },
];

function TimelineTrail() {
  return (
    <div className="mb-12">
      <h2 className="mb-8 text-center">Career Journey</h2>

      {/* Timeline container - max width for desktop */}
      <div className="relative max-w-5xl mx-auto">
        {/* Dotted vertical line - left on mobile, center on desktop */}
        <div className="absolute top-0 bottom-0 left-[23px] md:left-1/2 md:-translate-x-1/2 border-l-4 border-dotted border-green-500 z-0" />

        {/* Timeline events */}
        <div className="relative">
          {timelineEvents.map((event, index) => {
            const isLeftSide = index % 2 === 0;

            return (
              <motion.div
                key={`${event.year}-${index}`}
                className="relative mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* 3-column grid on desktop: [left card] [icon] [right card] */}
                <div className="flex items-start md:grid md:grid-cols-[1fr_48px_1fr] md:gap-8">
                  {/* LEFT SIDE CONTENT (Desktop only, even indices) */}
                  <div
                    className={cn(
                      "hidden md:block",
                      !isLeftSide && "md:invisible"
                    )}
                  >
                    {isLeftSide && (
                      <Card
                        size="page-full"
                        padding="medium"
                        shadow="soft"
                        border="thin"
                        hover="lift"
                        style={{ minHeight: "auto" }}
                        className="text-right"
                      >
                        <time className="block text-green-500 mb-2">
                          {event.year}
                        </time>
                        <h3 className="mb-2">
                          {event.title}
                        </h3>
                        <p className="text-muted leading-relaxed mb-3">
                          {event.description}
                        </p>
                        {event.location && (
                          <div className="inline-flex items-center gap-1.5 text-muted/80 flex-row-reverse">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {event.location}
                          </div>
                        )}
                      </Card>
                    )}
                  </div>

                  {/* CENTER ICON (always visible) */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-green-500 border-4 border-white dark:border-[#111418] shadow-lg flex items-center justify-center text-white md:mx-auto">
                    {event.icon}
                  </div>

                  {/* RIGHT SIDE CONTENT */}
                  <div
                    className={cn(
                      // Mobile: always visible, takes remaining space
                      "flex-1 ml-6 md:ml-0",
                      // Desktop: only visible on odd indices
                      isLeftSide && "md:invisible md:hidden"
                    )}
                  >
                    <Card
                      size="page-full"
                      padding="medium"
                      shadow="soft"
                      border="thin"
                      hover="lift"
                      style={{ minHeight: "auto" }}
                      className="text-left"
                    >
                      <time className="block text-green-500 mb-2">
                        {event.year}
                      </time>
                      <h3 className="mb-2">
                        {event.title}
                      </h3>
                      <p className="text-muted leading-relaxed mb-3">
                        {event.description}
                      </p>
                      {event.location && (
                        <div className="inline-flex items-center gap-1.5 text-muted/80">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.location}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PhotoGalleryCard() {
  return (
    <Card
      size="page-half"
      padding="none"
      shadow="soft"
      border="thin"
      hover="lift"
      delay={0.1}
      className="overflow-hidden flex flex-col"
    >
      <div className="relative flex-1 min-h-[200px]">
        <Image
          alt="Samsung 49-inch Odyssey G9 setup"
          src="/setups/Samsung-49-inch-Odyssey-G9.webp"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent"></div>

        {/* Gallery Button - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <GalleryDrawer
            photos={photos}
            title="Gallery"
            description="Photos of Various Setups."
            animationDelay={0.2}
          />
        </div>
      </div>

      <div className="p-6">
        <h3 className="">Setup Photo Gallery</h3>
        <p className="text-muted">Desk Setups Throughout the Years</p>
      </div>
    </Card>
  );
}

function ResumeDownloadCard() {
  return (
    <Card
      size="page-half"
      padding="large"
      shadow="soft"
      border="thin"
      hover="lift"
      delay={0.2}
      className="flex flex-col justify-center"
    >
      <h2 className="mb-4">
        Resume & Portfolio
      </h2>
      <p className="text-muted mb-6">
        Download my resume and portfolio to learn more about my work experience,
        skills, and projects.
      </p>

      <div className="flex flex-col gap-3">
        <Button asChild variant="base" size="lg" className="justify-start">
          <a
            href="/career-files/Chris-Lane-Jones-UX-UI-Engineer-Resume-December-2024.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Resume (PDF)
          </a>
        </Button>

        <Button asChild variant="base" size="lg" className="justify-start">
          <a
            href="/career-files/Chris-Lane-Jones-UX-UI-Engineer-Resume-December-2024.docx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Resume (Word)
          </a>
        </Button>

        <Button asChild variant="disabled" size="lg" className="justify-start">
          <a
            href="/career-files/Portfolio-2025.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Download Portfolio (PDF)
          </a>
        </Button>
      </div>
    </Card>
  );
}

const CareerPage: React.FC = () => {
  return (
    <main className="site-container py-12">
      <Banner
        title="Career"
        breadcrumbPage="Career"
        description="Following the trail from video production to web development—navigating frameworks, communities, and mountain views along the way."
      />

      <FullWidthLayout>
        {/* Two Cards Side by Side - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <PhotoGalleryCard />
          <ResumeDownloadCard />
        </div>

        {/* Timeline with individual cards */}
        <TimelineTrail />
      </FullWidthLayout>
    </main>
  );
};

export default CareerPage;
