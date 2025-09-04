"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  },
];

const clientProjects: Project[] = [
  {
    title: "Coastal Realty Group",
    description:
      "Modern real estate website with property search, virtual tours, and agent profiles. Built with Next.js and integrated with MLS.",
    features: [
      "Advanced property search and filtering",
      "Interactive map integration",
      "Virtual tour showcase",
      "Agent profile and contact system",
      "Mobile-responsive design",
    ],
    image: "/projects/Go-Tool.webp",
    githubUrl: "",
    vercelUrl: "https://coastal-realty-demo.vercel.app",
  },
  {
    title: "Artisan Coffee Roasters",
    description:
      "E-commerce for specialty coffee with subscriptions, brewing guides, and reviews. Includes roast tracking and inventory.",
    features: [
      "Subscription-based ordering system",
      "Coffee origin tracking and profiles",
      "Brewing method guides and videos",
      "Customer review and rating system",
      "Inventory management dashboard",
    ],
    image: "/projects/multi-image-compress-and-edit-app.webp",
    githubUrl: "",
    vercelUrl: "https://artisan-coffee-demo.vercel.app",
  },
  {
    title: "Healthcare Partners Clinic",
    description:
      "Patient portal and appointment scheduling. HIPAA-compliant with secure messaging, results, and telehealth.",
    features: [
      "HIPAA-compliant patient portal",
      "Online appointment scheduling",
      "Secure patient-provider messaging",
      "Lab results and medical records access",
      "Telehealth video consultation integration",
    ],
    image: "/projects/mpc-vim-filter-tool.webp",
    githubUrl: "",
    vercelUrl: "",
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

  return (
    <motion.article
      className="card rounded-3xl bg-panel p-8 grid md:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
    >
      {/* Left: Copy */}
      <div
        className={cn(
          "flex flex-col",
          index % 2 === 0 ? "order-1" : "order-2 md:order-1"
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
        <div className="flex gap-4">
          {hasGithubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition shadow-passive focus-ring hover:shadow-glow select-none bg-panel card text-[color:var(--color-ink)] h-9 text-sm flex-1 justify-center"
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
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel/50 text-ink/30 cursor-not-allowed opacity-50 h-9 text-sm flex-1 justify-center">
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
            </div>
          )}

          {hasVercelUrl ? (
            <a
              href={project.vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition shadow-passive focus-ring hover:shadow-glow select-none bg-panel card text-[color:var(--color-ink)] h-9 text-sm flex-1 justify-center"
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
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel/50 text-ink/30 cursor-not-allowed opacity-50 h-9 text-sm flex-1 justify-center">
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
            </div>
          )}
        </div>
      </div>

      {/* Right: Image */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[300px]",
          index % 2 === 0 ? "order-2" : "order-1 md:order-2"
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
    </motion.article>
  );
}

function ProjectGridSection({ projects }: { projects: Project[] }) {
  return (
    <motion.section
      className="grid grid-cols-1 gap-5 auto-rows-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-start justify-between mb-16 gap-6">
            <div className="text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                Projects
              </h1>

              <Breadcrumb className="mb-6">
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

              <TabsList>
                <TabsTrigger value="apps">App Projects</TabsTrigger>
                <TabsTrigger value="clients">Client Websites</TabsTrigger>
              </TabsList>
            </div>

            <p className="text-[color:var(--color-muted)] text-lg max-w-md text-right">
              {activeTab === "apps"
                ? "A collection of full-stack applications, tools, and experiments built with modern technologies and a focus on performance and user experience."
                : "Professional websites and web applications built for clients across various industries, featuring custom design and functionality."}
            </p>
          </div>
        </motion.div>

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
