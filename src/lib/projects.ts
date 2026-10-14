// Shared project URLs and outbound links. Every card, the detail route, the
// sitemap and llms.txt build project URLs here, so they can't drift apart.
import { isImageHorseApp, projectPresentation } from "@/data/project-presentation";

type ProjectLinks = {
  title: string;
  description: string;
  image?: string;
  githubUrl?: string;
  codebergUrl?: string;
  vercelUrl?: string;
  customUrl?: string;
};

const isUrl = (url: string | undefined): url is string =>
  typeof url === "string" && /^https?:\/\/\S+$/.test(url.trim());

// "Web Crawler (Golang)" -> "web-crawler-golang". Derived from the title, so
// renaming a project in the admin changes its URL.
export function projectSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function projectHref(project: Pick<ProjectLinks, "title">): string {
  return `/projects/${projectSlug(project.title)}`;
}

// The live site, never a repository. The Image Horse app's CMS entry predates
// its own domain, so its presentation override supplies the URL.
export function projectSiteUrl(project: ProjectLinks): string | undefined {
  const candidates = isImageHorseApp(project)
    ? [projectPresentation(project).href]
    : [project.customUrl, project.vercelUrl];
  return candidates.find(isUrl);
}

// Outbound links for the detail page, in display order.
export function projectOutboundLinks(project: ProjectLinks) {
  return [
    { key: "site", label: "Visit site", href: projectSiteUrl(project) },
    { key: "github", label: "GitHub", href: project.githubUrl },
    { key: "codeberg", label: "Codeberg", href: project.codebergUrl },
  ].filter((link): link is { key: string; label: string; href: string } => isUrl(link.href));
}

// Host shown in the preview's address bar, e.g. "getalembic.com".
export function projectAddress(project: ProjectLinks): string | undefined {
  const url = projectSiteUrl(project) ?? [project.githubUrl, project.codebergUrl].find(isUrl);
  return url?.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
