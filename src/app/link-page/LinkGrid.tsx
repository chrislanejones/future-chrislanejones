"use client";
import React from "react";
import { FaChrome, FaExternalLinkAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Card from "@/components/page/card";
import Image from "next/image";
import { SiteLogo } from "@/components/page/links";
import Link from "next/link";
import { SimpleModeToggle } from "@/components/simple-mode-toggle";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { SocialIcon } from "@/lib/social-icons";

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

type SocialLinkRow = Doc<"socialLinks">;

// The avatar comes from Convex now; this is the photo that ships in /public, so
// the card still renders before the profile query resolves.
const FALLBACK_AVATAR = "/Professional-Photo-of-Chris-Lane-Jones.webp";

// Internal routes get a Next <Link> for client navigation; anything flagged
// external opens in a new tab.
function LinkButton({ link }: { link: SocialLinkRow }) {
  const content = (
    <>
      <span className="mr-2">
        <SocialIcon iconKey={link.iconKey} size={16} />
      </span>
      {link.label}
    </>
  );

  if (link.isExternal ?? link.href.startsWith("http")) {
    return (
      <Button
        variant="base"
        showExternalIcon={true}
        className="justify-center"
        asChild
      >
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      </Button>
    );
  }

  return (
    <Button variant="base" className="justify-center" asChild>
      <Link href={link.href}>{content}</Link>
    </Button>
  );
}

// Convex's useQuery throws on a server error, and a throw during render cannot
// be caught by the component doing the querying. Keeping the link list in its
// own child behind this boundary means a bad query costs one card, not the page.
class LinkListBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Link page links unavailable from Convex.", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <p className="text-center py-8 text-sm text-muted">
        Links are temporarily unavailable.
      </p>
    );
  }
}

function LinkList() {
  // One flat list in the order stored as each link's linkPageOrder, so social
  // profiles and other links can interleave (Home first, services last).
  const pageLinks = useQuery(api.socialLinks.getForLinkPage);
  const allRows = pageLinks ?? [];

  if (pageLinks && allRows.length === 0) {
    return (
      <p className="text-center py-8 text-sm text-muted">
        No links yet. Add them in Admin &rarr; Profile &amp; Social.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {allRows.map((link) => (
        <LinkButton key={link._id} link={link} />
      ))}
    </div>
  );
}

export default function LinkGrid() {
  // Query for featured links from Convex
  const featuredLinks = useQuery(api.browserLinks.getFeatured) as
    | FeaturedLink[]
    | undefined;

  // Profile photo, admin-managed, with the /public headshot as the fallback.
  const profile = useQuery(api.siteSettings.getProfile);
  const avatar = profile?.avatar || FALLBACK_AVATAR;

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
              alt={profile?.name || "Chris Lane Jones"}
              width={120}
              height={120}
              className="h-30 w-30 rounded-2xl ring-2 ring-white/5 object-cover"
              src={avatar}
            />
            <h1 className="text-center" style={{ fontSize: "var(--step-3)" }}>
              Senior Web Engineer | React, TypeScript & Rust/WebAssembly | AI
              Automation | Enterprise CMS & WCAG Accessibility
            </h1>
            <h2 className="text-center" style={{ fontSize: "var(--step-1)" }}>
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
          <LinkListBoundary>
            <LinkList />
          </LinkListBoundary>
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
                  Mark links as “Featured” in the admin panel to display them
                  here.
                </p>
              </div>
            )}

            {/* Link to full browser tabs page */}
            <div className="mt-6 pt-4 border-t border-border">
              <Button variant="base" className="w-full justify-center" asChild>
                <Link href="/browser-tabs">
                  <FaChrome className="w-4 h-4 mr-2" />
                  View All Browser Tabs
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
