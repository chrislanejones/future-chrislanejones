"use client";

import { motion } from "framer-motion";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { FullWidthLayout } from "@/components/page/layout";

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

function TimelineTrail() {
  return (
    <Card size="page-full" className="mb-12">
      <h2 className="font-bold text-3xl mb-12 text-center">Career Journey</h2>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical trail line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/20 via-accent/40 to-accent/20 -translate-x-1/2" />

        {/* Timeline events */}
        <div className="relative space-y-12">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.year}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div
                className={cn(
                  "flex items-center gap-8",
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                )}
              >
                {/* Content side */}
                <div
                  className={cn(
                    "flex-1",
                    index % 2 === 0 ? "text-right" : "text-left"
                  )}
                >
                  <div
                    className={cn(
                      "inline-block bg-panel card rounded-lg p-5 shadow-passive hover:shadow-glow transition-shadow",
                      index % 2 === 0 ? "text-right" : "text-left"
                    )}
                  >
                    <div className="text-accent font-bold text-xl mb-2">
                      {event.year}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-3">
                      {event.description}
                    </p>
                    {event.location && (
                      <div
                        className={cn(
                          "text-xs text-muted/70 flex items-center gap-1.5",
                          index % 2 === 0 ? "justify-end" : "justify-start"
                        )}
                      >
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
                </div>

                {/* Center marker */}
                <motion.div
                  className="relative flex-shrink-0 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15 + 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-accent ring-4 ring-base shadow-glow" />
                </motion.div>

                {/* Empty space on opposite side */}
                <div className="flex-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function CareerPage() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="Career"
        breadcrumbPage="Career"
        description="My professional journey, skills, and experiences in software development and beyond."
      />

      <FullWidthLayout>
        <DownloadCard />
        <TimelineTrail />
      </FullWidthLayout>
    </main>
  );
}
