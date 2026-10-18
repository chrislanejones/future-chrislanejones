"use client";

import { useState } from "react";
import { preload } from "react-dom";
import { ProjectCard, type ProjectCardData } from "@/components/coastal/project-card";
import { PageIntro } from "@/components/coastal/page-intro";
import styles from "@/components/coastal/coastal.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPageHeader } from "@/lib/page-headers";
import { useQuery } from "convex/react";
import { projects as fallbackProjects } from "@/data/projects-data";
import { api } from "../../../convex/_generated/api";

// Keep the archive and homepage fallbacks on the same complete catalog.
const FALLBACK_APPS: ProjectCardData[] = fallbackProjects.filter((project) => project.category === "app");
const FALLBACK_WEBSITES: ProjectCardData[] = fallbackProjects.filter((project) => project.category === "website");

// Measured preview widths: ~86vw in the one-column layout, ~41vw in two
// columns, capped at 608px once the container stops growing (1600px+).
const PREVIEW_SIZES = "(max-width: 767px) 86vw, (min-width: 1600px) 608px, 41vw";

/* ------------------------------- Components ------------------------------- */

function ProjectGridSection({ projects }: { projects: (ProjectCardData & { _id?: string })[] }) {
  return (
    <section className={styles.archiveGrid} aria-label="Projects grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id ?? project.title}
          project={project}
          sizes={PREVIEW_SIZES}
          priority={index === 0}
          showFeatures
          delay={index * 0.04}
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
      <PageIntro header={activeTab === "apps" ? appsHeader : websitesHeader} path="/projects" />
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
