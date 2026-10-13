"use client";

import type { ReactNode } from "react";
import { aiTools } from "@/data/ai-tools";
import IconBlock from "@/components/page/icon-block";

import {
  siReactquery,
  siBun,
  siTypescript,
  siFramer,
  siTailwindcss,
  siNextdotjs,
  siReact,
  siThreedotjs,
  siDrizzle,
  siGnubash,
  siGo,
  siNixos,
  siSvelte,
  siRoku,
  siShadcnui,
  siRust,
  siConvex,
  siPosthog,
  siSentry,
  siStripe,
  siDocker,
  siKubernetes,
} from "simple-icons";

export { aiTools } from "@/data/ai-tools";

type TechItem = { name: string; icon?: { path: string }; svg?: ReactNode };

const techStack: TechItem[] = [
  { name: "React", icon: siReact },
  { name: "Rust", icon: siRust },
  { name: "TypeScript", icon: siTypescript },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "Framer Motion", icon: siFramer },
  { name: "Next.js", icon: siNextdotjs },
  { name: "TanStack", icon: siReactquery },
  { name: "Three.js", icon: siThreedotjs },
  { name: "Drizzle ORM", icon: siDrizzle },
  { name: "Bun", icon: siBun },
  { name: "Shell", icon: siGnubash },
  { name: "ShadUI", icon: siShadcnui },
  { name: "Convex", icon: siConvex },
  { name: "Posthog", icon: siPosthog },
  { name: "Sentry", icon: siSentry },
  { name: "Stripe", icon: siStripe },
  { name: "Docker", icon: siDocker },
];

const techStackFuture: TechItem[] = [
  { name: "Roku App Dev", icon: siRoku },
  { name: "Go", icon: siGo },
  { name: "NixOS", icon: siNixos },
  { name: "Svelte", icon: siSvelte },
  { name: "Kubernetes", icon: siKubernetes },
];

export default function TechStackContent() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="p-3">
        <h3 className="text-ink tracking-tight mb-3">Tech I Love 💖</h3>
        <div className="grid grid-cols-3 min-[420px]:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {techStack.map((tech) => (
            <IconBlock key={tech.name} label={tech.name}>
              {tech.svg ?? (
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-6 w-6 sm:h-10 sm:w-10"
                  fill="currentColor"
                >
                  <path d={tech.icon?.path} />
                </svg>
              )}
            </IconBlock>
          ))}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-ink tracking-tight mb-3">
          Learning & Tinkering 🔬
        </h3>
        <div className="grid grid-cols-3 min-[420px]:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {techStackFuture.map((tech) => (
            <IconBlock key={tech.name} label={tech.name}>
              {tech.svg ?? (
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-6 w-6 sm:h-10 sm:w-10"
                  fill="currentColor"
                >
                  <path d={tech.icon?.path} />
                </svg>
              )}
            </IconBlock>
          ))}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-ink tracking-tight mb-3">Current AI Tools 🤖</h3>
        <div className="grid grid-cols-3 min-[420px]:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {aiTools.map((tool) => (
            <IconBlock key={tool.name} label={tool.name}>
              {tool.svg ||
                (tool.icon && (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-6 w-6 sm:h-10 sm:w-10"
                    fill="currentColor"
                  >
                    <path d={tool.icon.path} />
                  </svg>
                ))}
            </IconBlock>
          ))}
        </div>
      </div>
    </div>
  );
}
