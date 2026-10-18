import styles from "./coastal.module.css";
import { SceneLoop, type LoopScene } from "./scene-loop";

/*
 * The St. Augustine Beach 3D world (~/repo/3d-world) from the hero's own
 * camera: a day loop in light mode, a night loop in dark mode. Camera notes:
 * docs/handoffs/2026-10-15-page-banner-scenes.md.
 */
const HOME: LoopScene = {
  day: {
    still: "/hero/coast-day.webp",
    video: "/hero/coast-day.mp4",
    alt: "A 3D model of the St. Augustine Beach shoreline at sunrise, pastel houses and dune walkovers along the sand, the pier and a sailboat beyond",
  },
  night: {
    still: "/hero/coast-night.webp",
    video: "/hero/coast-night.mp4",
    alt: "A 3D model of the St. Augustine Beach shoreline at night, windows lit in the houses along the dunes beside the dark Atlantic",
  },
};

export function HeroPhoto() {
  return (
    <div className={styles.heroVisual}>
      <SceneLoop scene={HOME} sizes="(max-width: 1440px) 100vw, 1400px" className={styles.heroPoster} preloadBoth />
    </div>
  );
}
