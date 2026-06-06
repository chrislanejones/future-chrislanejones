"use client";

import type { ReactNode } from "react";
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
  siReplicate,
  siModelcontextprotocol,
  siN8n,
  siPosthog,
  siSentry,
} from "simple-icons";

type TechItem = { name: string; icon: { path: string } };

type AiTool = {
  name: string;
  svg?: ReactNode;
  icon?: { path: string };
};

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
];

const techStackFuture: TechItem[] = [
  { name: "Roku App Dev", icon: siRoku },
  { name: "Go", icon: siGo },
  { name: "NixOS", icon: siNixos },
  { name: "Svelte", icon: siSvelte },
];

export const aiTools: AiTool[] = [
  {
    name: "Gemini 3.1 Pro",
    svg: (
      <svg
        viewBox="0 0 16 16"
        className="h-10 w-10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" />
      </svg>
    ),
  },

  {
    name: "Claude Code",
    svg: (
      <svg
        viewBox="0 0 46 32"
        className="h-10 w-10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M32.73 0h-6.945L38.45 32h6.945L32.73 0ZM12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z" />
        <path d="M5 16 L15 10 L15 22 Z" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: "Codex",
    svg: (
      <svg
        viewBox="118 120 480 480"
        className="h-10 w-10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M304.246 295.411V249.828C304.246 245.989 305.687 243.109 309.044 241.191L400.692 188.412C413.167 181.215 428.042 177.858 443.394 177.858C500.971 177.858 537.44 222.482 537.44 269.982C537.44 273.34 537.44 277.179 536.959 281.018L441.954 225.358C436.197 222 430.437 222 424.68 225.358L304.246 295.411ZM518.245 472.945V364.024C518.245 357.304 515.364 352.507 509.608 349.149L389.174 279.096L428.519 256.543C431.877 254.626 434.757 254.626 438.115 256.543L529.762 309.323C556.154 324.679 573.905 357.304 573.905 388.971C573.905 425.436 552.315 459.024 518.245 472.941V472.945ZM275.937 376.982L236.592 353.952C233.235 352.034 231.794 349.154 231.794 345.315V239.756C231.794 188.416 271.139 149.548 324.4 149.548C344.555 149.548 363.264 156.268 379.102 168.262L284.578 222.964C278.822 226.321 275.942 231.119 275.942 237.838V376.986L275.937 376.982ZM360.626 425.922L304.246 394.255V327.083L360.626 295.416L417.002 327.083V394.255L360.626 425.922ZM396.852 571.789C376.698 571.789 357.989 565.07 342.151 553.075L436.674 498.374C442.431 495.017 445.311 490.219 445.311 483.499V344.352L485.138 367.382C488.495 369.299 489.936 372.179 489.936 376.018V481.577C489.936 532.917 450.109 571.785 396.852 571.785V571.789ZM283.134 464.79L191.486 412.01C165.094 396.654 147.343 364.029 147.343 332.362C147.343 295.416 169.415 262.309 203.48 248.393V357.791C203.48 364.51 206.361 369.308 212.117 372.665L332.074 442.237L292.729 464.79C289.372 466.707 286.491 466.707 283.134 464.79ZM277.859 543.48C223.639 543.48 183.813 502.695 183.813 452.314C183.813 448.475 184.294 444.636 184.771 440.797L279.295 495.498C285.051 498.856 290.812 498.856 296.568 495.498L417.002 425.927V471.509C417.002 475.349 415.562 478.229 412.204 480.146L320.557 532.926C308.081 540.122 293.206 543.48 277.854 543.48H277.859ZM396.852 600.576C454.911 600.576 503.37 559.313 514.41 504.612C568.149 490.696 602.696 440.315 602.696 388.976C602.696 355.387 588.303 322.762 562.392 299.25C564.791 289.173 566.231 279.096 566.231 269.024C566.231 200.411 510.571 149.067 446.274 149.067C433.322 149.067 420.846 150.984 408.37 155.305C386.775 134.192 357.026 120.758 324.4 120.758C266.342 120.758 217.883 162.02 206.843 216.721C153.104 230.637 118.557 281.018 118.557 332.357C118.557 365.946 132.95 398.571 158.861 422.083C156.462 432.16 155.022 442.237 155.022 452.309C155.022 520.922 210.682 572.266 274.978 572.266C287.931 572.266 300.407 570.349 312.883 566.028C334.473 587.141 364.222 600.576 396.852 600.576Z" />
        <path
          d="M250 300 L260 290 L270 300 M250 300 L260 310 L270 300"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          opacity="0.5"
        />
      </svg>
    ),
  },
  { name: "MCP", icon: siModelcontextprotocol },
  { name: "N8n", icon: siN8n },
  {
    name: "Xiaomi MiniMo",
    svg: (
      <svg
        viewBox="-200.008 -199.727 512 512"
        className="h-10 w-10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M258.626-146.231c-48.304-48.118-117.759-53.496-202.634-53.496c-84.982,0-154.542,5.44-202.826,53.688c-48.277,48.228-53.174,117.676-53.174,202.561c0,84.899,4.897,154.368,53.194,202.613c48.281,48.255,117.833,53.139,202.806,53.139c84.974,0,154.514-4.884,202.795-53.139c48.294-48.254,53.205-117.714,53.205-202.613c0-84.994-4.964-154.517-53.366-202.753ZM204.546-41.122c1.759,0,3.223,1.417,3.223,3.161v189.386c0,1.715-1.464,3.139-3.223,3.139H163.05c-1.781,0-3.228-1.424-3.228-3.139V-37.961c0-1.743,1.446-3.161,3.228-3.161H204.546z M24.468-41.122c31.303,0,64.033,1.435,80.176,17.589c15.871,15.897,17.59,47.549,17.656,78.286v96.671c0,1.715-1.446,3.139-3.219,3.139h-41.49c-1.777,0-3.229-1.424-3.229-3.139V53.09c-0.044-17.167-1.031-34.81-9.884-43.692c-7.62-7.641-21.839-9.391-36.625-9.754h-75.21c-1.764,0-3.208,1.419-3.208,3.136v148.645c0,1.715-1.462,3.139-3.237,3.139h-41.516c-1.774,0-3.201-1.424-3.201-3.139V-37.961c0-1.743,1.426-3.161,3.201-3.161H24.468z M33.755,34.305c1.766,0,3.201,1.413,3.201,3.143v113.977c0,1.715-1.436,3.139-3.201,3.139H-9.829c-1.792,0-3.228-1.424-3.228-3.139V37.448c0-1.73,1.436-3.143,3.228-3.143H33.755z"
        />
      </svg>
    ),
  },
  { name: "Replicate", icon: siReplicate },
];

export default function TechStackContent() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="p-3">
        <h3 className="text-ink tracking-tight mb-3">Tech I Love 💖</h3>
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {techStack.map((tech) => (
            <IconBlock key={tech.name} label={tech.name}>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-10 w-10"
                fill="currentColor"
              >
                <path d={tech.icon.path} />
              </svg>
            </IconBlock>
          ))}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-ink tracking-tight mb-3">
          Learning & Tinkering 🔬
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {techStackFuture.map((tech) => (
            <IconBlock key={tech.name} label={tech.name}>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-10 w-10"
                fill="currentColor"
              >
                <path d={tech.icon.path} />
              </svg>
            </IconBlock>
          ))}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-ink tracking-tight mb-3">Current AI Tools 🤖</h3>
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {aiTools.map((tool) => (
            <IconBlock key={tool.name} label={tool.name}>
              {tool.svg ||
                (tool.icon && (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-10 w-10"
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
