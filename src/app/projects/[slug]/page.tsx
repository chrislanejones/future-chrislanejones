import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import { projectPresentation } from "@/data/project-presentation";
import { projectHref, projectSlug } from "@/lib/projects";
import { getProjects } from "@/lib/projects-server";
import { DEFAULT_OG_IMAGE, metaDescription } from "@/lib/seo";
import { SITE_URL } from "@/lib/structured-data";
import ProjectDetailPage from "./ProjectDetailPage";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

// Prerender every known project; new ones render on demand and then cache.
export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: projectSlug(project.title) }));
}

async function findProject(slug: string) {
  return (await getProjects()).find((project) => projectSlug(project.title) === slug);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) notFound();
  const presentation = projectPresentation(project);
  const title = presentation.title;
  const description = metaDescription(presentation.description);
  const url = `${SITE_URL}${projectHref(project)}`;
  // Social crawlers need absolute image URLs.
  const image = presentation.image ?? DEFAULT_OG_IMAGE;
  const images = [{ url: image.startsWith("http") ? image : `${SITE_URL}${image}`, alt: title }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ProjectRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => projectSlug(item.title) === slug);
  if (!project) notFound();
  return (
    <CoastalPageShell>
      <ProjectDetailPage project={project} projects={projects} />
    </CoastalPageShell>
  );
}
