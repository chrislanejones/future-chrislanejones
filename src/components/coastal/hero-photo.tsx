import Image from "next/image";
import styles from "./coastal.module.css";

/*
 * Stills of the St. Augustine Beach 3D world (~/repo/3d-world), shot from the
 * hero's own camera: light at mid-afternoon, dark at dusk as the windows light up.
 * They replace the site's older live copy of the town, which no longer matches
 * the world. Camera notes: docs/handoffs/2026-10-15-page-banner-scenes.md.
 */
export function HeroPhoto() {
  return (
    <div className={styles.heroVisual} data-hero-renderer="photo">
      <Image
        src="/hero/coast-light.webp"
        alt="A 3D model of the St. Augustine Beach coast, with pastel houses, hotels, dunes, beachgoers and a fishing boat on the Atlantic"
        fill quality={75} sizes="(max-width: 1440px) 100vw, 1400px"
        loading="eager" fetchPriority="high" className={`${styles.heroPoster} ${styles.heroPosterLight}`}
      />
      <Image
        src="/hero/coast-dark.webp"
        alt="A 3D model of the St. Augustine Beach coast at dusk, windows lighting up along the streets beside the Atlantic"
        fill quality={75} sizes="(max-width: 1440px) 100vw, 1400px"
        loading="eager" fetchPriority="high" className={`${styles.heroPoster} ${styles.heroPosterDark}`}
      />
    </div>
  );
}
