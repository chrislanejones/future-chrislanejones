import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { ProjectPreview } from "./project-preview";
import { Reveal } from "./reveal";
import styles from "./coastal.module.css";
import { projectPresentation } from "@/data/project-presentation";
import { projectAddress, projectHref } from "@/lib/projects";

export type ProjectCardData = {
  title: string;
  description: string;
  features?: string[];
  image?: string;
  githubUrl?: string;
  codebergUrl?: string;
  vercelUrl?: string;
  customUrl?: string;
};

const plain = (text: string) => text.replace(/[–—]/g, "-");

// The one project card: home page, /projects and "More projects" on each
// project page. Every link on it goes to the project's own page; the live
// site and repositories are linked from there, not from the card.
export function ProjectCard({
  project,
  variant = "standard",
  heading: Heading = "h2",
  sizes,
  priority = false,
  showFeatures = false,
  delay = 0,
}: {
  project: ProjectCardData;
  /** primary/secondary: the home page's large and stacked cards. standard: grids. */
  variant?: "primary" | "secondary" | "standard";
  heading?: "h2" | "h3";
  sizes: string;
  priority?: boolean;
  showFeatures?: boolean;
  delay?: number;
}) {
  const presentation = projectPresentation(project);
  const title = plain(presentation.title);
  const href = projectHref(project);
  const features = showFeatures ? (project.features ?? []).slice(0, 5) : [];

  return (
    <Reveal
      className={
        variant === "primary" ? styles.primaryProject : variant === "secondary" ? styles.secondaryProject : undefined
      }
      delay={delay}
    >
      <article className={variant === "standard" ? styles.archiveProject : styles.project}>
        <ProjectPreview
          title={title}
          image={presentation.image}
          imageFit={presentation.imageFit}
          imageAspectRatio={presentation.imageAspectRatio}
          href={href}
          address={projectAddress(project)}
          sizes={sizes}
          priority={priority}
        />
        <div className={variant === "standard" ? styles.archiveProjectInfo : styles.projectInfo}>
          <Heading>
            <Link href={href}>{title}</Link>
          </Heading>
          <p>{plain(presentation.description)}</p>
          {features.length > 0 && (
            <ul className={styles.projectFeatures}>
              {features.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" />
                  <span>{plain(feature)}</span>
                </li>
              ))}
            </ul>
          )}
          {variant !== "secondary" && (
            <div className={styles.projectLinks}>
              <Link href={href} className={styles.textLink} aria-label={`Explore ${title}`}>
                Explore project <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </article>
    </Reveal>
  );
}
