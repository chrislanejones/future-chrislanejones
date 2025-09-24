"use client";

import { AnimatePresence, motion, wrap } from "framer-motion";
import Card from "../page/card";
import { useState, SVGProps, forwardRef } from "react";
import Image from "next/image";

type Conference = {
  name: string;
  logo: string;
  year?: string;
  location?: string;
};

const conferences: Conference[] = [
  {
    name: "All Things Open 2024",
    logo: "/conferences/All-Things-Open-2024-Smaller.png",
    year: "2024",
    location: "Raleigh, NC",
  },
  {
    name: "Echo Hub Media Conference",
    logo: "/conferences/Echohub-Media-Conference-Dallas-2013.webp",
    year: "2013",
    location: "Dallas, TX",
  },
  {
    name: "Jacksonville WordCamp",
    logo: "/conferences/Jacksonville-WordCamp-2018.webp",
    year: "2018",
    location: "Jacksonville, FL",
  },
  {
    name: "RenderATL",
    logo: "/conferences/RenderATL-2024-Logo-Green.png",
    year: "2024",
    location: "Atlanta, GA",
  },
  {
    name: "RVAJS Conf",
    logo: "/conferences/RVAJS-Conf-Richmond-2023.webp",
    year: "2023",
    location: "Richmond, VA",
  },
  {
    name: "Tech Coast Conference",
    logo: "/conferences/Tech-Coast-Conference-2018.webp",
    year: "2018",
    location: "Jacksonville, FL",
  },
  {
    name: "Tech Coast Conference",
    logo: "/conferences/Tech-Coast-Conference-2020.webp",
    year: "2020",
    location: "Jacksonville, FL",
  },
  {
    name: "Tech Coast Conference",
    logo: "/conferences/Tech-Coast-Conference-2024.webp",
    year: "2024",
    location: "Jacksonville, FL",
  },
  {
    name: "THAT Conference",
    logo: "/conferences/That-Conference-Logo.webp",
    year: "2024",
    location: "Wisconsin",
  },
  {
    name: "WordCamp Asheville",
    logo: "/conferences/WordCamp-Asheville-2017.webp",
    year: "2017",
    location: "Asheville, NC",
  },
  {
    name: "WordCamp Jacksonville",
    logo: "/conferences/WordCamp-Jackonville-2017.webp",
    year: "2017",
    location: "Jacksonville, FL",
  },
  {
    name: "WordCamp US",
    logo: "/conferences/WordCamp-US-2023.webp",
    year: "2023",
    location: "National Harbor, MD",
  },
];

// Create groups of 6 conferences each (3x2 grid)
const conferenceGroups: Conference[][] = [];
for (let i = 0; i < conferences.length; i += 6) {
  const group = conferences.slice(i, i + 6);
  // Pad group with empty slots if needed to maintain grid structure
  while (group.length < 6) {
    group.push({
      name: "",
      logo: "",
    });
  }
  conferenceGroups.push(group);
}

// Component props interface
interface ConferenceSliderBoxProps {
  size?:
    | "small"
    | "medium"
    | "large"
    | "wide"
    | "hero"
    | "full"
    | "page-full"
    | "page-half"
    | "page-third";
  delay?: number;
}

type ConferenceGroupProps = {
  conferences: Conference[];
  direction: number;
};

export default function ConferenceSliderBox({
  size = "large",
  delay = 0.3,
}: ConferenceSliderBoxProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function setSlide(newDirection: 1 | -1) {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const nextGroup = wrap(
      0,
      conferenceGroups.length,
      selectedGroup + newDirection
    );
    setSelectedGroup(nextGroup);
    setDirection(newDirection);

    setTimeout(() => setIsTransitioning(false), 600);
  }

  const showNavigation = conferenceGroups.length > 1;
  const currentConferences =
    conferenceGroups[selectedGroup] || conferences.slice(0, 6);

  return (
    <Card size={size} delay={delay} padding="medium">
      <h2 className="text-center font-bold text-2xl mb-6">
        Tech Conferences Attended
      </h2>

      <div className="flex items-center justify-between gap-4">
        {/* Left Arrow */}
        {showNavigation ? (
          <motion.button
            initial={false}
            aria-label="Previous"
            className={`w-12 h-12 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-all duration-200 ${
              isTransitioning
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => setSlide(-1)}
            disabled={isTransitioning}
            whileTap={{ scale: 0.9 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              transition: { duration: 0.2 },
            }}
            animate={
              isTransitioning && direction === -1
                ? {
                    x: [-2, 2, -2, 0],
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }
                : {}
            }
          >
            <ArrowLeft />
          </motion.button>
        ) : (
          <div className="w-12" />
        )}

        <div className="flex-1 relative h-80 overflow-hidden rounded-xl">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <ConferenceGroup
              key={selectedGroup}
              conferences={currentConferences}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        {showNavigation ? (
          <motion.button
            initial={false}
            aria-label="Next"
            className={`w-12 h-12 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-all duration-200 ${
              isTransitioning
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => setSlide(1)}
            disabled={isTransitioning}
            whileTap={{ scale: 0.9 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              transition: { duration: 0.2 },
            }}
            animate={
              isTransitioning && direction === 1
                ? {
                    x: [2, -2, 2, 0],
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }
                : {}
            }
          >
            <ArrowRight />
          </motion.button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Pagination dots */}
      {showNavigation && (
        <div className="flex justify-center gap-2 mt-4">
          {conferenceGroups.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setDirection(index > selectedGroup ? 1 : -1);
                  setSelectedGroup(index);
                  setIsTransitioning(true);
                  setTimeout(() => setIsTransitioning(false), 600);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedGroup
                  ? "bg-accent"
                  : "bg-ink/20 hover:bg-ink/40"
              } ${isTransitioning ? "opacity-50" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

const ConferenceGroup = forwardRef<HTMLDivElement, ConferenceGroupProps>(
  ({ conferences, direction }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-6 p-4"
        initial={{ opacity: 0, x: direction * 50 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            delay: 0.1,
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
        exit={{
          opacity: 0,
          x: direction * -50,
          transition: { duration: 0.3 },
        }}
      >
        {conferences.map((conference: Conference, index: number) => {
          // Skip empty slots
          if (!conference.name || !conference.logo) {
            return (
              <div
                key={`empty-${index}`}
                className="flex items-center justify-center"
              />
            );
          }

          return (
            <motion.div
              key={`${conference.name}-${conference.year}-${index}`}
              className="flex flex-col items-center justify-center relative hover:scale-105 transition-all duration-300 opacity-80 hover:opacity-100 bg-white/5 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                transition: {
                  delay: index * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                },
              }}
            >
              <div className="relative w-full h-24 mb-2">
                <Image
                  src={conference.logo}
                  alt={`${conference.name} logo`}
                  fill
                  className="object-contain"
                  sizes="250px"
                />
              </div>
              <div className="text-center">
                <h4 className="text-xs font-medium text-white mb-1">
                  {conference.name}
                </h4>
                {(conference.year || conference.location) && (
                  <p className="text-xs text-muted opacity-75">
                    {conference.year}
                    {conference.year && conference.location && " • "}
                    {conference.location}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }
);

ConferenceGroup.displayName = "ConferenceGroup";

// Icons
const iconsProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "28",
  height: "28",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function ArrowLeft() {
  return (
    <svg {...iconsProps}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg {...iconsProps}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
