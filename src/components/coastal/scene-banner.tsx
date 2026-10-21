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
    focus: "75% 50%",
    day: { still: "/banners/about-day.webp", video: "/banners/about-day.mp4", alt: "A 3D model of St. Augustine Beach from straight above, the pier reaching into the Atlantic past the dune walkovers, beachgoers on the sand and a fishing boat offshore in the early morning",
      blur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoQAAkAAoBCJaACdGuAAt4Ra1/wAP225iR4la8na1m4TawehnUdXl50cgr2XZf0ydMP6FEJwR+pVfOk4f+VOZAA" },
    night: { still: "/banners/about-night.webp", video: "/banners/about-night.mp4", alt: "A 3D model of St. Augustine Beach from straight above, the pier reaching into the Atlantic past the dune walkovers, beachgoers on the sand and a fishing boat offshore at night, windows lit",
      blur: "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAkAAoBCJQBOgCKfAeEI8AD++Gx6UG7GuOdZt3Ykkg5Y3SgdHQpPs5WvigISFlAAAA==" },
  },
  "/browser-tabs": {
    focus: "50% 60%",
    day: { still: "/banners/browser-tabs-day.webp", video: "/banners/browser-tabs-day.mp4", alt: "A 3D model of a rooftop restaurant deck on A1A, diners at picnic tables under teal umbrellas, teal lounge sofas and people leaning on the cable railing, a beach hotel across the street",
      blur: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAABQAgCdASoQAAkAAoBCJZwAD43uL5VmTTbI/AAA/rd5rj4b25zUE5aD1EaQx2sWHBwS/ZvcWp0qyWOxubMrOMBvc0p3f89ALFEc0Dt3JSjI4AljAAA=" },
    night: { still: "/banners/browser-tabs-night.webp", video: "/banners/browser-tabs-night.mp4", alt: "A 3D model of a rooftop restaurant deck on A1A at night, lanterns on the tables and string lights over diners under teal umbrellas, hotel windows lit across the street",
      blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAkAAoBCJYwCdAERB8IgP4AA/vn8ExBWww507ypB93bLtHZb0xxJJwM41Yn7NsafxjXcHnGay16LJwsVl0xcoYAAAA==" },
  },
  "/contact": {
    focus: "60% 60%",
    day: { still: "/banners/contact-day.webp", video: "/banners/contact-day.mp4", alt: "A 3D model of the beach at St. Augustine from above the dunes, a dune walkover, beachgoers on the sand and a fishing boat offshore at sunrise",
      blur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAQCdASoQAAkAAoBCJZQCdAD0LkJsAP7wF34ZbvMXxRn29W+/rH/6bvvieuVfTluiz3xeJb7RONmoUdD9/jo1OzX/p/T/AAA=" },
    night: { still: "/banners/contact-night.webp", video: "/banners/contact-night.mp4", alt: "A 3D model of the beach at St. Augustine from above the dunes, a dune walkover, beachgoers on the sand and a fishing boat offshore under the moon",
      blur: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQAAkAAoBCJQBOgB7HXICAAP76ZXpMcqem1UVgy5vp+rmU51U2GzWYEN4LE6JHuk/mj6Wg7bgAAA==" },
  },
  "/blog": {
    focus: "68% 70%",
    day: { still: "/banners/blog-day.webp", video: "/banners/blog-day.mp4", alt: "A 3D model of St. Augustine Beach seen from the water at dawn, a fishing boat offshore, beachgoers and dune walkovers below the beach houses and hotels under a lavender sky",
      blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAkAAoBCJZACdAEPQ3aEAAD+1Nkx89LrzqPor5tQ3mNjknNAaSxlmukPRhzGa2hT6yLCKbyeJAAA" },
    night: { still: "/banners/blog-night.webp", video: "/banners/blog-night.mp4", alt: "A 3D model of St. Augustine Beach seen from the water at night, a fishing boat offshore, windows lit in the beach houses and hotels under the stars",
      blur: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAkAAoBCJQBOgCHh16BgAAD++mD3yVgx1N11rj294EbVm8ZyhcrjDReXgAAA" },
  },

  "/conferences": {
    focus: "75% 55%",
    day: { still: "/banners/conferences-day.webp", video: "/banners/conferences-day.mp4", alt: "A 3D model of the St. Augustine Beach pier reaching into the Atlantic at sunset",
      blur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAkAAoBCJZgCsAEUov5jgzgA+p/5vBk125haQUsTwACul/9w/Dr64WKEJ6HqlUSeYNzfsTTo2sd44ecPf+J5UAA=" },
    night: { still: "/banners/conferences-night.webp", video: "/banners/conferences-night.mp4", alt: "A 3D model of the St. Augustine Beach pier reaching into the Atlantic at night, windows lit",
      blur: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABwAQCdASoQAAkAAoBCJYgCdAF1AAD+9vTyTNqPe/v3yXz6fRBugKWCw443DIUlhftpTlP0svVe+KeAZDPgxd8SO2QAAA==" },
  },
  "/career-and-resume": {
    focus: "60% 55%",
    day: { still: "/banners/career-and-resume-day.webp", video: "/banners/career-and-resume-day.mp4", alt: "A 3D model of a beachfront resort beside the St. Augustine Beach pier, a sailboat offshore and the beach town along the shore at sunset",
      blur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAkAAoBCJZQCdAEOgjSTcyAA/tUXv1hht0W/P8IJVV8V8g/d5nOslDH97kbLcmkAhV8XBpsUgOj/HVFZWgAA" },
    night: { still: "/banners/career-and-resume-night.webp", video: "/banners/career-and-resume-night.mp4", alt: "A 3D model of a beachfront resort beside the St. Augustine Beach pier, a sailboat offshore and the beach town along the shore at night, windows lit",
      blur: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQAAkAAoBCJQBOgCGgnADgAP76b2cWJSW6t1d/63ACRSh7XCSZaZYgXky8qBBUUjg7ePiIRbGAAA==" },
  },
  "/projects": {
    focus: "50% 62%",
    day: { still: "/banners/projects-day.webp", video: "/banners/projects-day.mp4", alt: "A 3D model of the St. Augustine Beach pier from the water, beachgoers on the sand and the beach town and hotels along the shore at sunrise",
      blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAkAAoBCJZgCdAEOO30oAAD+6yWzl9hefHH6s4NMJVMeiVPDipP0SZL1g5flOuXKp2ZQN16vOZz6iS/Kn083TAAAAA==" },
    night: { still: "/banners/projects-night.webp", video: "/banners/projects-night.mp4", alt: "A 3D model of the St. Augustine Beach pier from the water, beachgoers on the sand and the beach town and hotels along the shore at night, windows lit",
      blur: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAkAAoBCJQBOgCP/5MWHwAD++dgWU1YNC/OF5IUc7P3kFxAviUxxGR1GJwAA" },
  },
  "/site-history": {
    focus: "65% 50%",
    day: { still: "/banners/site-history-day.webp", alt: "A 3D model of St. Augustine Beach from the air, the town, its dune walkovers and the pier running along the Atlantic in the early morning",
      blur: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAQCdASoQAAkAAoBCJQBWACHQBH3D4AD+6soOSNhOh5VFppgnLPLyPAEZ/dwtm3FMNUzH8TT1FLGZmro2V8rEkSSROrIWYGQx6RchREAAAA==" },
    night: { still: "/banners/site-history-night.webp", alt: "A 3D model of St. Augustine Beach from the air, the town, its dune walkovers and the pier running along the Atlantic at night, windows lit",
      blur: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAkAAoBCJQBOgCP7q5RCHwAA/vnJDZP/xGrWd4oTanavWgWc0K+SZuOKcJnzcMUWXqweehAAAA==" },
  },
  "/site-map": {
    focus: "68% 50%",
    day: { still: "/banners/site-map-day.webp", video: "/banners/site-map-day.mp4", alt: "A 3D model of a top-down map of the St. Augustine Beach streets, beach and ocean at midday",
      blur: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACwAQCdASoQAAkAAoBCJQBOgBjsndp4AP4VKtckqvoUY3x19aZz29q7UNYCdGTt6Mp1qPO55x+bd6aWAAA=" },
    night: { still: "/banners/site-map-night.webp", video: "/banners/site-map-night.mp4", alt: "A 3D model of a top-down map of the St. Augustine Beach streets, beach and ocean at night, windows lit",
      blur: "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAkAAoBCJYwCdAEO+LuSgAD+/EkxQ94RIgoWrAz8diLsuUAAAA==" },
  },
  "/react-maintenance": {
    focus: "50% 55%",
    day: { still: "/banners/react-maintenance-day.webp", alt: "A 3D model of St. Augustine Beach through a fisheye lens from high over the town: the hotel, beach houses, the dunes and the beach curving to the pier under a lavender sky",
      blur: "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAkAAoBCJZQCdAEegRHzvEBAAP5hb71fRH03j0gC7stLmzzD8cbO3+VK0dI4ScA81KIyWqKlpbwxLyno2DGiNJFDeiEfoAA=" },
    night: { still: "/banners/react-maintenance-night.webp", alt: "A 3D model of St. Augustine Beach at night through a fisheye lens from high over the town: windows and street lights lit, the dark beach curving to the pier under the stars",
      blur: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAkAAoBCJQBOgCP7qkvJOGAA/vpnK5ujwLyVDE27Q/lafFaBaz6+iriX1hrYgrd/4AAA" },
  },

  "/wordpress-maintenance": {
    focus: "50% 55%",
    day: { still: "/banners/wordpress-maintenance-day.webp", alt: "A 3D model of St. Augustine Beach through a fisheye lens from high over the town: the hotel, beach houses, the dunes and the beach curving to the pier under a lavender sky",
      blur: "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAkAAoBCJZQCdAEegRHzvEBAAP5hb71fRH03j0gC7stLmzzD8cbO3+VK0dI4ScA81KIyWqKlpbwxLyno2DGiNJFDeiEfoAA=" },
    night: { still: "/banners/wordpress-maintenance-night.webp", alt: "A 3D model of St. Augustine Beach at night through a fisheye lens from high over the town: windows and street lights lit, the dark beach curving to the pier under the stars",
      blur: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAkAAoBCJQBOgCP7qkvJOGAA/vpnK5ujwLyVDE27Q/lafFaBaz6+iriX1hrYgrd/4AAA" },
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
