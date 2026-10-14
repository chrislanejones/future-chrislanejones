import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SocialIcon } from "@/lib/social-icons";
import styles from "./coastal.module.css";

export function ProjectPreview({
  title,
  image,
  imageFit = "contain",
  imageAspectRatio,
  href,
  sizes,
  priority = false,
  githubUrl,
  codebergUrl,
}: {
  title: string;
  image?: string;
  imageFit?: "contain" | "fill" | "cover";
  imageAspectRatio?: number;
  href?: string;
  sizes: string;
  /** Only for the first card in view: fetch it early instead of lazily. */
  priority?: boolean;
  githubUrl?: string;
  codebergUrl?: string;
}) {
  const repos = [
    { key: "github", label: "GitHub", url: githubUrl },
    { key: "codeberg", label: "Codeberg", url: codebergUrl },
  ].filter((repo) => repo.url && /^https?:\/\//.test(repo.url) && repo.url !== href);
  const external = /^https?:\/\//.test(href ?? "");
  const content = (
    <>
      <span className={styles.projectSand} aria-hidden="true" />
      <span className={styles.browserWindow}>
        <span className={styles.browserToolbar} aria-hidden="true">
          <span className={styles.browserControls}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.browserAddress}>
            {external
              ? href!.replace(/^https?:\/\//, "").replace(/\/$/, "")
              : "Project preview"}
          </span>
        </span>
        <span className={styles.browserScreen} style={{ aspectRatio: imageAspectRatio }}>
          {image ? (
            <Image
              src={image}
              alt={`${title} project preview`}
              fill
              sizes={sizes}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              className={styles.previewImage}
              style={{
                objectFit: imageFit,
                objectPosition: imageFit === "cover" ? "center top" : "center",
              }}
            />
          ) : (
            <span className={styles.noPreview}>Explore {title}</span>
          )}
        </span>
      </span>
      {href && (
        <span className={styles.imageAction}>
          <ArrowUpRight size={24} aria-hidden="true" />
        </span>
      )}
    </>
  );
  const card = href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={styles.projectImage}
      aria-label={external ? `Explore ${title} at ${href!.replace(/^https?:\/\//, "").replace(/\/$/, "")}` : `Explore ${title}`}
    >
      {content}
    </a>
  ) : (
    <div className={styles.projectImage}>{content}</div>
  );
  if (!repos.length) return card;
  // Repo buttons sit beside the card's arrow but outside its link, so they're real links of their own.
  return (
    <div className={styles.projectImageWrap}>
      {card}
      <div className={`${styles.repoActions} ${href ? "" : styles.repoActionsAlone}`}>
        {repos.map((repo) => (
          <a key={repo.key} href={repo.url} target="_blank" rel="noopener noreferrer" aria-label={`${title} on ${repo.label}`} title={repo.label}>
            <SocialIcon iconKey={repo.key} size={19} />
          </a>
        ))}
      </div>
    </div>
  );
}
