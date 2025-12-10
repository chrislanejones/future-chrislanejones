"use client";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaCodepen,
  FaDev,
  FaHome,
  FaWordpress,
  FaChrome,
  FaAtom,
  FaStar,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { SiBluesky, SiBuymeacoffee } from "react-icons/si";
import { Button } from "@/components/ui/button";
import Card from "@/components/page/card";
import Image from "next/image";
import { SiteLogo } from "@/components/page/links";
import Link from "next/link";
import { SimpleModeToggle } from "@/components/simple-mode-toggle";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface FeaturedLink {
  _id: string;
  href: string;
  label: string;
  domain: string;
  favicon?: string;
  category: string;
  color: string;
  featured?: boolean;
}

export default function LinkGrid() {
  // Query for featured links from Convex
  const featuredLinks = useQuery(api.browserLinks.getFeatured) as
    | FeaturedLink[]
    | undefined;

  return (
    <>
      {/* Header with Logo and Theme Toggle */}
      <div className="flex items-center justify-between py-4">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="grid place-content-center">
            <SiteLogo />
          </div>
          <span className="whitespace-nowrap">Chris Lane Jones</span>
        </Link>
        <SimpleModeToggle />
      </div>

      {/* Grid Layout: 2 columns, 2 rows - using grid-area equivalent with Tailwind */}
      <div className="grid md:grid-cols-2 grid-cols-1 sm:grid-cols-1 md:grid-rows-2 gap-6 md:auto-rows-fr">
        {/* Card 1: Main Avatar and Info - Top Left (grid-area: 1 / 1 / 2 / 2) */}
        <Card size="small" delay={0.1} className="h-full">
          <div className="flex flex-col items-center gap-4">
            <Image
              alt="Chris Lane Jones"
              width={120}
              height={120}
              className="h-30 w-30 rounded-2xl ring-2 ring-white/5 object-cover"
              src="/Professional-Photo-of-Chris-Lane-Jones.webp"
            />
            <h1 className="text-center">UX/UI Web Design and Development</h1>
            <h2 className="text-center">
              I Consult, Design, and Develop Web Interfaces for Businesses and
              Government Agencies.
            </h2>
          </div>
        </Card>

        {/* Card 2: Social Links - Top Right (grid-area: 1 / 2 / 2 / 3) */}
        <Card size="small" delay={0.2} className="h-full">
          <h3 className="mb-6 text-center flex items-center justify-center space-x-2">
            Connect With Me
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="base" className="justify-center" asChild>
              <a href="/">
                <FaHome className="w-4 h-4 mr-2" />
                Home
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://x.com/cljwebdev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="w-4 h-4 mr-2" />
                𝕏
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://bsky.app/profile/chrislanejones.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiBluesky className="w-4 h-4 mr-2" />
                BlueSky
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://github.com/chrislanejones"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/chrislanejones/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://www.youtube.com/@chrislanejones"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className="w-4 h-4 mr-2" />
                YouTube
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://www.tiktok.com/@cljwebdev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="w-4 h-4 mr-2" />
                TikTok
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://codepen.io/chrislanejones"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaCodepen className="w-4 h-4 mr-2" />
                CodePen
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://dev.to/chrislanejones"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDev className="w-4 h-4 mr-2" />
                Dev.to
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a
                href="https://buymeacoffee.com/chrislanejones"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiBuymeacoffee className="w-4 h-4 mr-2" />
                Coffee
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a href="/react-maintenance">
                <FaAtom className="w-4 h-4 mr-2" />
                React Services
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="justify-center"
              asChild
            >
              <a href="/wordpress-maintenance">
                <FaWordpress className="w-4 h-4 mr-2" />
                WordPress Services
              </a>
            </Button>
          </div>
        </Card>

        {/* Card 3: Current Chrome Tabs - Bottom (spans both columns, grid-area: 2 / 1 / 3 / 3) */}
        <Card size="large" delay={0.3}>
          <h3 className="mb-6 text-center flex items-center justify-center space-x-2">
            <FaChrome className="w-6 h-6" />
            <span>Chrome Tabs I Left Open...</span>
          </h3>
          <div className="space-y-3">
            {featuredLinks && featuredLinks.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {featuredLinks.map((link) => (
                  <Button
                    key={link._id}
                    variant="base"
                    showExternalIcon={true}
                    className="justify-center"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.favicon ? (
                        <img
                          src={link.favicon}
                          alt=""
                          className="w-4 h-4 mr-2 rounded"
                        />
                      ) : (
                        <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                      )}
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted">
                <p className="text-sm">No featured links yet.</p>
                <p className="text-xs mt-2">
                  Mark links as "Featured" in the admin panel to display them
                  here.
                </p>
              </div>
            )}

            {/* Link to full browser tabs page */}
            <div className="mt-6 pt-4 border-t border-border">
              <Button variant="base" className="w-full justify-center" asChild>
                <a href="/browser-tabs">
                  <FaChrome className="w-4 h-4 mr-2" />
                  View All Browser Tabs
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
