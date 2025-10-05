"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";
import { Button } from "@/components/ui/button";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  location?: string;
};

const timelineEvents: TimelineEvent[] = [
  {
    year: "2013",
    title: "Communications Degree",
    description:
      "Graduated from University of North Florida after three communications internships",
    location: "Jacksonville, FL",
  },
  {
    year: "2013-2016",
    title: "Video Production Career",
    description: "Started career in video editing and production",
    location: "Jacksonville, FL",
  },
  {
    year: "2016",
    title: "Career Transition",
    description:
      "Decided to switch from video production to web development after designing personal website",
  },
  {
    year: "2018",
    title: "Web Development Focus",
    description: "Began working with React frameworks and WordPress",
  },
  {
    year: "2019",
    title: "Move to Virginia",
    description:
      "Relocated to Harrisonburg, Virginia in the Shenandoah Mountains",
    location: "Harrisonburg, VA",
  },
  {
    year: "2022",
    title: "WordPress Meetup Host",
    description:
      "Started leading Richmond's local WordPress meetup with monthly sessions",
    location: "Richmond, VA",
  },
  {
    year: "2024",
    title: "Remote Developer",
    description:
      "Working remotely specializing in Next.js, Astro, and WordPress",
    location: "Louisa, VA",
  },
];

function TimelineTrail() {
  return (
    <Card size="page-full" className="mb-12">
      <h2 className="font-bold text-3xl mb-6 text-center">Career Journey</h2>

      {/* Responsive timeline: mobile = line left + content right; md+ = centered line w/ alternating sides */}
      <div className="relative max-w-4xl mx-auto">
        {/* Dotted vertical line */}
        <div className="absolute top-0 bottom-0 border-l-4 border-dotted border-green-500 left-[11px] md:left-1/2 md:-translate-x-1/2" />

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

                {/* Solid dot pinned to the line (mobile left, md+ center) */}
                <div className="absolute z-10 w-6 h-6 rounded-full bg-green-500 border-4 border-white dark:border-[#111418] shadow-lg left-0 md:left-1/2 translate-x-0 md:-translate-x-1/2" />

                {/* Content */}
                <div
                  className={cn(
                    "flex-1",
                    // Mobile: keep content to right of the left line with comfy padding
                    "pl-10",
                    // md+: add padding AWAY from the center line so text doesn't hug it
                    isRightSide ? "md:pl-12 md:pr-0" : "md:pr-12 md:pl-0"
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

function DownloadCard() {
  return (
    <Card size="small" className="mb-8">
      <h2 className="text-center text-[color:var(--color-ink)] text-lg pb-2">
        Resume and Portfolio
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="base">
          <a href="/resume.pdf" download>
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Resume (PDF)
          </a>
        </Button>
        <Button asChild variant="base">
          <a href="/resume.docx" download>
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Resume (Word)
          </a>
        </Button>
        <Button asChild variant="base">
          <a href="/portfolio.pdf" download>
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Portfolio
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
        <DownloadCard />
        <TimelineTrail />
      </FullWidthLayout>
    </main>
  );
};

export default CareerPage;
