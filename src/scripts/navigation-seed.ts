// src/data/navigation-seed.ts

import React from "react";
import type { NavLink } from "../components/page/links";

// Original static structure for header navigation items
export interface SeedHeaderNavItem {
  label: string;
  href?: string;
  isExternal?: boolean;
  children?: NavLink[];
}

export const staticHeaderNavItems: SeedHeaderNavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { href: "/about", label: "About" },
      { href: "/browser-tabs", label: "Chrome Tabs I Left Open" },
      { href: "/site-history", label: "History of This Site" },
      { href: "/link-page", label: "Link Page" },
    ],
  },
  {
    label: "Work",
    children: [
      { href: "/projects", label: "Projects" },
      { href: "/career", label: "Career & Resume" },
      { href: "/conferences", label: "Conferences" },
      { href: "/react-maintenance", label: "React Services" },
      { href: "/wordpress-maintenance", label: "WordPress Services" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Original static structure for footer navigation sections
export interface SeedFooterNavSection {
  title: string;
  links: NavLink[];
}

export const staticFooterNavLinks: SeedFooterNavSection[] = [
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
      { href: "/career", label: "Career & Resume" },
      { href: "/blog", label: "Blog" },
      { href: "/react-maintenance", label: "React Services" },
      { href: "/wordpress-maintenance", label: "WordPress Services" },
      { href: "/conferences", label: "Conferences" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/site-history", label: "History of This Site" },
      { href: "/logo-page", label: "About The Logo" },
      { href: "/site-map", label: "Change Log / Site Map" },
      { href: "/admin", label: "Admin" },
      { href: "/404", label: "404 Music Lounge" },
    ],
  },
];
