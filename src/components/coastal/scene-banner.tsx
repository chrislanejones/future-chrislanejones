import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./reveal";
import { SceneLoop, type LoopScene } from "./scene-loop";
import styles from "./scene-banner.module.css";

type BannerScene = LoopScene & { focus: string };

/*
 * Each page's view of the St. Augustine Beach 3D world (~/repo/3d-world), as a
 * day and a night still with a seamless loop of each. Camera notes:
 * docs/handoffs/2026-10-15-page-banner-scenes.md.
 */
export const BANNER_SCENES: Record<string, BannerScene> = {
  "/about": {
    focus: "62% 62%",
    day: { still: "/banners/about-day.webp", video: "/banners/about-day.mp4", alt: "A 3D model of the El Castillo resort hotel on 9th Street, palms and beach houses leading down to the ocean and a fishing boat offshore at sunrise",
      blur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAkAAoBCJZQCdAEOes9QpAAA/I/7ZofJ6MYKVW90hr2mSw3iVb4kF13UIs+PgqocRVAJHnMKoThEuHQiAAAA" },
    night: { still: "/banners/about-night.webp", video: "/banners/about-night.mp4", alt: "A 3D model of the El Castillo resort hotel on 9th Street, palms and beach houses leading down to the ocean and a fishing boat offshore at night, windows lit",
      blur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAkAAoBCJYwCdADcXadFyoAA/vpvG9Aab/uWKDh+w/9HRk+HgwkYnOogNjCBQS1Qxk9/tmYRQHmLYEPesz0AAAA=" },
  },
  "/browser-tabs": {
    focus: "55% 65%",
    day: { still: "/banners/browser-tabs-day.webp", video: "/banners/browser-tabs-day.mp4", alt: "A 3D model of Ethel's Filling Station, a green-trimmed diner with vintage gas pumps and an Eat Here sign at sunset",
      blur: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAkAAoBCJYwC7AYp5a5FgOAA/ccRQHCIxfJKAPc5Dsk1ZPaXDXBVLTibHZGbyrA/i9ZNzCLtGdVSS1DmM557zZO7CMwSFT9EAAAA" },
    night: { still: "/banners/browser-tabs-night.webp", video: "/banners/browser-tabs-night.mp4", alt: "A 3D model of Ethel's Filling Station, a green-trimmed diner with vintage gas pumps and an Eat Here sign at night, windows lit",
      blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAkAAoBCJYwCdADv3FVkAAD++dqzyuewnSpEf3oF21BVN8j5wlcuHr8vICSOStdeVIdRuCc/guOUjSclx3NnlagAAA==" },
  },
  "/contact": {
    focus: "68% 55%",
    day: { still: "/banners/contact-day.webp", video: "/banners/contact-day.mp4", alt: "A 3D model of a quiet St. Augustine Beach neighborhood under live oaks, cottages and the 11th Street sign, the hotels by the beach beyond at sunset",
      blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAkAAoBCJZQC7AEO9VbggkAAzfP4/TGeRSq0rlHIvT1lJ54QttqvSqZ/CEcX3EfpnHLivrmu6/WNCKvbO+cDWsQAAA==" },
    night: { still: "/banners/contact-night.webp", video: "/banners/contact-night.mp4", alt: "A 3D model of a quiet St. Augustine Beach neighborhood under live oaks, cottages and the 11th Street sign, the hotels by the beach beyond at night, windows lit",
      blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAkAAoBCJYwCdAEOQT5OgAD++vjY71J8Kp1aaiU5KYmqmnfozg/a/Yfa/n0EuNbghwqgkbOSszQA" },
  },
  "/blog": {
    focus: "68% 70%",
    day: { still: "/banners/blog-day.webp", video: "/banners/blog-day.mp4", alt: "A 3D model of a fishing boat off St. Augustine Beach, a fisherman aboard, the hotels and palms of the shore behind at sunset",
      blur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQAAkAAoBCJZgCdAD0SRcseAD+8+hC/PLxbpwmGgngk44ABHvNBap943d9/NhKjl8ymt+VHv8EJLVhJPYohAAA" },
    night: { still: "/banners/blog-night.webp", video: "/banners/blog-night.mp4", alt: "A 3D model of a fishing boat off St. Augustine Beach, a fisherman aboard, the hotels and palms of the shore behind at night, windows lit",
      blur: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAkAAoBCJQBOgCHgP3pgAAD++dZdG2uXXZuOYTkYrELrHnrQyka9biMLfAAA" },
  },
  "/conferences": {
    focus: "75% 55%",
    day: { still: "/banners/conferences-day.webp", video: "/banners/conferences-day.mp4", alt: "A 3D model of the St. Augustine Beach pier reaching into the Atlantic at sunset",
      blur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAkAAoBCJZgCsAEUov5jgzgA+p/5vBk125haQUsTwACul/9w/Dr64WKEJ6HqlUSeYNzfsTTo2sd44ecPf+J5UAA=" },
    night: { still: "/banners/conferences-night.webp", video: "/banners/conferences-night.mp4", alt: "A 3D model of the St. Augustine Beach pier reaching into the Atlantic at night, windows lit",
      blur: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABwAQCdASoQAAkAAoBCJYgCdAF1AAD+9vTyTNqPe/v3yXz6fRBugKWCw443DIUlhftpTlP0svVe+KeAZDPgxd8SO2QAAA==" },
  },
  "/career-and-resume": {
    focus: "68% 50%",
    day: { still: "/banners/career-and-resume-day.webp", video: "/banners/career-and-resume-day.mp4", alt: "A 3D model of a beachfront resort beside the St. Augustine Beach pier, a sailboat offshore and volleyball courts on the sand at sunset",
      blur: "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAkAAoBCJZwCdAEO4/d3LAAA/uev7aQ62xpacC6RJqsI5tD+Y6a5Sj6/0zNW5W/jtqyMExHFYp0wM/HdgYDzm0mgxoaAAAA=" },
    night: { still: "/banners/career-and-resume-night.webp", video: "/banners/career-and-resume-night.mp4", alt: "A 3D model of a beachfront resort beside the St. Augustine Beach pier, a sailboat offshore and volleyball courts on the sand at night, windows lit",
      blur: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAkAAoBCJQBOgCHamMY+wAD++m9nFZ1daKaSoAts0JXxU7/eXScRQVAU5U4Xg7ePiIRbGAA=" },
  },
  "/projects": {
    focus: "62% 50%",
    day: { still: "/banners/projects-day.webp", video: "/banners/projects-day.mp4", alt: "A 3D model of a fishing boat off St. Augustine Beach, the hotels, beach houses and dunes along the shore behind it at sunset",
      blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoQAAkAAoBCJZgCdAEOxOlQ4kAA/tUVNIWuKRY9ACEg2b5IsuyfSfbDQ8IqfN1BwdjmEYtWEk9iTAAA" },
    night: { still: "/banners/projects-night.webp", video: "/banners/projects-night.mp4", alt: "A 3D model of a fishing boat off St. Augustine Beach, the hotels, beach houses and dunes along the shore behind it at night, windows lit",
      blur: "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAACwAQCdASoQAAkAAoBCJQBOgCHYnXSIAP74gvluxpStkfeXEuTRA0XSwhaNrYKb8eAAAA==" },
  },
  "/site-history": {
    focus: "72% 50%",
    day: { still: "/banners/site-history-day.webp", video: "/banners/site-history-day.mp4", alt: "A 3D model of St. Augustine Beach from the air, its streets running along the ocean in the afternoon",
      blur: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoQAAkAAoBCJYwCdAEKRI6V6wRwAP55PxphV4hEzK8fioae42yZX5IL3SYwY3krewc7PJZWB4cNtAs+VAAXpyiafWzwnGh5yYxzAAAA" },
    night: { still: "/banners/site-history-night.webp", video: "/banners/site-history-night.mp4", alt: "A 3D model of St. Augustine Beach from the air, its streets running along the ocean at night, windows lit",
      blur: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoQAAkAAoBCJZQCdAEUqo4csbswAP776Idb3n6k/iSEwXyEtERQVDQIIpoitKvrZ1ozsAAA" },
  },
  "/site-map": {
    focus: "68% 50%",
    day: { still: "/banners/site-map-day.webp", video: "/banners/site-map-day.mp4", alt: "A 3D model of a top-down map of the St. Augustine Beach streets, beach and ocean at midday",
      blur: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACwAQCdASoQAAkAAoBCJQBOgBjsndp4AP4VKtckqvoUY3x19aZz29q7UNYCdGTt6Mp1qPO55x+bd6aWAAA=" },
    night: { still: "/banners/site-map-night.webp", video: "/banners/site-map-night.mp4", alt: "A 3D model of a top-down map of the St. Augustine Beach streets, beach and ocean at night, windows lit",
      blur: "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAkAAoBCJYwCdAEO+LuSgAD+/EkxQ94RIgoWrAz8diLsuUAAAA==" },
  },
  "/react-maintenance": {
    focus: "66% 60%",
    day: { still: "/banners/react-maintenance-day.webp", video: "/banners/react-maintenance-day.mp4", alt: "A 3D model of a fishing boat on calm water, the St. Augustine Beach pier on the horizon at sunrise",
      blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACwAQCdASoQAAkAAoBCJZACdAEOum84AP7x60yo+CiZFdlB6iBsUIQvo1sHzoQ1csEEPWdZYwKv4FuWzd17rgAA" },
    night: { still: "/banners/react-maintenance-night.webp", video: "/banners/react-maintenance-night.mp4", alt: "A 3D model of a fishing boat on calm water, the St. Augustine Beach pier on the horizon at night, windows lit",
      blur: "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAABwAQCdASoQAAkAAoBCJYgCdAFAAAD+9ssqDe/dgIQ+Vh+QTM7gQ5HYQ3Ycsjw1aToAAA==" },
  },
  "/wordpress-maintenance": {
    focus: "55% 60%",
    day: { still: "/banners/wordpress-maintenance-day.webp", video: "/banners/wordpress-maintenance-day.mp4", alt: "A 3D model of 9th Street at St. Augustine Beach, palms, signs and the ocean at the end of the road at sunset",
      blur: "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoQAAkAAoBCJZQCdAEWxtZKYAD+8SKgNesCFgZfGYC49jCHLTx1Gy1M6l36LoEpq5AdCdIc6bIeVf/QTrlYfnzKDlDclX9RXNb7rZ8DCAE/CX1AAAA=" },
    night: { still: "/banners/wordpress-maintenance-night.webp", video: "/banners/wordpress-maintenance-night.mp4", alt: "A 3D model of 9th Street at St. Augustine Beach, palms, signs and the ocean at the end of the road at night, windows lit",
      blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAQCdASoQAAkAAoBCJYwCdAD2PSfggAD++KqJcAt8SBfZ6ibgf+GYd2iAibH5pbAVPaaKjv3kMa2txwui83kuHEe2oWT2SJ/ZAAAA" },
  },
  "/logo-page": {
    focus: "60% 55%",
    day: { still: "/banners/logo-page-day.webp", video: "/banners/logo-page-day.mp4", alt: "A 3D model of the beach at St. Augustine, beachgoers on the sand below the hotels and dunes at sunset",
      blur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAkAAoBCJZgCsAEO5MQoroAA/ryfsnxVDZ2dOXepiY55/ts8OeXanDAGVHfOP4GBw8ph6K9y3niV17EmAAAA" },
    night: { still: "/banners/logo-page-night.webp", video: "/banners/logo-page-night.mp4", alt: "A 3D model of the beach at St. Augustine, beachgoers on the sand below the hotels and dunes at night, windows lit",
      blur: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAkAAoBCJYgCdAEPAx2k0AD++mk+lJuL9fC570GBCqVG9ZDrbvuOSEDk9+fUbm01Yj24AAA=" },
  },
  "/admin-showcase": {
    focus: "75% 70%",
    day: { still: "/banners/admin-showcase-day.webp", video: "/banners/admin-showcase-day.mp4", alt: "A 3D model of the El Castillo resort hotel above the Atlantic at sunset",
      blur: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAQCdASoQAAkAAoBCJZQCdAEOqPP/AAD+8f5NLSUQavTkY+yVZojz8idUsUXe3gK7JfWKAnR3MLvSXNHU2HWwBpWBVIirriwAHPp9uwNG/AAA" },
    night: { still: "/banners/admin-showcase-night.webp", video: "/banners/admin-showcase-night.mp4", alt: "A 3D model of the El Castillo resort hotel above the Atlantic at night, windows lit",
      blur: "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoQAAkAAoBCJQBOgCHfPL2oAP75xiiE4v6Rz+K11AZVM9k+7goAPaVAmxwxTu9EWxgAAA==" },
  },
};

export function SceneBanner({ scene, children }: { scene: BannerScene; children?: ReactNode }) {
  return (
    <div className={styles.view} style={{ "--scene-focus": scene.focus } as CSSProperties}>
      <SceneLoop scene={scene} sizes="(max-width: 1400px) 94vw, 1360px" className={styles.photo} />
      <div className={styles.shade} aria-hidden="true" />
      <Reveal className={styles.content}>{children}</Reveal>
    </div>
  );
}
