"use client";

import { motion } from "framer-motion";
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
} from "simple-icons";
import { Badge } from "@/components/ui/badge";

type TechItem = {
  name: string;
  icon: { path: string };
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
];

const techStackFuture: TechItem[] = [
  { name: "Zig", icon: siZig },
  { name: "Go", icon: siGo },
  { name: "NixOS", icon: siNixos },
  { name: "Convex", icon: siPostgresql },
  { name: "Svelte", icon: siSvelte },
];

export default function TechStackBox() {
  return (
    <motion.article
      className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel p-5 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Current Tech Section */}
      <Section title="💻 Tech I Love" items={techStack} />

      <div className="my-5 border-t border-base/30"></div>

      {/* Future Tech Section */}
      <Section title="🚀 Learning & Exploring" items={techStackFuture} />
    </motion.article>
  );
}

function Section({ title, items }: { title: string; items: TechItem[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-foreground tracking-tight">
        {title}
      </h2>

      <div className="flex flex-wrap gap-2">
        {items.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
          >
            <Badge
              variant="secondary"
              className="group relative flex items-center gap-2 px-3 py-2 text-sm font-medium 
                        bg-base/40 hover:bg-base/70 border border-base/60 hover:border-base/80
                        transition-all duration-200 cursor-default shadow-sm hover:shadow-md
                        overflow-hidden"
            >
              {/* Shine effect */}
              <div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent 
                             group-hover:translate-x-full transition-transform duration-700 ease-out"
              />

              {tech.icon && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="rgb(141 227 107)"
                  className="relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                >
                  <path d={tech.icon.path} />
                </svg>
              )}
              <span className="relative z-10 truncate group-hover:text-foreground/90 transition-colors duration-200">
                {tech.name}
              </span>
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
