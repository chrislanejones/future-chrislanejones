import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./coastal.module.css";

// The browser-window screenshot on sand. With `href` it's the card's link to
// the project's own page; without it (the detail page hero) it's just media.
export function ProjectPreview({
  title,
  image,
  imageFit = "contain",
  imageAspectRatio,
  href,
  address,
  sizes,
  priority = false,
}: {
  title: string;
  image?: string;
  imageFit?: "contain" | "fill" | "cover";
  imageAspectRatio?: number;
  href?: string;
  /** Host shown in the fake address bar, e.g. "getalembic.com". */
  address?: string;
  sizes: string;
  /** Only for the first card in view: fetch it early instead of lazily. */
  priority?: boolean;
}) {
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
          <span className={styles.browserAddress}>{address ?? "Project preview"}</span>
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
  return href ? (
    <Link href={href} className={styles.projectImage} aria-label={`Explore ${title}`}>
      {content}
    </Link>
  ) : (
    <div className={styles.projectImage}>{content}</div>
  );
}
