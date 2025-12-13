"use client";
import React from "react"; // Add this import
import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaGithub, FaLinkedin, FaCodepen } from "react-icons/fa6";
import { SiCodeberg } from "react-icons/si";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

// Renamed from DropdownNavItem to HeaderNavItem and updated types for Convex data
export interface HeaderNavItem {
  _id?: string; // Convex ID
  label: string;
  href?: string;
  isExternal?: boolean;
  parentId?: string; // Convex ID for parent
  order: number;
  children?: HeaderNavItem[];
}

export interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

// Renamed from FooterSection to FooterNavSection and updated types for Convex data
export interface FooterNavSection {
  _id?: string; // Convex ID
  title: string;
  order: number;
  links: FooterNavLink[];
}

export interface FooterNavLink extends NavLink {
  _id?: string; // Convex ID
  sectionId?: string; // Convex ID for parent section
  order: number;
}

export function SiteLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/site-logo.svg"
      alt="Chris Lane Jones Logo"
      width={50}
      height={50}
      className={`opacity-90 ${className}`}
      priority
    />
  );
}

// Use a hook to fetch header nav items
export function useHeaderNavItems() {
  const convexHeaderNavItems = useQuery(api.navigation.getHeaderNavItems);

  // Transform Convex data to match existing HeaderNavItem structure (for consistency)
  return React.useMemo(() => {
    if (!convexHeaderNavItems) {
      // Return static data or a loading state if Convex data is not yet available
      return [
        { label: "Home", href: "/", order: 0 },
        {
          label: "About",
          order: 1,
          children: [
            { href: "/about", label: "About", order: 0 },
            {
              href: "/browser-tabs",
              label: "Chrome Tabs I Left Open",
              order: 1,
            },
            { href: "/site-history", label: "History of This Site", order: 2 },
            { href: "/link-page", label: "Link Page", order: 3 },
          ],
        },
        {
          label: "Work",
          order: 2,
          children: [
            { href: "/projects", label: "Projects", order: 0 },
            { href: "/career", label: "Career & Resume", order: 1 },
            { href: "/conferences", label: "Conferences", order: 2 },
            { href: "/react-maintenance", label: "React Services", order: 3 },
            {
              href: "/wordpress-maintenance",
              label: "WordPress Services",
              order: 4,
            },
          ],
        },
        { label: "Blog", href: "/blog", order: 3 },
        { label: "Contact", href: "/contact", order: 4 },
      ] as HeaderNavItem[];
    }
    return convexHeaderNavItems as HeaderNavItem[];
  }, [convexHeaderNavItems]);
}

// This should also use the data from useHeaderNavItems, but flattened for a simple list.
// Or, if this is specifically for a simpler flat list, we might want a separate Convex query.
// For now, let's keep it simple and filter based on existing fetched data if possible.
export const headerNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/career", label: "Career" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/browser-tabs", label: "Browser Tabs" },
];

// Use a hook to fetch footer nav sections
export function useFooterNavSections() {
  const convexFooterSections = useQuery(api.navigation.getFooterNavSections);

  return React.useMemo(() => {
    if (!convexFooterSections) {
      // Return static data or a loading state if Convex data is not yet available
      return [
        {
          title: "About",
          order: 0,
          links: [
            { href: "/", label: "Home", order: 0 },
            { href: "/about", label: "About", order: 1 },
            { href: "/link-page", label: "Link Page", order: 2 },
            { href: "/browser-tabs", label: "Browser Tabs", order: 3 },
            { href: "/contact", label: "Contact", order: 4 },
          ],
        },
        {
          title: "Work",
          order: 1,
          links: [
            { href: "/projects", label: "Projects", order: 0 },
            { href: "/career", label: "Career & Resume", order: 1 },
            { href: "/blog", label: "Blog", order: 2 },
            { href: "/react-maintenance", label: "React Services", order: 3 },
            {
              href: "/wordpress-maintenance",
              label: "WordPress Services",
              order: 4,
            },
            { href: "/conferences", label: "Conferences", order: 5 },
          ],
        },
        {
          title: "Resources",
          order: 2,
          links: [
            { href: "/site-history", label: "History of This Site", order: 0 },
            { href: "/logo-page", label: "About The Logo", order: 1 },
            { href: "/site-map", label: "Change Log / Site Map", order: 2 },
            { href: "/admin", label: "Admin", order: 3 },
            { href: "/404", label: "404 Music Lounge", order: 4 },
          ],
        },
      ] as FooterNavSection[];
    }
    return convexFooterSections as FooterNavSection[];
  }, [convexFooterSections]);
}

export const socialLinks: SocialLink[] = [
  {
    href: "https://twitter.com/cljwebdev",
    label: "X (formerly Twitter)",
    icon: <FaXTwitter size={18} />,
  },
  {
    href: "https://github.com/chrislanejones",
    label: "GitHub",
    icon: <FaGithub size={18} />,
  },
  {
    href: "https://codeberg.org/chrislanejones",
    label: "Codeburg",
    icon: <SiCodeberg size={18} />,
  },
  {
    href: "https://www.linkedin.com/in/chrislanejones",
    label: "LinkedIn",
    icon: <FaLinkedin size={18} />,
  },
];

export const footerSocialLinks: SocialLink[] = [
  {
    href: "https://twitter.com/cljwebdev",
    label: "X (formerly Twitter)",
    icon: <FaXTwitter size={18} />,
  },
  {
    href: "https://github.com/chrislanejones",
    label: "GitHub",
    icon: <FaGithub size={18} />,
  },
  {
    href: "https://codeberg.org/chrislanejones",
    label: "Codeburg",
    icon: <SiCodeberg size={18} />,
  },
  {
    href: "https://www.linkedin.com/in/chrislanejones",
    label: "LinkedIn",
    icon: <FaLinkedin size={18} />,
  },
  {
    href: "https://codepen.io/chrislanejones",
    label: "Codepen",
    icon: <FaCodepen size={18} />,
  },
];

interface NavLinkProps {
  link: NavLink;
  className?: string;
  onClick?: () => void;
}

export function NavLinkComponent({
  link,
  className = "",
  onClick,
}: NavLinkProps) {
  if (link.isExternal) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}
