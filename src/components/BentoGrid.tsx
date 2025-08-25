"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ClientSlider from "./ClientSlider";
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

const techStack = [
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

const techStackFuture = [
  { name: "Zig", icon: siZig },
  { name: "Go", icon: siGo },
  { name: "NixOS", icon: siNixos },
  { name: "Convex", icon: siPostgresql },
  { name: "Svelte", icon: siSvelte },
];

const projects = [
  { name: "Go Web Crawler", href: "#" },
  { name: "Roku + Put.io client", href: "#" },
  { name: "Vim/Neovim Shortcut Finder", href: "#" },
];

export default function BentoGrid() {
  return (
    <main className="max-w-6xl mx-auto px-5 pb-24">
      <section className="grid grid-cols-1 md:grid-cols-6 gap-5 auto-rows-[180px] md:auto-rows-[210px]">
        {/* HERO */}
        <motion.article
          className="md:col-span-4 md:row-span-2 card rounded-3xl glass p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="absolute -right-10 -top-10 opacity-20"
              width="300"
              height="300"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="100"
                cy="100"
                r="96"
                stroke="#8de36b"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-4 h-full">
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
              Building clean web apps — then disappearing into the mountains. 🏔️
            </h1>
            <p className="text-muted max-w-prose">
              I&apos;m a full‑stack developer who loves performance, DX, and
              delightful UI. When I&apos;m not shipping, I&apos;m probably
              hiking a ridge, mapping trails, or chasing sunrise.
            </p>
            <div className="mt-auto flex flex-wrap gap-3">
              <a
                href="#contact"
                className="px-4 py-2 rounded-xl bg-ink text-base text-base/90 font-semibold hover:ring-2 hover:ring-accent hover:text-base transition"
              >
                Work with me
              </a>
              <a
                href="#projects"
                className="px-4 py-2 rounded-xl bg-panel text-ink/90 hover:shadow-glow transition"
              >
                See projects
              </a>
            </div>
          </div>
        </motion.article>

        {/* PROFILE / QUICK LINKS */}
        <motion.article
          className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <Image
              alt="avatar"
              className="h-14 w-14 rounded-2xl ring-2 ring-white/10 object-cover"
              src="/Professional-Photo-of-Chris-Lane-Jones.webp"
              width={56}
              height={56}
            />
            <div>
              <div className="font-semibold">Chris Lane Jones</div>
              <div className="text-muted text-sm">
                Full‑stack • Hiking enjoyer
              </div>
            </div>
          </div>
          <ul className="text-sm grid grid-cols-2 gap-2 pt-4">
            <li>
              <a
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-base/60 hover:shadow-soft transition"
                href="https://chrislanejones.com"
                target="_blank"
              >
                Nope ↗
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-base/60 hover:shadow-soft transition"
                href="mailto:hello@chrislanejones.com"
              >
                Email ✉️
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-base/60 hover:shadow-soft transition"
                href="https://www.linkedin.com/in/chrislanejones/"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-base/60 hover:shadow-soft transition"
                href="https://github.com/chrislanejones"
                target="_blank"
              >
                GitHub
              </a>
            </li>
          </ul>
        </motion.article>

        {/* MUSIC PLAYER CARD */}
        <motion.article
          className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative flex-1 min-h-[200px]">
            <Image
              src="/Alvvays-Blue-Rev-Album-Art.webp"
              alt="album art"
              className="absolute inset-0 w-full h-full object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent"></div>
          </div>
          <div className="p-4 bg-base/70">
            <h3 className="font-semibold">Now Playing</h3>
            <p className="text-sm text-muted">Alvvays — After The Earthquake</p>
            <div className="flex items-center gap-3 mt-3">
              <button className="h-10 w-10 rounded-full bg-ink text-base flex items-center justify-center hover:ring-2 hover:ring-accent">
                ⮜
              </button>
              <button className="h-12 w-12 rounded-full bg-accent text-base flex items-center justify-center font-bold">
                ▶
              </button>
              <button className="h-10 w-10 rounded-full bg-ink text-base flex items-center justify-center hover:ring-2 hover:ring-accent">
                ⮞
              </button>
            </div>
          </div>
        </motion.article>

        {/* TECH STACK */}
        <motion.article
          className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel p-6 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
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
                className="px-3 py-1 rounded-lg bg-base/60 flex items-center gap-2"
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
                className="px-3 py-1 rounded-lg bg-base/60 flex items-center gap-2"
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

        {/* HIKING CARD */}
        <motion.article
          className="relative md:col-span-2 md:row-span-2 card rounded-3xl overflow-hidden bg-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Image
            alt="hiking"
            src="/Hiking.webp"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent"></div>
          <div className="relative p-6 flex items-end h-full">
            <div>
              <h3 className="font-semibold text-lg">Trail time</h3>
              <p className="text-sm text-ink/80">
                Weekend loops, sunrise summits, and mapping GPX tracks.
              </p>
            </div>
          </div>
        </motion.article>

        {/* FEATURED PROJECT */}
        <motion.article
          id="projects"
          className="md:col-span-4 md:row-span-2 card rounded-3xl bg-panel p-6 grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="order-2 md:order-1 flex flex-col">
            <h2 className="font-semibold text-xl">
              Featured: Image Editor & Optimizer
            </h2>
            <p className="text-muted mt-2">
              Next.js + TanStack app for cropping, painting, blur tools, and
              batch processing. Optimized for performance with Tailwind and
              Plotly for data viz.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Offline-friendly and keyboard‑navigable</li>
              <li>• Undo/redo, rotation/flip, pagination</li>
              <li>• Bulk crop mirroring across selected images</li>
            </ul>
            <div className="mt-auto pt-6 flex gap-3">
              <a
                href="https://github.com/chrislanejones"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-ink text-base font-semibold hover:ring-2 hover:ring-accent hover:text-base transition"
              >
                View code
              </a>
              <a
                href="#contact"
                className="px-4 py-2 rounded-xl bg-base/60 hover:shadow-soft"
              >
                Hire me
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[200px]">
            <Image
              src="/FCC-2017-Bold-Bean.webp"
              alt="code preview"
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute bottom-3 right-3 text-[11px] px-2 py-1 rounded-md bg-base/80">
              Performance‑minded UI
            </div>
          </div>
        </motion.article>

        {/* MINI PROJECTS */}
        <motion.article
          className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel p-6 flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="font-semibold">Other builds</h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                className="group p-3 rounded-xl bg-base/60 hover:shadow-soft transition flex items-center justify-between"
              >
                <span>{project.name}</span>
                <span className="text-muted group-hover:text-ink">→</span>
              </a>
            ))}
          </div>
          <p className="text-muted text-xs">
            Ping me for demos & case studies.
          </p>
        </motion.article>

        {/* CLIENT SLIDER */}
        <ClientSlider />
      </section>
    </main>
  );
}
