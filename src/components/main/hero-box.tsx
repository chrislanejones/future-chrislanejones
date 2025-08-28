"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function HeroCard() {
  return (
    <motion.article
      className="md:col-span-4 md:row-span-2 card rounded-3xl glass p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Background Decoration */}
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

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-4xl font-black leading-tight">
            Building clean web apps — then disappearing into the mountains. 🏔️
          </h1>
          <p className="text-regular max-w-prose">
            I&apos;m a full‑stack developer who loves performance, DX, and
            delightful UI. When I&apos;m not shipping, I&apos;m probably hiking
            a ridge, mapping trails, or chasing sunrise.
          </p>
        </div>

        {/* Buttons pinned to bottom-left */}
        <div className="mt-auto flex items-center gap-3">
          <Button asChild variant="base">
            <a href="#contact">See My Calendar</a>
          </Button>
          <Button asChild variant="base">
            <a href="#projects">View Projects</a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
