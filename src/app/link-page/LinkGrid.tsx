"use client";

import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaCodepen,
  FaDev,
  FaWordpress,
  FaHome,
  FaTools,
  FaChrome,
} from "react-icons/fa";
import { SiBluesky, SiBuymeacoffee } from "react-icons/si";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Card from "@/components/page/card";
import Image from "next/image";
import { SiteLogo } from "@/components/page/links";
import Link from "next/link";
import { SimpleModeToggle } from "@/components/simple-mode-toggle";

export default function LinkGrid() {
  return (
    <div className="space-y-6">
      {/* Header with Logo and Theme Toggle */}
      <div className="flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="grid place-content-center">
            <SiteLogo />
          </div>
          <span className="font-bold text-xl whitespace-nowrap">
            Chris Lane Jones
          </span>
        </Link>
        <SimpleModeToggle />
      </div>

      {/* Card 1: Main Avatar and Info */}
      <Card padding="large" glass={false} delay={0.1} className="text-center">
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center mb-6">
          <Image
            alt="Chris Lane Jones"
            width={80}
            height={80}
            className="h-20 w-20 rounded-2xl ring-2 ring-white/5 object-cover"
            src="/Professional-Photo-of-Chris-Lane-Jones.webp"
          />
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-2xl font-black">
              UX/UI Web Design and Development
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">
            I Consult, Design, and Develop Web Interfaces for Businesses and
            Government Agencies.
          </h2>
          <p className="text-sm max-w-prose">
            I Build with React and WordPress — then escape to the Mountains. 🏔️
          </p>
        </div>
      </Card>

      {/* Card 2: Social Links */}
      <Card padding="medium" glass={false} delay={0.2}>
        <h3 className="text-xl md:text-xl mb-6 text-center flex items-center justify-center space-x-2 font-bold">
          Connect With Me
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="base"
            showExternalIcon={true}
            className="justify-center"
            asChild
          >
            <a
              href="https://chrislanejones.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
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
            <a
              href="https://chrislanejones.com/wordpress-site-maintenance/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTools className="w-4 h-4 mr-2" />
              WP Service
            </a>
          </Button>

          <Button
            variant="base"
            showExternalIcon={true}
            className="justify-center"
            asChild
          >
            <a
              href="https://chrislanejones.com/category/blog-post/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWordpress className="w-4 h-4 mr-2" />
              Blog
            </a>
          </Button>
        </div>
      </Card>

      {/* Card 3: Current Chrome Tabs */}
      <Card padding="medium" glass={false} delay={0.3}>
        <h3 className="text-xl md:text-xl mb-6 text-center flex items-center justify-center space-x-2 font-bold">
          <FaChrome className="w-6 h-6" />
          <span>Chrome Tabs I Left Open...</span>
        </h3>
        <div className="space-y-3">
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
              href="https://tweakcn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
            >
              <span>Tweakcn</span>
              <span>https://tweakcn.com</span>
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
        </div>
      </Card>
    </div>
  );
}
