import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { BeachBanner } from "@/components/coastal/beach-banner";
import { Button } from "@/components/ui/button";
import { ProjectCard, type ProjectCardData } from "@/components/coastal/project-card";
import { ProjectPreview } from "@/components/coastal/project-preview";
import { projectPresentation } from "@/data/project-presentation";
import { SocialIcon } from "@/lib/social-icons";
import { projectAddress, projectHref, projectOutboundLinks } from "@/lib/projects";
import { jsonLd, SITE_URL } from "@/lib/structured-data";
import styles from "@/components/coastal/coastal.module.css";

type Project = ProjectCardData & { _id: string; category: string };

const plain = (text: string) => text.replace(/[–—]/g, "-");

// Same widths as the /projects grid, so the browser can reuse cached images.
const CARD_SIZES = "(max-width: 767px) 86vw, (min-width: 1600px) 608px, 41vw";

export default function ProjectDetailPage({ project, projects }: { project: Project; projects: Project[] }) {
  const presentation = projectPresentation(project);
  const title = plain(presentation.title);
  const address = projectAddress(project);
  const links = projectOutboundLinks(project);
  // Same kind first (apps with apps), keeping the admin's order within each.
  const others = projects
    .filter((item) => item._id !== project._id)
    .sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category));
  const image = presentation.image;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: presentation.description,
    url: `${SITE_URL}${projectHref(project)}`,
    ...(image && { image: image.startsWith("http") ? image : `${SITE_URL}${image}` }),
    ...(links.length > 0 && { sameAs: links.map((link) => link.href) }),
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Chris Lane Jones", url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <header className={styles.pageIntro}>
        <BeachBanner>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/projects">Projects</Link>
          </nav>
          <h1>{title}</h1>
          <p>
            {project.category === "app" ? "App project" : "Website project"}
            {address ? ` · ${address}` : ""}
          </p>
        </BeachBanner>
      </header>
      <article className={styles.projectDetail}>
        <ProjectPreview
          title={title}
          image={image}
          imageFit={presentation.imageFit}
          imageAspectRatio={presentation.imageAspectRatio}
          address={address}
          sizes="(max-width: 767px) 90vw, 55vw"
          priority
        />
        <div className={styles.projectDetailCopy}>
          <h2>About the project</h2>
          <p>{plain(presentation.description)}</p>
          {(project.features ?? []).length > 0 && (
            <ul className={styles.projectFeatures}>
              {project.features!.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" />
                  <span>{plain(feature)}</span>
                </li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <div className={styles.projectLinks}>
              {links.map((link) => {
                const anchor = (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link.key === "site" ? undefined : styles.textLink}
                    aria-label={link.key === "site" ? `Visit ${title} (opens in a new tab)` : `${title} on ${link.label} (opens in a new tab)`}
                  >
                    {link.key !== "site" && <SocialIcon iconKey={link.key} size={18} />}
                    {link.label}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                );
                return link.key === "site" ? (
                  <Button key={link.key} asChild variant="pill" size="lg">
                    {anchor}
                  </Button>
                ) : (
                  anchor
                );
              })}
            </div>
          )}
        </div>
      </article>
      {others.length > 0 && (
        <section className={styles.moreProjects} aria-labelledby="more-projects-title">
          <h2 id="more-projects-title">More projects.</h2>
          <div className={styles.archiveGrid}>
            {others.map((item, index) => (
              <ProjectCard key={item._id} project={item} heading="h3" sizes={CARD_SIZES} delay={(index % 2) * 0.04} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
