// src/components/page/links.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
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

export interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

// Navigation Links
export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/career", label: "Career" },
  { href: "/about", label: "About" },
  { href: "/browser-tabs", label: "Browser Tabs" },
  { href: "#contact", label: "Contact" },
];

// Social Media Icons
export const socialIcons = {
  twitter: (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.486 2 12.018c0 4.427 2.865 8.184 6.839 9.504.5.092.682-.218.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.37-1.343-3.37-1.343-.455-1.158-1.11-1.467-1.11-1.467-.908-.621.069-.609.069-.609 1.004.07 1.532 1.032 1.532 1.032.893 1.532 2.343 1.089 2.914.833.09-.647.35-1.089.636-1.34-2.221-.253-4.555-1.113-4.555-4.949 0-1.093.39-1.987 1.029-2.688-.103-.254-.446-1.273.097-2.653 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.503.337 1.909-1.296 2.748-1.026 2.748-1.026.544 1.38.201 2.399.099 2.653.64.701 1.028 1.595 1.028 2.688 0 3.846-2.338 4.693-4.566 4.941.36.31.68.92.68 1.852 0 1.336-.013 2.416-.013 2.744 0 .267.18.579.688.481A10.02 10.02 0 0 0 22 12.018C22 6.486 17.523 2 12 2Z"
      />
    </svg>
  ),
  linkedin: (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
    >
      <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.225.792 24 1.771 24h20.451C23.2 24 24 23.225 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003zM6.613 20.452H4.06V9h2.553v11.452zM5.337 7.433c-1.144 0-2.068-.927-2.068-2.07 0-1.143.924-2.07 2.068-2.07 1.143 0 2.068.927 2.068 2.07 0 1.143-.925 2.07-2.068 2.07zM20.447 20.452h-3.554V14.83c0-1.34-.026-3.062-1.866-3.062-1.868 0-2.155 1.458-2.155 2.965v5.719H9.318V9h3.414v1.561h.049c.476-.9 1.637-1.848 3.37-1.848 3.604 0 4.268 2.372 4.268 5.455v6.284z" />
    </svg>
  ),
};

// Social Links
export const socialLinks: SocialLink[] = [
  {
    href: "https://x.com/cljwebdev",
    label: "X (formerly Twitter)",
    icon: socialIcons.twitter,
  },
  {
    href: "https://github.com/chrislanejones",
    label: "GitHub",
    icon: socialIcons.github,
  },
  {
    href: "https://www.linkedin.com/in/chrislanejones",
    label: "LinkedIn",
    icon: socialIcons.linkedin,
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
