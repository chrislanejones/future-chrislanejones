"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";
import { Button } from "@/components/ui/button";
import GalleryDrawer, { GalleryPhoto } from "@/components/page/gallery-drawer";

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

type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  location?: string;
  icon: React.ReactNode;
};

const timelineEvents: TimelineEvent[] = [
  {
    year: "2013",
    title: "I Am a First-Generation College Graduate",
    description:
      "Graduated from University of North Florida with Bachelor of Arts with a concentration in Multimedia Journalism & Production",
    location: "Jacksonville, FL",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
      </svg>
    ),
  },
  {
    year: "2013-2016",
    title: "Lights, Camera, Action",
    description: "I Started a Career in Video Editing and Production",
    location: "Jacksonville, FL",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
      </svg>
    ),
  },
  {
    year: "2016",
    title: "I Enjoyed Coding My Personal Website So Much I Switched Careers",
    description:
      "Decided to switch from video production to web design after designing personal website",
    location: "Jacksonville, FL",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    year: "2017",
    title: "Front-End Web Development (jQuery Days)",
    description:
      "Began working with WordPress Theme and Plugin Development, JavaScript, jQuery, and the MERN Stack",
    location: "Jacksonville, FL",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
      </svg>
    ),
  },
  {
    year: "2018",
    title: "We Moved to the Mountains, Because Why Not?",
    description:
      "Relocated to Harrisonburg, Virginia in the Shenandoah Mountains",
    location: "Harrisonburg, VA",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
      </svg>
    ),
  },
  {
    year: "2019",
    title: "Moved Once Again — Moving Companies Love Us",
    description:
      "Picked Living Among the Cows to Be Near the Mountains and Richmond, VA.",
    location: "Louisa, VA",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    year: "2023",
    title: "WordPress Meetup Host",
    description:
      "Started leading Richmond's local WordPress meetup with monthly sessions.",
    location: "Louisa, VA",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63a1.5 1.5 0 00-1.43-1.07c-.8 0-1.54.46-1.92 1.17l-2.13 4.24c-.22.45-.32.95-.32 1.45V16h-1V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V16H8v-2.5c0-.83-.67-1.5-1.5-1.5S5 12.67 5 13.5V16H2v6h2v-4h2v4h2v-4h2v4h2v-4h2v4h4v-6z"/>
      </svg>
    ),
  },
  {
    year: "2024",
    title: "React Developer That Also Does WordPress",
    description:
      "Shifted More to React After Seeing the Animations (I Still Do WordPress Too)",
    location: "Louisa, VA",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.5,2C6.81,2 3,5.81 3,10.5S6.81,19 11.5,19C16.19,19 20,15.19 20,10.5S16.19,2 11.5,2M17.34,14.12C17.75,13.8 18.24,13.59 18.76,13.59C19.54,13.59 20.38,14.05 20.38,15.19C20.38,16.19 19.65,16.8 18.92,16.8C18.4,16.8 17.88,16.5 17.34,16.12C16.73,15.67 16.73,14.57 17.34,14.12M6.661,14.12C7.271,13.67 7.271,14.77 6.661,15.22C6.121,15.6 5.601,15.9 5.081,15.9C4.351,15.9 3.621,15.29 3.621,14.29C3.621,13.15 4.461,12.69 5.241,12.69C5.761,12.69 6.251,12.9 6.661,13.22V14.12Z"/>
      </svg>
    ),
  },
];

function TimelineTrail() {
  return (
    <Card size="page-full" className="mb-12">
      <h2 className="font-bold text-3xl mb-6 text-center">Career Journey</h2>

      {/* Responsive timeline: mobile = line left + content right; md+ = centered line w/ alternating sides */}
      <div className="relative max-w-4xl mx-auto">
        {/* Dotted vertical line */}
        <div className="absolute top-0 bottom-0 border-l-4 border-dotted border-green-500 left-[23px] md:left-1/2 md:-translate-x-1/2" />

        <ol className="relative space-y-12 md:ps-0">
          {timelineEvents.map((event, index) => {
            const isRightSide = index % 2 === 0; // on md+ only
            return (
              <motion.li
                key={`${event.year}-${index}`}
                className={cn(
                  "relative flex items-start",
                  // mobile: stack with content to the right of left line
                  "flex-row",
                  // md+: alternate sides around center line
                  isRightSide ? "md:flex-row" : "md:flex-row-reverse"
                )}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Spacer to balance alternating layout on md+ */}
                <div className="hidden md:block flex-1" />

                {/* Icon dot pinned to the line (mobile left, md+ center) */}
                <div className="absolute z-10 w-12 h-12 rounded-full bg-green-500 border-4 border-white dark:border-[#111418] shadow-lg left-0 md:left-1/2 translate-x-0 md:-translate-x-1/2 flex items-center justify-center text-white">
                  {event.icon}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "flex-1",
                    // Mobile: keep content to right of the left line with comfy padding
                    "pl-16",
                    // md+: add more padding AWAY from the center line so text doesn't hug it
                    isRightSide ? "md:pl-20 md:pr-0" : "md:pr-20 md:pl-0"
                  )}
                >
                  <time className="block text-sm text-muted mb-1">
                    {event.year}
                  </time>
                  <h3 className="text-lg font-semibold text-[color:var(--color-ink)]">
                    {event.title}
                  </h3>
                  <p className="text-base text-muted leading-relaxed mb-2">
                    {event.description}
                  </p>
                  {event.location && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted/80">
                      <svg
                        className="w-3.5 h-3.5"
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
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
function PhotoGalleryCard() {
  return (
    <Card
      size="page-half"
      delay={0.1}
      padding="none"
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
        <h3 className="text-xl md:text-xl font-bold">Setup Photo Gallery</h3>
        <p className="text-sm text-muted">Desk Setups Throughout the Years</p>
      </div>
    </Card>
  );
}
function ResumeDownloadCard() {
  return (
    <Card
      size="page-half"
      delay={0.2}
      padding="large"
      className="flex flex-col justify-center"
    >
      <h2 className="text-2xl font-bold text-[color:var(--color-ink)] mb-4">
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

        <Button asChild variant="base" size="lg" className="justify-start">
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
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="Career"
        breadcrumbPage="Career"
        description="Following the trail from video production to web development—navigating frameworks, communities, and mountain views along the way."
      />

      <FullWidthLayout>
        {/* Two Cards Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhotoGalleryCard />
          <ResumeDownloadCard />
        </div>

        <TimelineTrail />
      </FullWidthLayout>
    </main>
  );
};

export default CareerPage;
