"use client";

import { motion } from "framer-motion";
import ClientSliderBox from "./main/client-slider-box";
import MusicPlayerBox from "./main/music-player-box";
import QuoteGeneratorCard from "./main/quote-generator-card";
import TechStackBox from "./main/tech-stack-box";
import ProjectsBox from "./main/projects-box";
import ImageGalleryBox from "./main/image-gallery-box";

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

        {/* QUOTE GENERATOR CARD */}
        <QuoteGeneratorCard />

        {/* MUSIC PLAYER CARD */}
        <MusicPlayerBox />

        {/* TECH STACK */}
        <TechStackBox />

        {/* IMAGE GALLERY (HIKING) CARD */}
        <ImageGalleryBox />

        {/* FEATURED PROJECTS */}
        <ProjectsBox />

        {/* MINI PROJECTS - Now replaced by main ProjectsBox */}
        <motion.article
          className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel p-6 flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="font-semibold">Quick Links</h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <a
              href="mailto:hello@chrislanejones.com"
              className="group p-3 rounded-xl bg-base/60 hover:shadow-soft transition flex items-center justify-between"
            >
              <span>Email me</span>
              <span className="text-muted group-hover:text-ink">✉️</span>
            </a>
            <a
              href="https://www.linkedin.com/in/chrislanejones/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-xl bg-base/60 hover:shadow-soft transition flex items-center justify-between"
            >
              <span>LinkedIn</span>
              <span className="text-muted group-hover:text-ink">💼</span>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              className="group p-3 rounded-xl bg-base/60 hover:shadow-soft transition flex items-center justify-between"
            >
              <span>Resume</span>
              <span className="text-muted group-hover:text-ink">📄</span>
            </a>
          </div>
          <p className="text-muted text-xs mt-auto">
            Let&apos;s build something amazing together.
          </p>
        </motion.article>

        {/* CLIENT SLIDER */}
        <ClientSliderBox />
      </section>
    </main>
  );
}
