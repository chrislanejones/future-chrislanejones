"use client";

import { useState, SVGProps } from "react";
import { motion, AnimatePresence, wrap } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

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
    title: "Image Editor & Optimizer",
    description:
      "Next.js + TanStack app for cropping, painting, blur tools, and batch processing. Optimized for performance with Tailwind and Plotly for data visualization.",
    features: [
      "Offline-friendly and keyboard-navigable",
      "Undo/redo, rotation/flip, pagination",
      "Bulk crop mirroring across selected images",
    ],
    image: "/projects/Image-Horse-App.webp",
    githubUrl:
      "https://github.com/chrislanejones/multi-image-compress-and-edit",
    vercelUrl: "",
  },
  {
    title: "Golang Web Crawler",
    description:
      "This Go-based web crawler automatically scans multiple websites—recursively and intelligently—for specified links or text across HTML, PDF, and DOCX content, while detecting connectivity issues, network errors, and anti-bot protections.",
    features: [
      "Built in Go (Golang) for high concurrency and efficient network operations.",
      "Integrates PDF and DOCX parsing through external libraries (pdfcpu and gooxml)",
      "Features bot protection detection for systems like Cloudflare, Incapsula, and Sucuri",
    ],
    image: "/projects/Web-Crawler-Golang-App.webp",
    githubUrl: "git@github.com:chrislanejones/webcrawler-go.git",
    vercelUrl: "",
  },
  {
    title: "Vim/Neovim Shortcut Finder",
    description:
      "Interactive app to discover and master Vim/Neovim shortcuts via intuitive search and contextual learning.",
    features: [
      "Interactive shortcut search and filtering",
      "Context-aware command suggestions",
      "Custom shortcut collection builder",
    ],
    image: "/projects/MPC-Vim-Filter-Tool.webp",
    githubUrl: "https://github.com/chrislanejones/MPC-Vim-filter-tool",
    vercelUrl: "https://mpc-vim-filter-tool.vercel.app/",
  },
];

export default function ProjectsContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentProject = projects[currentIndex];

  const setProject = (dir: 1 | -1) => {
    const nextIndex = wrap(0, projects.length, currentIndex + dir);
    setCurrentIndex(nextIndex);
    setDirection(dir);
  };

  const prev = () => setProject(-1);
  const next = () => setProject(1);

  const hasGithub = currentProject.githubUrl.trim() !== "";
  const hasVercel = currentProject.vercelUrl.trim() !== "";

  return (
    <>
      {/* LEFT COLUMN (TEXT) */}
      <div className="order-2 md:order-1 flex flex-col min-w-0 h-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col min-w-0 flex-1"
          >
            <h3 className="text-ink tracking-tight break-words">
              Project: {currentProject.title}
            </h3>

            <p className="p text-ink mt-6 break-words">
              {currentProject.description}
            </p>

            <ul className="text-ink mt-6 space-y-2 break-words">
              {currentProject.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* ACTION BAR – sits at bottom on desktop */}
        <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-auto">
          <Button asChild variant="neutral" className="min-w-[140px]">
            <a href="/projects">View All Projects</a>
          </Button>

          <Button onClick={prev} variant="neutral" size="icon" round>
            <ArrowLeft />
          </Button>

          <Button
            onClick={() => hasGithub && window.open(currentProject.githubUrl)}
            variant="neutral"
            size="icon"
            round
            disabled={!hasGithub}
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Button
            onClick={() => hasVercel && window.open(currentProject.vercelUrl)}
            variant="neutral"
            size="icon"
            round
            disabled={!hasVercel}
            aria-label="Live demo"
          >
            <ExternalLink className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Button onClick={next} variant="neutral" size="icon" round>
            <ArrowRight />
          </Button>
        </div>
      </div>

      {/* RIGHT COLUMN (IMAGE) */}
      <div className="order-1 md:order-2 relative w-full h-full rounded-2xl overflow-hidden ring-1 ring-white/10">
        {/* MOBILE: TALLER IMAGE */}
        <div className="relative md:hidden w-full aspect-[4/3]">
          <Image
            src={currentProject.image}
            alt={`${currentProject.title} preview`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* DESKTOP: FULL HEIGHT */}
        <div className="hidden md:block absolute inset-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${currentIndex}-image`}
              custom={direction}
              initial={{ opacity: 0, scale: 0.9, x: direction * 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: direction * -40 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={currentProject.image}
                alt={`${currentProject.title} preview`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm image-overlay-text text-sm">
          {currentIndex + 1} / {projects.length}
        </div>
      </div>
    </>
  );
}

/* ICONS FOR ARROWS */
function ArrowLeft() {
  return (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg {...iconProps} viewBox="0 0 24 24">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const iconProps: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
