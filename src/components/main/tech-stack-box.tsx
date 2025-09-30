"use client";

import { motion } from "framer-motion";
import Card from "../page/card";

// Component props interface
interface TechstackboxProps {
  size?:
    | "small"
    | "medium"
    | "large"
    | "wide"
    | "hero"
    | "full"
    | "page-full"
    | "page-half"
    | "page-third";
  delay?: number;
}

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
  siZig,
  siGo,
  siNixos,
  siPostgresql,
  siSvelte,
  siShadcnui,
} from "simple-icons";

type TechItem = { name: string; icon: { path: string } };

type AiTool = {
  name: string;
  // inline SVG (width/height driven by className)
  svg: JSX.Element;
};

const techStack: TechItem[] = [
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "TypeScript", icon: siTypescript },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "Framer Motion", icon: siFramer },
  { name: "TanStack", icon: siReactquery },
  { name: "Three.js", icon: siThreedotjs },
  { name: "Drizzle ORM", icon: siDrizzle },
  { name: "Bun", icon: siBun },
  { name: "Shell", icon: siGnubash },
  { name: "ShadUI", icon: siShadcnui },
];

const techStackFuture: TechItem[] = [
  { name: "Zig", icon: siZig },
  { name: "Go", icon: siGo },
  { name: "NixOS", icon: siNixos },
  { name: "Convex", icon: siPostgresql },
  { name: "Svelte", icon: siSvelte },
];

// ✅ Only one aiTools definition
export const aiTools: AiTool[] = [
  {
    name: "Claude",
    svg: (
      <svg
        className="h-5 w-5 text-[color:var(--color-foreground)]"
        viewBox="0 0 46 32"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M32.73 0h-6.945L38.45 32h6.945L32.73 0ZM12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z"></path>
      </svg>
    ),
  },
  {
    name: "Gemini 2.5 Pro",
    svg: (
      <svg
        className="h-5 w-5 text-[color:var(--color-foreground)]"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>Gemini</title>
        <path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"></path>
      </svg>
    ),
  },
  {
    name: "GLM 4.5",
    svg: (
      <svg
        className="h-5 w-5 text-[color:var(--color-foreground)]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2000 1700"
        fill="currentColor"
      >
        <polygon points="1008.73 0 827.29 251.03 54.43 251.03 235.74 0 1008.73 0"></polygon>
        <polygon points="1937.79 1449.1 1756.47 1700 986.3 1700 1167.48 1449.1 1937.79 1449.1"></polygon>
        <polygon points="2000 0 771.98 1700 0 1700 1228.02 0 2000 0"></polygon>
      </svg>
    ),
  },
];

// Small card (logo top, text below) used across sections
function IconCard({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[color:var(--color-muted-accent)] hover:shadow-soft transition group cursor-default">
      <div className="w-10 h-10 rounded-lg bg-ink/10 hover:bg-ink/10 flex items-center justify-center transition-colors text-[color:var(--color-foreground)]">
        {children}
      </div>
      <span className="text-center text-sm font-medium text-[color:var(--color-foreground)]">
        {label}
      </span>
    </div>
  );
}

export default function Techstackbox({
  size = "large",
  delay = 0.3,
}: TechstackboxProps) {
  return (
    <Card
      size={size}
      delay={delay}
      padding="small"
      className="flex flex-col gap-3"
    >
      {/* Tech I Love Section */}
      <div className="border border-[color:var(--color-border)] rounded-2xl p-3">
        <h3 className="text-lg font-bold text-[color:var(--color-foreground)] tracking-tight mb-3">
          Tech I Love 💖
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {techStack.map((tech) => (
            <IconCard key={tech.name} label={tech.name}>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[color:var(--color-foreground)]"
                fill="currentColor"
              >
                <path d={tech.icon.path} />
              </svg>
            </IconCard>
          ))}
        </div>
      </div>

      {/* Learning & Exploring Section */}
      <div className="border border-[color:var(--color-border)] rounded-2xl p-3">
        <h3 className="text-lg font-bold text-[color:var(--color-foreground)] tracking-tight mb-3">
          Learning & Exploring 🧪
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {techStackFuture.map((tech) => (
            <IconCard key={tech.name} label={tech.name}>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[color:var(--color-foreground)]"
                fill="currentColor"
              >
                <path d={tech.icon.path} />
              </svg>
            </IconCard>
          ))}
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="border border-[color:var(--color-border)] rounded-2xl p-4">
        <h3 className="text-lg font-bold text-[color:var(--color-foreground)] tracking-tight mb-4">
          Current AI Tools
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-sm">
          {aiTools.map((tool) => (
            <IconCard key={tool.name} label={tool.name}>
              {tool.svg}
            </IconCard>
          ))}
        </div>
      </div>
    </Card>
  );
}
