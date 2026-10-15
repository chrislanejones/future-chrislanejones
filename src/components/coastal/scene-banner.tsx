import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./reveal";
import styles from "./scene-banner.module.css";

type Scene = { src: string; alt: string; focus: string; blur: string };

/*
 * Stills captured from the St. Augustine Beach 3D world (~/repo/3d-world).
 * Like the home hero's poster they load eager and first; a 16x9 blur stands in
 * until they arrive. Camera notes: docs/handoffs/2026-10-15-page-banner-scenes.md.
 */
export const BANNER_SCENES: Record<string, Scene> = {
  "/about": {
    src: "/banners/about.webp",
    alt: "A 3D model of St. Augustine Beach at sunset: the El Castillo resort hotel among palms, the pier up the coast and a fishing boat offshore",
    focus: "62% 62%",
    blur: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAQCdASoQAAkAAoBCJZQCdAEOqPP/AAD+8f5OOgjQsuTyyUiUOvjIe196P/YDNFHjJ0EWrdQQon8+F9bjPIBxYJKDzMBt86cNq4ifHKi48RoAAAA=",
  },
  "/browser-tabs": {
    src: "/banners/browser-tabs.webp",
    alt: "A 3D model of Ethel's Filling Station at sunset, a green-trimmed diner with vintage gas pumps and an Eat Here sign",
    focus: "55% 65%",
    blur: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoQAAkAAoBCJYwAD4TtWHa/UoAA/ccRQ8+/Bma6QHuch2SJol3/5JOae9YfPSJzKSTrnvMgbRKe7pLV5B513V1PLcTyg4aQDpiAAA==",
  },
  "/contact": {
    src: "/banners/contact.webp",
    alt: "A 3D model of a quiet St. Augustine Beach street at sunrise, palms and cottages leading down to the ocean",
    focus: "68% 55%",
    blur: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoQAAkAAoBCJQBdgMWWyZ2vPQAA/vinx/eVJiq+/j+zCqsj6XvJoIt8hUk4iUvVVPg39SgF7CAlYThEYqbWPg27yOL5JX2CBgAAAA==",
  },
  "/blog": {
    src: "/banners/blog.webp",
    alt: "A 3D fishing boat off St. Augustine Beach at sunset, a fisherman aboard, the hotels and palms of the shore behind",
    focus: "68% 70%",
    blur: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAkAAoBCJaACdAEO5FwdEAD+8fbvshjg0c9Km25/wRot0C8epb5/lrziCJ87Nbii2G5drYSJlr++jQAAAA==",
  },
  "/conferences": {
    src: "/banners/conferences.webp",
    alt: "A 3D aerial of the St. Augustine Beach pier reaching into the Atlantic at sunset",
    focus: "75% 55%",
    blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAkAAoBCJZgCsAEUov5je8AA+p/5vB1drnkz0Y9byO8Dp3u3bCfXCxF+ez7juziTzdqJcg57Kja8ksRSDFD6ddQAAA==",
  },
  "/career-and-resume": {
    src: "/banners/career-and-resume.webp",
    alt: "A 3D view from a boat toward the St. Augustine Beach shore, hotels and palms above the sand at sunset",
    focus: "68% 50%",
    blur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAwAgCdASoQAAkAAoBCJZgCdH8AGLXKmxUpgAD+88jri7IJFpH2k6K48qZziztohVyCU78ZxbySwAGvIuT1fPlcJfTvzAAA",
  },
  "/projects": {
    src: "/banners/projects.webp",
    alt: "A 3D aerial of the St. Augustine Beach town, its streets, hotels and pier along the Atlantic",
    focus: "62% 50%",
    blur: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoQAAkAAoBCJQBOgCHhsXS4kw8AAP7GB700ITYkW9GRmo8/XZjijhcMPo6IB3Gmd4h09jSfpbJwPyAnLfMxLzFgbtiXesjrMAAAAA==",
  },
  "/site-history": {
    src: "/banners/site-history.webp",
    alt: "A 3D aerial of St. Augustine Beach at night, windows and streetlights lit beside the dark ocean",
    focus: "72% 50%",
    blur: "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAAAQAgCdASoQAAkAAoBCJZQCdAEVV2KkceIAAP777kOsT7vb+CHLSfpdMjKFQPGu6WAAAA==",
  },
  "/site-map": {
    src: "/banners/site-map.webp",
    alt: "A 3D top-down map of the St. Augustine Beach streets, beach and ocean",
    focus: "68% 50%",
    blur: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACwAQCdASoQAAkAAoBCJQBOgBh2IItwAP4VKtckqvoUY3x19D6w2xf6Uf2FBuUcWCSvyiKJ1o5ZcnQ8AAA=",
  },
  "/react-maintenance": {
    src: "/banners/react-maintenance.webp",
    alt: "A 3D fishing boat on calm water at sunrise, the St. Augustine Beach pier on the horizon",
    focus: "66% 60%",
    blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAkAAoBCJZACdAERBPtAAAD+8hANbq4pDoHILxk4u1rAjtoNN7q6IOH4WT/s5NkAw4lj4pm6YAAA",
  },
  "/wordpress-maintenance": {
    src: "/banners/wordpress-maintenance.webp",
    alt: "A 3D street-level view of 9th Street at St. Augustine Beach, palms, signs and the ocean at the end of the road",
    focus: "55% 60%",
    blur: "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQAgCdASoQAAkAAoBCJZQCdAYvXqovc8bAAP7xIqA1r1SzNvW2ngGx+BGtM8xd6/EsCcO8l6X5dJUREp7vzkqDzVF75+FhMuwKIaNKrvBEEi3ARQdzQN5AAAA=",
  },
  "/logo-page": {
    src: "/banners/logo-page.webp",
    alt: "A 3D view along St. Augustine Beach at sunset, beachgoers on the sand below the hotels and dunes",
    focus: "60% 55%",
    blur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQAAkAAoBCJZgCsAEOPB4sAAD+vJ+yfFUNnZ05d6mJjnn+NvR7l2pwwA15Tf+0gHyCT9bN/Km+3EUkGVvsSYAA",
  },
  "/admin-showcase": {
    src: "/banners/admin-showcase.webp",
    alt: "A 3D view of the El Castillo resort hotel at night, its windows lit above the dark Atlantic",
    focus: "75% 70%",
    blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoQAAkAAoBCJZQCdADp7yVTUAAA/vhkgKhydTo1mNmZ9JbOLXbNSoKLHWg0SSjAhlM/ilGRq6VcuxoA",
  },
};

export function SceneBanner({ scene, children }: { scene: Scene; children?: ReactNode }) {
  return (
    <div className={styles.view} style={{ "--scene-focus": scene.focus } as CSSProperties}>
      <Image src={scene.src} alt={scene.alt} fill quality={75}
        sizes="(max-width: 1400px) 94vw, 1360px" loading="eager" fetchPriority="high"
        placeholder="blur" blurDataURL={scene.blur} className={styles.photo} />
      <div className={styles.shade} aria-hidden="true" />
      <Reveal className={styles.content}>{children}</Reveal>
    </div>
  );
}
