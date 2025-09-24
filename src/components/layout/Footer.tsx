"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

interface FooterLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "General",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },

      { href: "/links", label: "Link Page" },
      { href: "/browser-tabs", label: "Browser Tabs" },
    ],
  },
  {
    title: "My Work",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/career", label: "Career" },
      {
        href: "https://example.com",
        label: "Lorem Ipsum 7",
        isExternal: true,
      },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Extra",
    links: [
      { href: "/changelog", label: "Lorem Ipsum 9" },
      { href: "/connections", label: "Lorem Ipsum 10" },
      { href: "/links", label: "Lorem Ipsum 11" },
    ],
  },
];

export default function Footer() {
  const renderFooterLink = (link: FooterLink): JSX.Element => {
    if (link.isExternal) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link href={link.href} className="hover:text-foreground">
        {link.label}
      </Link>
    );
  };

  return (
    <motion.footer className="max-w-6xl mx-auto px-5 pt-5 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between">
        {/* Branding */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-panel card grid place-content-center shadow-soft">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-90"
              >
                <path
                  d="M3 18l6-9 3 4 2-3 7 8H3z"
                  stroke="#8de36b"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-xl whitespace-nowrap">
              Chris Lane Jones
            </span>
          </div>
          <p className="text-sm text-muted">
            I Consult, Design, and Develop Web Interfaces for Businesses and
            Government Agencies.
          </p>
          <div className="flex items-center gap-3 pt-3">
            <Button asChild variant="neutral" showExternalIcon={true}>
              <a
                href="https://github.com/chrislanejones"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap"
              >
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
                <span>GitHub</span>
              </a>
            </Button>

            <Button asChild variant="neutral" showExternalIcon={true}>
              <a
                href="https://www.linkedin.com/in/chrislanejones"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap"
              >
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
                <span>LinkedIn</span>
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted pt-3">
            © {new Date().getFullYear()} Chris Lane Jones. All rights reserved.
          </p>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 gap-8 text-sm text-muted sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <span className="mb-4 block font-bold text-xl whitespace-nowrap text-foreground">
                {section.title}
              </span>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li className="nav-link" key={link.href}>
                    {renderFooterLink(link)}
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
