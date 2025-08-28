"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="max-w-6xl mx-auto py-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-panel card grid place-content-center shadow-soft">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90"
            >
              <path
                d="M3 18l6-9 3 4 2-3 7 8H3z"
                stroke="#8de36b"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-medium">Chris Lane Jones</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/projects" className="nav-link flex-1 text-center">
            Projects
          </a>
          <a href="/about" className="nav-link flex-1 text-center">
            About
          </a>
          <a href="#contact" className="nav-link flex-1 text-center">
            Contact
          </a>
        </div>

        <p className="text-sm text-muted text-center md:text-right">
          © 2025 Chris Lane Jones. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
