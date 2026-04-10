import type { Transition, Variants } from "framer-motion";

// ─── Spring presets ────────────────────────────────────────────────────────────

/** Swift spring — matches the home page card feel */
export const springSwift: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
};

/** Gentle spring — for larger/heavier elements */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

// ─── Shared card entry variant ─────────────────────────────────────────────────

/** Standard card fade-up used on home page and site-history */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springSwift, delay },
  }),
};

/** Inline-element fade-up (links, small blocks) */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut", delay },
  }),
};

/** Slider/carousel item transition — smooth ease with directional movement */
export const sliderTransition: Transition = {
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1],
};

// ─── Viewport defaults ─────────────────────────────────────────────────────────

/** Use for whileInView — fires a bit early so it never looks late */
export const viewport = { once: true, margin: "-50px" } as const;
