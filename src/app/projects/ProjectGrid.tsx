"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Banner from "@/components/page/banner";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ---------------------------------- Types --------------------------------- */

type Project = {
  title: string;
  description: string;
  features: string[];
  image: string;
  githubUrl?: string;
  vercelUrl?: string;
  customUrl?: string;
};

/* --------------------------------- Helpers -------------------------------- */

const isValidUrl = (url: string | undefined): boolean =>
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
    image: "/projects/Image-Horse-App.webp",
    githubUrl:
      "https://github.com/chrislanejones/multi-image-compress-and-edit",
    vercelUrl: "",
    customUrl: "",
  },
  {
    title: "Go Web Crawler",
    description:
      "This Go-based web crawler automatically scans multiple websites—recursively and intelligently—for specified links or text across HTML, PDF, and DOCX content, while detecting connectivity issues, network errors, and anti-bot protections.",
    features: [
      "Built in Go (Golang) for high concurrency and efficient network operations.",
      "Integrates PDF and DOCX parsing through external libraries (pdfcpu and gooxml)",
      "Features bot protection detection for systems like Cloudflare, Incapsula, and Sucuri",
      "Provides real-time progress tracking and detailed error categorization",
      "Supports multi-target, multi-site scanning with summarized CSV reporting per job",
    ],
    image: "/projects/Web-Crawler-Golang-App.webp",
    githubUrl: "https://github.com/chrislanejones/webcrawler-go",
    vercelUrl: "",
    customUrl: "",
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
    image: "/projects/MPC-Vim-Filter-Tool.webp",
    githubUrl: "https://github.com/chrislanejones/MPC-Vim-filter-tool",
    vercelUrl: "https://mpc-vim-filter-tool.vercel.app/",
    customUrl: "",
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasGithubUrl = isValidUrl(project.githubUrl);
  const hasVercelUrl = isValidUrl(project.vercelUrl);
  const hasCustomUrl = isValidUrl(project.customUrl);

  // Determine the primary link (prefer GitHub, then custom, then Vercel)
  const primaryLink =
    project.githubUrl || project.customUrl || project.vercelUrl;
  const hasPrimaryLink = isValidUrl(primaryLink);

  return (
    <Card
      size="small"
      hover="lift"
      border="standard"
      shadow="soft"
      height="xl"
      delay={0.05 + index * 0.05}
      className="overflow-hidden"
    >
      <div className="group flex h-full flex-col">
        {/* Project Image */}
        <div className="relative w-full aspect-[16/9] bg-white/5">
          {hasPrimaryLink ? (
            <Link
              href={primaryLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full aspect-[16/9] bg-white/5">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 3}
                />
              </div>
            </Link>
          ) : (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3}
            />
          )}
        </div>

        {/* Project Info */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Title */}
          {hasPrimaryLink ? (
            <Link
              href={primaryLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link inline-block mb-2"
            >
              <h3 className="text-ink tracking-tight text-left">
                {project.title}
              </h3>
            </Link>
          ) : (
            <h3 className="text-ink tracking-tight mb-2">{project.title}</h3>
          )}

          {/* Description */}
          <p className="text-ink mt-2 line-clamp-3">{project.description}</p>

          {/* Features */}
          <ul className="space-y-2 mt-4 flex-1">
            {project.features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-accent flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-ink text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto pt-6">
            {hasGithubUrl && (
              <Button
                asChild
                size="icon"
                round={true}
                variant="outline"
                title="View Code on GitHub"
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
            )}

            {hasVercelUrl && (
              <Button
                asChild
                size="icon"
                round={true}
                variant="outline"
                title="View Live Demo"
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
            )}

            {hasCustomUrl && (
              <Button
                asChild
                size="icon"
                round={true}
                variant="outline"
                title="View Project Link"
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
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProjectGridSection({ projects }: { projects: Project[] }) {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Projects grid"
    >
      {projects.map((project, index) => (
        <ProjectCard key={project.title} project={project} index={index} />
      ))}
    </section>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default function ProjectGrid() {
  const [activeTab, setActiveTab] = useState<"apps" | "clients">("apps");

  return (
    <main className="site-container py-12">
      <Banner
        title="Projects"
        breadcrumbPage="Projects"
        description={
          activeTab === "apps"
            ? "A collection of full-stack applications, tools, and experiments built with modern technologies and a focus on performance and user experience."
            : "Professional websites and web applications built for clients across various industries, featuring custom design and functionality."
        }
      />

      {/* Tabs - Left aligned with padding */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "apps" | "clients")}
        className="py-8"
      >
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="apps">
            App Projects
          </TabsTrigger>
          <TabsTrigger variant="pills" value="clients">
            Website Projects
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value="apps" className="mt-8">
          <ProjectGridSection projects={appProjects} />
        </TabsContent>
        <TabsContent value="clients" className="mt-8">
          <ProjectGridSection projects={clientProjects} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
