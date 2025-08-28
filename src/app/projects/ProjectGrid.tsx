"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      "Offline-friendly and keyboard‑navigable",
      "Undo/redo, rotation/flip, pagination",
      "Bulk crop mirroring across selected images",
      "Performance optimized with Web Workers",
      "Real-time image processing pipeline",
    ],
    image: "/FCC-2017-Bold-Bean.webp",
    githubUrl: "https://github.com/chrislanejones",
    vercelUrl: "https://vercel.com/chrislanejones",
  },
  {
    title: "Go Web Crawler",
    description:
      "High-performance web crawler built with Go featuring concurrent processing, intelligent rate limiting, and comprehensive data extraction capabilities for large-scale web scraping operations.",
    features: [
      "Concurrent crawling with goroutines",
      "Intelligent rate limiting and politeness policies",
      "Structured data extraction with custom parsers",
      "Distributed crawling architecture",
      "Real-time monitoring and analytics dashboard",
    ],
    image: "/FCC-2017-Bold-Bean.webp",
    githubUrl: "https://github.com/chrislanejones/go-crawler",
    vercelUrl: "https://go-crawler.vercel.app",
  },
  {
    title: "Vim/Neovim Shortcut Finder",
    description:
      "Interactive web application that helps developers discover and master Vim/Neovim shortcuts through an intuitive search interface and contextual learning system.",
    features: [
      "Interactive shortcut search and filtering",
      "Context-aware command suggestions",
      "Custom shortcut collection builder",
      "Practice mode with typing challenges",
      "Plugin compatibility checker",
    ],
    image: "/FCC-2017-Bold-Bean.webp",
    githubUrl: "https://github.com/chrislanejones/vim-shortcuts",
    vercelUrl: "https://vim-shortcuts.vercel.app",
  },
];

export default function ProjectGrid() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      {/* Page Header */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-start justify-between">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Projects
            </h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <p className="text-muted text-lg max-w-md text-right">
            A collection of full-stack applications, tools, and experiments
            built with modern technologies and a focus on performance and user
            experience.
          </p>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="col-span-1 card rounded-3xl bg-panel p-8 grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
          >
            {/* Project Content */}
            <div
              className={`flex flex-col ${
                index % 2 === 0 ? "order-1" : "order-2 md:order-1"
              }`}
            >
              <h2 className="font-bold text-2xl mb-4">{project.title}</h2>
              <p className="text-muted mb-6 leading-relaxed">
                {project.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {project.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition shadow-passive focus-ring hover:shadow-glow disabled:opacity-50 disabled:pointer-events-none select-none bg-panel card text-[color:var(--color-ink)] h-9 text-sm flex-1 justify-center"
                >
                  <svg
                    aria-hidden="true"
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
                  <span>View Code</span>
                </a>

                <a
                  href={project.vercelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition shadow-passive focus-ring hover:shadow-glow disabled:opacity-50 disabled:pointer-events-none select-none bg-panel card text-[color:var(--color-ink)] h-9 text-sm flex-1 justify-center"
                >
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="m12 0 12 21H0z" />
                  </svg>
                  <span>Live Demo</span>
                </a>
              </div>
            </div>

            {/* Project Image */}
            <div
              className={`relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[300px] ${
                index % 2 === 0 ? "order-2" : "order-1 md:order-2"
              }`}
            >
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-base/80 backdrop-blur-sm">
                Project {index + 1} of {projects.length}
              </div>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
