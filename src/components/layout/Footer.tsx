"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  footerSocialLinks,
  SiteLogo,
  footerNavLinks,
  NavLinkComponent,
} from "../page/links";

// Add this just below your imports
const BighornSheep = () => (
  <svg
    width="180"
    height="130"
    viewBox="0 0 180 130"
    role="img"
    aria-label="Bighorn sheep"
    className="drop-shadow-sm"
  >
    <defs>
      {/* colors draw from your tokens via currentColor */}
      <linearGradient id="hornGrad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="rgba(156,163,175,0.95)" />
        <stop offset="100%" stopColor="rgba(55,65,81,0.95)" />
      </linearGradient>
    </defs>

    {/* Body */}
    <g transform="translate(20,40)">
      <ellipse
        cx="60"
        cy="40"
        rx="58"
        ry="34"
        fill="currentColor"
        opacity="0.98"
      />
      {/* Chest highlight */}
      <ellipse cx="82" cy="50" rx="22" ry="14" fill="rgba(255,255,255,0.06)" />
      {/* Back leg */}
      <rect x="30" y="64" width="12" height="30" rx="4" fill="currentColor" />
      {/* Front leg */}
      <rect x="86" y="64" width="12" height="30" rx="4" fill="currentColor" />
      {/* Hooves */}
      <rect
        x="30"
        y="92"
        width="12"
        height="6"
        rx="1"
        fill="rgba(17,24,39,0.9)"
      />
      <rect
        x="86"
        y="92"
        width="12"
        height="6"
        rx="1"
        fill="rgba(17,24,39,0.9)"
      />
    </g>

    {/* Head */}
    <g transform="translate(96,22) rotate(6)">
      <ellipse cx="22" cy="20" rx="18" ry="16" fill="currentColor" />
      {/* Snout */}
      <ellipse cx="36" cy="26" rx="10" ry="9" fill="currentColor" />
      {/* Nose shine */}
      <circle cx="41" cy="28" r="2" fill="rgba(255,255,255,0.15)" />
      {/* Ear */}
      <ellipse
        cx="12"
        cy="10"
        rx="6"
        ry="9"
        fill="currentColor"
        transform="rotate(-18,12,10)"
      />
      {/* Eye */}
      <circle cx="28" cy="18" r="2.2" fill="rgba(255,255,255,0.85)" />
      <circle cx="28" cy="18" r="1.2" fill="rgba(0,0,0,0.9)" />

      {/* Bighorn curl */}
      <path
        d="M18,6
           c-10,0 -18,8 -18,18
           c0,10 8,18 18,18
           c7,0 12-3 15-7
           c3-4 4-9 2-14
           c-2-5 -6-9 -11-12
           c-3-2 -4-3 -6-3z"
        fill="url(#hornGrad)"
        stroke="rgba(31,41,55,0.7)"
        strokeWidth="1"
      />
      {/* Inner horn curve for depth */}
      <path
        d="M14,14
           c-6,2 -9,8 -7,14
           c2,6 8,9 14,7"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Tail */}
    <path d="M25,73 q-8,-6 -6,-14 q6,3 10,8" fill="currentColor" />

    {/* Ground shadow */}
    <ellipse cx="90" cy="120" rx="52" ry="6" fill="rgba(0,0,0,0.18)" />
  </svg>
);

export default function Footer() {
  return (
    <motion.footer className="relative site-container pt-5 pb-10 overflow-hidden">
      <div className="footer-hills">
        <div className="hill-mid"></div>
        <div className="hill-fore"></div>
        <div className="hill-fore right"></div>
      </div>

      {/* Bighorn Sheep */}
      <div className="absolute bottom-[26%] left-[18%] -translate-x-1/2 z-0 text-ink/95 dark:text-ink/85">
        <BighornSheep />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 md:items-start">
        {/* Branding */}
        <div className="flex flex-col gap-4 max-w-sm md:col-span-2 md:h-full md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid place-content-center">
                <SiteLogo />
              </div>
              <span className="whitespace-nowrap site-title">
                Chris Lane Jones
              </span>
            </Link>
          </div>

          <p className="text-muted">
            I Consult, Design, and Develop Web Interfaces for Businesses and
            Government Agencies.
          </p>

          {/* Social Icons - will align to bottom on desktop */}
          <div className="flex items-center gap-3 pt-3 md:mt-auto">
            {footerSocialLinks.map((social) => (
              <Button
                key={social.href}
                asChild
                variant="neutral"
                size="icon"
                round={true}
                title={social.label}
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.icon}
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Footer Sections */}
        <div className="grid grid-cols-2 gap-8 text-muted md:col-span-3 md:grid-cols-3">
          {footerNavLinks.map((section, index) => (
            <div
              key={section.title}
              className={`justify-self-end text-right ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <h3 className="mb-4 block whitespace-nowrap text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li className="nav-link" key={link.href}>
                    <NavLinkComponent
                      link={link}
                      className="hover:text-foreground"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Statement */}
      <div className="mt-8 pt-6 text-center relative z-10">
        <p className="text-muted">
          © {new Date().getFullYear()} Chris Lane Jones. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
