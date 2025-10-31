"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";
import {
  FileText,
  ExternalLink,
  Home,
  Briefcase,
  Code,
  Book,
  MessageSquare,
  Users,
  Mountain,
} from "lucide-react";

const sitemapSections = [
  {
    title: "Main Pages",
    icon: <Home className="w-5 h-5" />,
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Career", href: "/career" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    icon: <Briefcase className="w-5 h-5" />,
    links: [
      { label: "WordPress Maintenance", href: "/wordpress-maintenance" },
      { label: "React Maintenance", href: "/react-maintenance" },
    ],
  },
  {
    title: "Content & Resources",
    icon: <Book className="w-5 h-5" />,
    links: [
      { label: "Browser Tabs", href: "/browser-tabs" },
      { label: "Conferences", href: "/conferences" },
      { label: "Site History", href: "/site-history" },
      { label: "About the Logo", href: "/logo" },
    ],
  },
  {
    title: "Connect",
    icon: <Users className="w-5 h-5" />,
    links: [
      { label: "Link Page", href: "/link-page" },
      {
        label: "GitHub",
        href: "https://github.com/chrislanejones",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/chrislanejones/",
        external: true,
      },
      { label: "𝕏 (Twitter)", href: "https://x.com/cljwebdev", external: true },
      {
        label: "BlueSky",
        href: "https://bsky.app/profile/chrislanejones.com",
        external: true,
      },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <main className="site-container py-12">
      <Banner
        title="Site Map & Changelog"
        breadcrumbPage="Changelog"
        description="Explore all available pages on chrislanejones.com and Track site updates"
      />

      <FullWidthLayout>
        {/* Two Column Layout: Changelog (left) | Sitemap (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Changelog Card */}
          <Card
            size="page-half"
            padding="large"
            shadow="soft"
            border="thin"
            delay={0.1}
            className="flex flex-col"
            style={{ minHeight: "auto" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-accent" />
              <h2 className="">Changelog</h2>
            </div>

            <div className="flex-1 flex items-center justify-center text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <Code className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-muted">
                  Coming Soon
                </h3>
                <p className="text-muted max-w-sm">
                  Detailed version history and site updates will be documented
                  here. Check back soon for a comprehensive changelog.
                </p>
              </div>
            </div>
          </Card>

          {/* Sitemap Card */}
          <Card
            size="page-half"
            padding="large"
            shadow="soft"
            border="thin"
            delay={0.2}
            className="flex flex-col"
            style={{ minHeight: "auto" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Mountain className="w-6 h-6 text-accent" />
              <h2 className="">Site Map</h2>
            </div>

            <div className="space-y-6 flex-1">
              {sitemapSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-accent">
                    {section.icon}
                    <h3 className="uppercase tracking-wide">
                      {section.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 pl-7">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5 group"
                          >
                            {link.label}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-muted hover:text-accent transition-colors inline-block"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Full Width Card - Tech Stack */}
        <Card
          size="page-full"
          padding="large"
          shadow="soft"
          border="thin"
          delay={0.3}
          className="mt-6"
          style={{ minHeight: "auto" }}
        >
          <div className="text-center space-y-4">
            <h2 className="">Built With</h2>
            <p className="text-muted max-w-2xl mx-auto">
              This site is built with Next.js 14, React, TypeScript, Tailwind
              CSS, and Framer Motion. Hosted on Vercel with data managed through
              Convex.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "Tailwind CSS",
                "Framer Motion",
                "Vercel",
                "Convex",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-accent/10 text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </FullWidthLayout>
    </main>
  );
}
