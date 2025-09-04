"use client";

import { useState, SVGProps } from "react";
import { motion, AnimatePresence, wrap } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Project = {
  title: string;
  description: string;
  features: string[];
  image: string;
  githubUrl: string;
  vercelUrl: string;
};

const projects: Project[] = [
  {
    title: "MPC Vim filter Beat Machine",
    description:
      "A sleek, MPC-inspired interface for browsing and filtering Vim and NeoVim keyboard shortcuts.",
    features: [
      "MPC-Inspired UI with 20 drum pad-style filters",
      "TR-505 Drum Samples for audio feedback on filter toggle",
      "Smart Filtering: Toggleable shortcut categories",
    ],
    image: "/projects/mpc-vim-filter-tool.webp",
    githubUrl: "https://github.com/chrislanejones/MPC-Vim-filter-tool",
    vercelUrl: "https://mpc-vim-filter-tool.vercel.app/",
  },
  {
    title: "Go Web Crawler",
    description:
      "High-performance web crawler built with Go. Features concurrent processing, rate limiting, and comprehensive data extraction capabilities.",
    features: [
      "Concurrent crawling with goroutines",
      "Rate limiting and politeness policies",
      "Structured data extraction",
    ],
    image: "/projects/Go-Tool.webp",
    githubUrl: "https://github.com/chrislanejones/go-crawler",
    vercelUrl: "",
  },
];

export default function ProjectsBox() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentProject = projects[currentIndex];

  const setProject = (newDirection: 1 | -1) => {
    const nextIndex = wrap(0, projects.length, currentIndex + newDirection);
    setCurrentIndex(nextIndex);
    setDirection(newDirection);
  };

  const previousProject = () => setProject(-1);
  const nextProject = () => setProject(1);

  // Check if URLs are valid (not empty, not "#")
  const hasGithubUrl =
    currentProject.githubUrl &&
    currentProject.githubUrl !== "#" &&
    currentProject.githubUrl !== "";
  const hasVercelUrl =
    currentProject.vercelUrl &&
    currentProject.vercelUrl !== "#" &&
    currentProject.vercelUrl !== "";

  return (
    <motion.article
      id="projects"
      className="md:col-span-4 md:row-span-2 card rounded-3xl bg-panel p-6 grid md:grid-cols-2 gap-6 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="order-2 md:order-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Featured: {currentProject.title}
            </h3>
            <p className="text-muted font-normal mt-6">
              {currentProject.description}
            </p>
            <ul className="text-sm text-muted font-normal mt-6 space-y-2 flex-1">
              {currentProject.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* Navigation and Action Buttons - Bottom Left */}
        <div className="flex items-center gap-3 mt-6">
          {/* See Projects Button */}
          <Button asChild variant="neutral">
            <a href="/projects">See projects</a>
          </Button>
          {/* Left Arrow */}
          <motion.button
            onClick={previousProject}
            className="w-10 h-10 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
          >
            <ArrowLeft />
          </motion.button>

          {/* GitHub Icon Button */}
          <motion.button
            onClick={() =>
              hasGithubUrl && window.open(currentProject.githubUrl, "_blank")
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              hasGithubUrl
                ? "bg-ink/10 hover:bg-ink/20 cursor-pointer"
                : "bg-ink/5 text-ink/30 cursor-not-allowed"
            }`}
            whileTap={hasGithubUrl ? { scale: 0.9 } : {}}
            aria-label={
              hasGithubUrl ? "View on GitHub" : "GitHub link not available"
            }
            disabled={!hasGithubUrl}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.486 2 12.018c0 4.427 2.865 8.184 6.839 9.504.5.092.682-.218.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.37-1.343-3.37-1.343-.455-1.158-1.11-1.467-1.11-1.467-.908-.621.069-.609.069-.609 1.004.07 1.532 1.032 1.532 1.032.893 1.532 2.343 1.089 2.914.833.09-.647.35-1.089.636-1.34-2.221-.253-4.555-1.113-4.555-4.949 0-1.093.39-1.987 1.029-2.688-.103-.254-.446-1.273.097-2.653 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.503.337 1.909-1.296 2.748-1.026 2.748-1.026.544 1.38.201 2.399.099 2.653.64.701 1.028 1.595 1.028 2.688 0 3.846-2.338 4.693-4.566 4.941.36.31.68.92.68 1.852 0 1.336-.013 2.416-.013 2.744 0 .267.18.579.688.481A10.02 10.02 0 0 0 22 12.018C22 6.486 17.523 2 12 2Z"
              />
            </svg>
          </motion.button>

          {/* Vercel Icon Button */}
          <motion.button
            onClick={() =>
              hasVercelUrl && window.open(currentProject.vercelUrl, "_blank")
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              hasVercelUrl
                ? "bg-ink/10 hover:bg-ink/20 cursor-pointer"
                : "bg-ink/5 text-ink/30 cursor-not-allowed"
            }`}
            whileTap={hasVercelUrl ? { scale: 0.9 } : {}}
            aria-label={
              hasVercelUrl ? "View live demo" : "Live demo not available"
            }
            disabled={!hasVercelUrl}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="m12 0 12 21H0z" />
            </svg>
          </motion.button>

          {/* Right Arrow */}
          <motion.button
            onClick={nextProject}
            className="w-10 h-10 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
          >
            <ArrowRight />
          </motion.button>
        </div>
      </div>

      {/* Project Image */}
      <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[200px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${currentIndex}-image`}
            custom={direction}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentProject.image}
              alt={`${currentProject.title} preview`}
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-3 right-3 text-[11px] px-2 py-1 rounded-md bg-base/80">
          {currentIndex + 1} of {projects.length}
        </div>
      </div>
    </motion.article>
  );
}

// Icons (same as ClientSliderBox)
const iconsProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
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
