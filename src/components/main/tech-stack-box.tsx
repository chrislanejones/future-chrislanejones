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

type TechItem = {
  name: string;
  icon: {
    path: string;
  };
};

const techStack: TechItem[] = [
  { name: "TanStack", icon: siReactquery },
  { name: "Bun", icon: siBun },
  { name: "TypeScript", icon: siTypescript },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "Next.js", icon: siNextdotjs },
  { name: "React", icon: siReact },
  { name: "Three.js", icon: siThreedotjs },
  { name: "Drizzle ORM", icon: siDrizzle },
  { name: "Shell", icon: siGnubash },
  { name: "Framer Motion", icon: siFramer },
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
      className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel p-6 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Current Tech Section */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          Tech I love
          <span className="text-red-500">❤️</span>
        </h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech.name}
            className="px-3 py-1 rounded-lg bg-base/60 flex items-center gap-2 text-sm"
          >
            {tech.icon && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="rgb(141 227 107)"
              >
                <path d={tech.icon.path} />
              </svg>
            )}
            {tech.name}
          </span>
        ))}
      </div>

      {/* Future Tech Section */}
      <div className="flex items-center justify-between pt-5">
        <h2 className="font-semibold flex items-center gap-2">
          Irons in the Fire
          <span>🔥</span>
        </h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStackFuture.map((tech) => (
          <span
            key={tech.name}
            className="px-3 py-1 rounded-lg bg-base/60 flex items-center gap-2 text-sm"
          >
            {tech.icon && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="rgb(141 227 107)"
              >
                <path d={tech.icon.path} />
              </svg>
            )}
            {tech.name}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
