import type { ReactNode } from "react";
import { aiTools } from "@/data/ai-tools";
import {
  siReact,
  siRust,
  siTypescript,
  siTailwindcss,
  siFramer,
  siNextdotjs,
  siReactquery,
  siThreedotjs,
  siDrizzle,
  siBun,
  siGnubash,
  siShadcnui,
  siConvex,
  siPosthog,
  siSentry,
  siStripe,
  siDocker,
  siRoku,
  siGo,
  siNixos,
  siSvelte,
  siKubernetes,
} from "simple-icons";
import { Reveal } from "./reveal";
import styles from "./coastal.module.css";

const stack = [
  ["React", siReact],
  ["Rust", siRust],
  ["TypeScript", siTypescript],
  ["Tailwind", siTailwindcss],
  ["Framer Motion", siFramer],
  ["Next.js", siNextdotjs],
  ["TanStack", siReactquery],
  ["Three.js", siThreedotjs],
  ["Drizzle ORM", siDrizzle],
  ["Bun", siBun],
  ["Shell", siGnubash],
  ["ShadUI", siShadcnui],
  ["Convex", siConvex],
  ["PostHog", siPosthog],
  ["Sentry", siSentry],
  ["Stripe", siStripe],
  ["Docker", siDocker],
] as const;
const learning = [
  ["Roku App Dev", siRoku],
  ["Go", siGo],
  ["NixOS", siNixos],
  ["Svelte", siSvelte],
  ["Kubernetes", siKubernetes],
] as const;
function Technology({
  name,
  path,
  svg,
}: {
  name: string;
  path?: string;
  svg?: ReactNode;
}) {
  return (
    <div className={styles.technology}>
      <span className={styles.technologyIcon} aria-hidden="true">
        {svg ?? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d={path} />
          </svg>
        )}
      </span>
      <span>{name}</span>
    </div>
  );
}
export function CoastalTech() {
  return (
    <section
      className={`${styles.container} ${styles.techSection}`}
      aria-labelledby="tech-title"
    >
      <Reveal>
        <h2 id="tech-title">A good set of tools.</h2>
        <p className={styles.sectionDescription}>
          React, TypeScript, Rust/WebAssembly, AI automation, enterprise CMS,
          and WCAG accessibility.
        </p>
      </Reveal>
      <Reveal className={styles.techLayout}>
        <div className={styles.coreTools}>
          <h3>Tech I love</h3>
          <div className={styles.toolGrid}>
            {stack.map(([name, icon]) => (
              <Technology key={name} name={name} path={icon.path} />
            ))}
          </div>
        </div>
        <div className={styles.extraTools}>
          <div>
            <h3>Learning & tinkering</h3>
            <div className={styles.learningGrid}>
              {learning.map(([name, icon]) => (
                <Technology key={name} name={name} path={icon.path} />
              ))}
            </div>
          </div>
          <div>
            <h3>Current AI tools</h3>
            <div className={styles.aiGrid}>
              {aiTools.map((tool) => (
                <Technology
                  key={tool.name}
                  name={tool.name}
                  path={tool.icon?.path}
                  svg={tool.svg}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
