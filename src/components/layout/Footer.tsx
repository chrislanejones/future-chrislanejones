"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { footerSocialLinks, SiteLogo, footerNavLinks, NavLinkComponent } from "../page/links";

export default function Footer() {

  return (
    <motion.footer className="max-w-6xl mx-auto px-5 pt-5 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between gap-8">
        {/* Branding */}
        <div className="flex flex-col gap-4 max-w-sm">
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

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-3">
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

          <p className="text-sm text-muted pt-3">
            © {new Date().getFullYear()} Chris Lane Jones. All rights reserved.
          </p>
        </div>

        {/* Footer Sections */}
        <div className="grid grid-cols-1 gap-8 text-sm text-muted sm:grid-cols-3 pt-8 md:pt-0">
          {footerNavLinks.map((section) => (
            <div key={section.title}>
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
    </motion.footer>
  );
}
