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
  FaTools,
  FaChrome,
  FaAtom,
} from "react-icons/fa";
import { SiBluesky, SiBuymeacoffee } from "react-icons/si";
import { Button } from "@/components/ui/button";
import Card from "@/components/page/card";
import Image from "next/image";
import { SiteLogo } from "@/components/page/links";
import Link from "next/link";
import { SimpleModeToggle } from "@/components/simple-mode-toggle";

export default function LinkGrid() {
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
                <FaTools className="w-4 h-4 mr-2" />
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
            <Button variant="base" showExternalIcon={true} asChild>
              <a
                href="https://www.isocons.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full"
              >
                <span>Isocons - Icon Library</span>
                <span>isocons.app</span>
              </a>
            </Button>

            <Button
              variant="base"
              showExternalIcon={true}
              className="flex items-center justify-between w-full"
            >
              <a
                href="https://effect.website/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full"
              >
                <span>Effect - TypeScript Library</span>
                <span>effect.website</span>
              </a>
            </Button>

            <Button variant="base" showExternalIcon={true} asChild>
              <a
                href="https://github.com/aulianza/aulianza.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full"
              >
                <span>aulianza.id</span>
                <span>https://github.com/aulianza/aulianza.id</span>
              </a>
            </Button>

            <Button variant="base" showExternalIcon={true} asChild>
              <a
                href="https://www.fffuel.co/ooorganize/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full"
              >
                <span>ooorganize pattern</span>
                <span>https://www.fffuel.co/ooorganize/</span>
              </a>
            </Button>

            <Button variant="base" showExternalIcon={true} asChild>
              <a
                href="https://pro.aceternity.com/products/navbars"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full"
              >
                <span>Aceternity UI</span>
                <span>aceternity.com</span>
              </a>
            </Button>

            <Button variant="base" showExternalIcon={true} asChild>
              <a
                href="https://learnxinyminutes.com/zig/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full"
              >
                <span>Learn X in Y minutes</span>
                <span>https://learnxinyminutes.com/zig/</span>
              </a>
            </Button>

            <Button variant="base" asChild className="w-full">
              <a href="/browser-tabs">See More Browser Tabs</a>
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
