import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import styles from "./coastal.module.css";

export function ProjectPreview({
  title,
  image,
  imageFit = "contain",
  href,
  sizes,
}: {
  title: string;
  image?: string;
  imageFit?: "contain" | "fill" | "cover";
  href?: string;
  sizes: string;
}) {
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
        <span className={styles.browserScreen}>
          {image ? (
            <Image
              src={image}
              alt={`${title} project preview`}
              fill
              sizes={sizes}
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
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={styles.projectImage}
      aria-label={`Explore ${title}`}
    >
      {content}
    </a>
  ) : (
    <div className={styles.projectImage}>{content}</div>
  );
}
