// src/components/page/links.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaGithub, FaLinkedin, FaCodepen } from "react-icons/fa6";

export interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

export interface DropdownNavItem {
  label: string;
  href?: string;
  children?: NavLink[];
}

export interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

// Site Logo Component
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

// Header Navigation Links - New Structure with Dropdowns
export const headerNavItems: DropdownNavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { href: "/about", label: "About" },
      { href: "/browser-tabs", label: "Chrome Tabs I Left Open" },
      { href: "/site-history", label: "History of this Site" },
      { href: "/link-page", label: "Link Page" },
    ],
  },
  {
    label: "Work",
    children: [
      { href: "/projects", label: "Projects" },
      { href: "/career", label: "Career" },
      { href: "/conferences", label: "Conferences" },
      { href: "/react-maintenance", label: "React Services" },
      { href: "/wordpress-maintenance", label: "WordPress Services" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Legacy header navigation links for backward compatibility
export const headerNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/career", label: "Career" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/browser-tabs", label: "Browser Tabs" },
];

// Footer Navigation Sections
export const footerNavLinks: FooterSection[] = [
  {
    title: "About",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/link-page", label: "Link Page" },
      { href: "/browser-tabs", label: "Browser Tabs" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Work",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/career", label: "Career" },
      { href: "/blog", label: "Blog" },
      { href: "/react-maintenance", label: "React Services" },
      { href: "/wordpress-maintenance", label: "WordPress Services" },
      { href: "/conferences", label: "Conferences" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/site-history", label: "History of this Site" },
      { href: "/logo-page", label: "About The Logo" },
      { href: "/site-map", label: "Change Log / Site Map" },
      { href: "/admin", label: "Admin" },
      { href: "/404", label: "404 Music Lounge" },
    ],
  },
];

// Social Links - for header (without Codepen)
export const socialLinks: SocialLink[] = [
  {
    href: "https://x.com/cljwebdev",
    label: "X (formerly Twitter)",
    icon: <FaXTwitter size={18} />,
  },
  {
    href: "https://github.com/chrislanejones",
    label: "GitHub",
    icon: <FaGithub size={18} />,
  },
  {
    href: "https://www.linkedin.com/in/chrislanejones",
    label: "LinkedIn",
    icon: <FaLinkedin size={18} />,
  },
];

// Footer Social Links - includes Codepen
export const footerSocialLinks: SocialLink[] = [
  {
    href: "https://x.com/cljwebdev",
    label: "X (formerly Twitter)",
    icon: <FaXTwitter size={18} />,
  },
  {
    href: "https://github.com/chrislanejones",
    label: "GitHub",
    icon: <FaGithub size={18} />,
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

// Reusable NavLink Component
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
