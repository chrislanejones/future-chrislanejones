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

export default function Footer() {
  return (
    <motion.footer className="relative site-container pt-5 pb-10 overflow-hidden">
      <div className="footer-hills">
        <div className="hill hill-1"></div>
        <div className="hill hill-2"></div>
        <div className="hill hill-3"></div>
      </div>
      <div className="footer-hills"></div>

      {/* Goat Element */}
      <div className="absolute bottom-[25%] left-1/4 transform -translate-x-1/2 z-0">
        <div className="goat-body">
          <div className="goat-head"></div>
          <div className="goat-legs"></div>
          <div className="goat-horns"></div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 md:items-start">
        {/* Branding */}
        <div className="flex flex-col gap-4 max-w-sm md:col-span-2 md:h-full md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid place-content-center">
                <SiteLogo />
              </div>
              <span className="font-bold text-xl whitespace-nowrap">
                Chris Lane Jones
              </span>
            </Link>
          </div>

          <p className="text-sm text-muted">
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
        <div className="grid grid-cols-2 gap-8 text-sm text-muted md:col-span-3 md:grid-cols-3">
          {footerNavLinks.map((section, index) => (
            <div
              key={section.title}
              className={`justify-self-end text-right ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <span className="mb-4 block font-bold text-xl whitespace-nowrap text-foreground">
                {section.title}
              </span>
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
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Chris Lane Jones. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
