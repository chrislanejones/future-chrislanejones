"use client";

import { useState } from "react";
import { preload } from "react-dom";
import { ArrowUpRight, Check, Code2 } from "lucide-react";
import { ProjectPreview } from "@/components/coastal/project-preview";
import { PageIntro } from "@/components/coastal/page-intro";
import { Reveal } from "@/components/coastal/reveal";
import styles from "@/components/coastal/coastal.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPageHeader } from "@/lib/page-headers";
import { isImageHorseApp, projectPresentation } from "@/data/project-presentation";
import { useQuery } from "convex/react";
import { projects as fallbackProjects } from "@/data/projects-data";
import { api } from "../../../convex/_generated/api";

/* ---------------------------------- Types --------------------------------- */

type Project = {
  _id?: string;
  title: string;
  description: string;
  features?: string[];
  image?: string;
  githubUrl?: string;
  codebergUrl?: string;
  vercelUrl?: string;
  customUrl?: string;
};

const plain = (text: string) => text.replace(/[\u2013\u2014]/g, "-");

/* --------------------------------- Helpers -------------------------------- */

const isValidUrl = (url: string | undefined): boolean =>
  typeof url === "string" && url.trim() !== "" && url.trim() !== "#";

// Keep the archive and homepage fallbacks on the same complete catalog.
const FALLBACK_APPS: Project[] = fallbackProjects.filter((project) => project.category === "app");
const FALLBACK_WEBSITES: Project[] = fallbackProjects.filter((project) => project.category === "website");

// Measured preview widths: ~86vw in the one-column layout, ~41vw in two
// columns, capped at 608px once the container stops growing (1600px+).
const PREVIEW_SIZES = "(max-width: 767px) 86vw, (min-width: 1600px) 608px, 41vw";

/* ------------------------------- Components ------------------------------- */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const presentation = projectPresentation(project);
  const isImageHorse = isImageHorseApp(project);
  const primaryLink = isImageHorse ? presentation.href : [
    project.githubUrl,
    project.codebergUrl,
    project.customUrl,
    project.vercelUrl,
  ].find(isValidUrl);
  const links = [
    { href: project.githubUrl, label: "GitHub", source: true },
    { href: project.codebergUrl, label: "Codeberg", source: true },
    { href: isImageHorse ? presentation.href : project.vercelUrl === project.customUrl ? undefined : project.vercelUrl, label: "Live demo", source: false },
    { href: isImageHorse ? undefined : project.customUrl, label: "View project", source: false },
  ].filter((link) => isValidUrl(link.href));

  return (
    <Reveal delay={index * 0.04}>
      <article className={styles.archiveProject}>
        <ProjectPreview
          title={plain(presentation.title)}
          image={presentation.image}
          imageFit={presentation.imageFit}
          imageAspectRatio={presentation.imageAspectRatio}
          href={primaryLink}
          sizes={PREVIEW_SIZES}
          priority={index === 0}
          githubUrl={project.githubUrl}
          codebergUrl={project.codebergUrl}
        />
        <div className={styles.archiveProjectInfo}>
          <h2>
            {primaryLink ? (
              <a href={primaryLink} target="_blank" rel="noopener noreferrer">
                {plain(presentation.title)}
              </a>
            ) : (
              plain(presentation.title)
            )}
          </h2>
          <p>{plain(presentation.description)}</p>
          {(project.features ?? []).length > 0 && (
            <ul className={styles.projectFeatures}>
              {project.features!.slice(0, 5).map((feature, i) => (
                <li key={i}>
                  <Check size={16} aria-hidden="true" />
                  <span>{plain(feature)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.projectLinks}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                {link.source ? <Code2 size={16} aria-hidden="true" /> : null}
                {link.label}
                {!link.source ? (
                  <ArrowUpRight size={16} aria-hidden="true" />
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProjectGridSection({ projects }: { projects: Project[] }) {
  return (
    <section className={styles.archiveGrid} aria-label="Projects grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id ?? project.title}
          project={project}
          index={index}
        />
      ))}
    </section>
  );
}

export default function ProjectGrid() {
  // The first card's sand backdrop is the mobile LCP element, and as a CSS
  // background it is otherwise found only after the stylesheet loads.
  preload("/textures/project-sand.svg", { as: "image", fetchPriority: "high" });
  const [activeTab, setActiveTab] = useState<"apps" | "clients">("apps");
  const appsConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/projects/apps",
  });
  const websitesConvex = useQuery(api.pageHeaders.getPageHeaderByPath, {
    path: "/projects/websites",
  });
  const convexApps = useQuery(api.projects.getByCategory, { category: "app" });
  const convexWebsites = useQuery(api.projects.getByCategory, {
    category: "website",
  });
  const appProjects = convexApps?.length ? convexApps : FALLBACK_APPS;
  const clientProjects = convexWebsites?.length
    ? convexWebsites
    : FALLBACK_WEBSITES;
  const appsHeader = appsConvex ?? getPageHeader("/projects/apps");
  const websitesHeader = websitesConvex ?? getPageHeader("/projects/websites");

  return (
    <>
      <PageIntro header={activeTab === "apps" ? appsHeader : websitesHeader} />
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "apps" | "clients")}
        className={styles.projectTabs}
      >
        <TabsList
          variant="pills"
          className={styles.projectTabList}
          aria-label="Project categories"
        >
          <TabsTrigger
            variant="pills"
            value="apps"
            className={styles.projectTab}
          >
            App Projects
          </TabsTrigger>
          <TabsTrigger
            variant="pills"
            value="clients"
            className={styles.projectTab}
          >
            Website Projects
          </TabsTrigger>
        </TabsList>
        <TabsContent value="apps" className={styles.projectTabPanel}>
          <ProjectGridSection projects={appProjects} />
        </TabsContent>
        <TabsContent value="clients" className={styles.projectTabPanel}>
          <ProjectGridSection projects={clientProjects} />
        </TabsContent>
      </Tabs>
    </>
  );
}
