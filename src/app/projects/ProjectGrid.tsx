"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ---------------------------------- Types --------------------------------- */

type TabsKey = "apps" | "clients";

type Project = {
  title: string;
  description: string;
  features: string[];
  image: string;
  githubUrl: string;
  vercelUrl: string;
  customUrl?: string; // Optional custom link
};

/* --------------------------------- Helpers -------------------------------- */

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

const isValidUrl = (url: string): boolean =>
  typeof url === "string" && url.trim() !== "" && url.trim() !== "#";

/* --------------------------------- Data ----------------------------------- */

const appProjects: Project[] = [
  {
    title: "Image Editor & Optimizer",
    description:
      "Next.js + TanStack app for cropping, painting, blur tools, and batch processing. Optimized for performance with Tailwind and Plotly for data visualization.",
    features: [
      "Offline-friendly and keyboard-navigable",
      "Undo/redo, rotation/flip, pagination",
      "Bulk crop mirroring across selected images",
      "Performance optimized with Web Workers",
      "Real-time image processing pipeline",
    ],
    image: "/projects/multi-image-compress-and-edit-app.webp",
    githubUrl: "https://github.com/chrislanejones",
    vercelUrl: "",
    customUrl: "https://example.com/docs", // Example: documentation link
  },
  {
    title: "Go Web Crawler",
    description:
      "High-performance web crawler built with Go featuring concurrent processing, intelligent rate limiting, and comprehensive data extraction.",
    features: [
      "Concurrent crawling with goroutines",
      "Intelligent rate limiting and politeness policies",
      "Structured data extraction with custom parsers",
      "Distributed crawling architecture",
      "Real-time monitoring and analytics dashboard",
    ],
    image: "/projects/Go-Tool.webp",
    githubUrl: "https://github.com/chrislanejones/go-crawler",
    vercelUrl: "",
    customUrl: "", // Disabled
  },
  {
    title: "Vim/Neovim Shortcut Finder",
    description:
      "Interactive app to discover and master Vim/Neovim shortcuts via intuitive search and contextual learning.",
    features: [
      "Interactive shortcut search and filtering",
      "Context-aware command suggestions",
      "Custom shortcut collection builder",
      "Practice mode with typing challenges",
      "Plugin compatibility checker",
    ],
    image: "/projects/mpc-vim-filter-tool.webp",
    githubUrl: "https://github.com/chrislanejones/vim-shortcuts",
    vercelUrl: "https://vim-shortcuts.vercel.app",
    customUrl: "https://vim-shortcuts.vercel.app/guide", // Example: guide link
  },
];

const clientProjects: Project[] = [
  {
    title: "Alembic - AI Marketing Analytics Platform",
    description:
      "Enterprise-grade marketing intelligence platform that uses advanced causality models and AI to provide predictive insights and measure marketing ROI across all channels.",
    features: [
      "Next.js 14 with App Router and server-side rendering",
      "Sanity CMS integration for dynamic content management",
      "Tailwind CSS for responsive enterprise UI/UX",
      "TypeScript for type-safe development",
      "Optimized image delivery and performance",
    ],
    image: "/projects/Get-Alembic-Website.webp",
    githubUrl: "",
    vercelUrl: "",
    customUrl: "https://getalembic.com/",
  },
  {
    title: "Job Listing Plugin for WordPress with Elementor Theme",
    description:
      "A comprehensive WordPress plugin that integrates with the Ashby job board API to display current job listings on your website using Elementor.",
    features: [
      "Scheduled API data fetching at customizable times",
      "Database storage for improved performance",
      "Elementor widget for easy display",
      "Responsive card-based UI with customizable styling",
      "Admin interface for setup and management",
    ],
    image: "/projects/Job-Listing-WordPress-Plugin.webp",
    githubUrl: "https://github.com/chrislanejones/job-listing-plugin",
    vercelUrl: "",
    customUrl: "",
  },
  {
    title: "Wheelock Communities - Real Estate Development",
    description:
      "Corporate website for Wheelock Communities, showcasing master-planned communities, luxury condominiums, and resort development projects across the United States.",
    features: [
      "WordPress with custom theme development",
      "Advanced Custom Fields for flexible content management",
      "Responsive design with mobile-first approach",
      "Project portfolio with filterable gallery",
      "Optimized image delivery and lazy loading",
    ],
    image: "/projects/Wheelock-Communities.webp",
    githubUrl: "",
    vercelUrl: "",
    customUrl: "https://wheel.chrislanejones.com/",
  },
];

/* ------------------------------- Components ------------------------------- */

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const hasGithubUrl = isValidUrl(project.githubUrl);
  const hasVercelUrl = isValidUrl(project.vercelUrl);
  const hasCustomUrl = isValidUrl(project.customUrl || "");

  return (
    <Card size="page-full" className="grid md:grid-cols-2 gap-8">
      {/* Left: Copy */}
      <div
        className={cn(
          "flex flex-col",
          index % 2 === 0 ? "md:order-1" : "md:order-2"
        )}
      >
        <h2 className="font-bold text-2xl mb-4">{project.title}</h2>
        <p className="text-muted mb-6 leading-relaxed">{project.description}</p>

        <ul className="space-y-3 mb-8 flex-1">
          {project.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            asChild={hasGithubUrl}
            size="icon"
            round={true}
            disabled={!hasGithubUrl}
            title={hasGithubUrl ? "View Code on GitHub" : "Code not available"}
          >
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.486 2 12.018c0 4.427 2.865 8.184 6.839 9.504.5.092.682-.218.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.37-1.343-3.37-1.343-.455-1.158-1.11-1.467-1.11-1.467-.908-.621.069-.609.069-.609 1.004.07 1.532 1.032 1.532 1.032.893 1.532 2.343 1.089 2.914.833.09-.647.35-1.089.636-1.34-2.221-.253-4.555-1.113-4.555-4.949 0-1.093.39-1.987 1.029-2.688-.103-.254-.446-1.273.097-2.653 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.503.337 1.909-1.296 2.748-1.026 2.748-1.026.544 1.38.201 2.399.099 2.653.64.701 1.028 1.595 1.028 2.688 0 3.846-2.338 4.693-4.566 4.941.36.31.68.92.68 1.852 0 1.336-.013 2.416-.013 2.744 0 .267.18.579.688.481A10.02 10.02 0 0 0 22 12.018C22 6.486 17.523 2 12 2Z"
                />
              </svg>
            </a>
          </Button>

          <Button
            asChild={hasVercelUrl}
            size="icon"
            round={true}
            disabled={!hasVercelUrl}
            title={hasVercelUrl ? "View Live Demo" : "Demo not available"}
          >
            <a
              href={project.vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
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
            </a>
          </Button>

          <Button
            asChild={hasCustomUrl}
            size="icon"
            round={true}
            disabled={!hasCustomUrl}
            title={hasCustomUrl ? "View Additional Link" : "Link not available"}
          >
            <a
              href={project.customUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
              </svg>
            </a>
          </Button>
        </div>
      </div>

      {/* Right: Image */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[300px]",
          index % 2 === 0 ? "md:order-2" : "md:order-1"
        )}
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
        <div className="absolute bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-base/80 backdrop-blur-sm">
          Project {index + 1} of {total}
        </div>
      </div>
    </Card>
  );
}

function ProjectGridSection({ projects }: { projects: Project[] }) {
  return (
    <motion.section className="grid grid-cols-1 gap-5 auto-rows-auto">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          project={project}
          index={index}
          total={projects.length}
        />
      ))}
    </motion.section>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default function ProjectGrid() {
  const [activeTab, setActiveTab] = useState<TabsKey>("apps");

  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabsKey)}>
        <Banner
          title="Projects"
          breadcrumbPage="Projects"
          description={
            activeTab === "apps"
              ? "A collection of full-stack applications, tools, and experiments built with modern technologies and a focus on performance and user experience."
              : "Professional websites and web applications built for clients across various industries, featuring custom design and functionality."
          }
        />

        <div className="flex items-center justify-center my-10">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="apps">
              App Projects
            </TabsTrigger>
            <TabsTrigger variant="pills" value="clients">
              Websites Projects
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <TabsContent value="apps">
          <ProjectGridSection projects={appProjects} />
        </TabsContent>
        <TabsContent value="clients">
          <ProjectGridSection projects={clientProjects} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
