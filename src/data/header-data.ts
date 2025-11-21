/**
 * Centralized header data for all pages using the Banner component
 * Key should match the page route exactly (e.g., '/about', '/career')
 */
export const pageHeaders = {
  "/about": {
    title: "About Me",
    breadcrumbPage: "About",
    description:
      "Life on the trails and the web, building modern React applications and leading the local WordPress community.",
  },
  "/browser-tabs": {
    title: "Chrome Tabs I Left Open",
    breadcrumbPage: "Links",
    description:
      "A curated collection of useful resources, tools, and inspiration that I keep coming back to.",
  },
  "/career": {
    title: "Career",
    breadcrumbPage: "Career",
    description:
      "Following the trail from video production to web development—navigating frameworks, communities, and mountain views along the way.",
  },
  "/conferences": {
    title: "Conferences",
    breadcrumbPage: "Conferences",
    description:
      "Highlights and notes from events I've attended—open source, web, and community conferences across the years.",
  },
  "/blog": {
    title: "Blog",
    breadcrumbPage: "Blog",
    description:
      "Thoughts on web development, React, WordPress, and building things on the internet.",
  },
  "/logo-page": {
    title: "About the Logo",
    breadcrumbPage: "Logo",
    description:
      "The mountain in my logo represents more than just a visual element—it’s a symbol of the journey. Each peak conquered in code, each valley navigated through debugging, mirrors the trails I hike in the Shenandoah Mountains.",
  },
  "/projects": {
    title: "Projects",
    breadcrumbPage: "Projects",
    description:
      "A collection of full-stack applications, tools, and experiments built with modern technologies and a focus on performance and user experience.",
  },
  "/react-maintenance": {
    title: "React Site Maintenance",
    breadcrumbPage: "React Services",
    description:
      "A Monthly Action Plan That Makes Sense - Comprehensive React application maintenance, including regular updates, performance optimization, dependency management, and technical support.",
  },
  "/site-history": {
    title: "Site History",
    breadcrumbPage: "Site History",
    description:
      "The evolution of chrislanejones.com through various technologies, frameworks, and design iterations—from WordPress 2.1 to modern Next.js.",
  },
  "/site-map": {
    title: "Site Map & Changelog",
    breadcrumbPage: "Changelog",
    description:
      "Explore all available pages on chrislanejones.com and Track site updates",
  },
  "/wordpress-maintenance": {
    title: "WordPress Site Maintenance",
    breadcrumbPage: "WordPress Services",
    description:
      "A Monthly Action Plan That Makes Sense - Comprehensive website maintenance, including regular updates, security scans, performance optimization, and technical support.",
  },
  "/contact": {
    title: "Contact",
    breadcrumbPage: "Contact",
    description:
      "Get in touch about web development projects, WordPress meetups, or hiking trails.",
  },

  /**
   * Fallback header used when a path has no explicit entry.
   * This route is internal-only and not an actual page.
   */
  "/fallback": {
    title: "Page",
    breadcrumbPage: "Page",
    description:
      "Content coming soon. In the meantime, enjoy exploring the rest of the site.",
  },
} as const;

// Derived types from the data itself
export type PageRoute = keyof typeof pageHeaders;
export type PageHeaderData = (typeof pageHeaders)[PageRoute];

/**
 * Metadata for layout.tsx files
 */
export const layoutMetadata = {
  "/admin": {
    title: "Admin Dashboard | Chris Lane Jones",
    description: "Manage portfolio content and SEO",
  },
} as const;

export type LayoutRoute = keyof typeof layoutMetadata;
export type LayoutMetadata = (typeof layoutMetadata)[LayoutRoute];

// Helper functions

/**
 * Get the header for a given path.
 * Falls back to the '/fallback' header when the path is unknown.
 */
export function getPageHeader(path: string): PageHeaderData {
  if (path in pageHeaders) {
    return pageHeaders[path as PageRoute];
  }

  return pageHeaders["/fallback"];
}

/**
 * Get layout metadata for a given path.
 * Returns undefined if no metadata is defined for the route.
 */
export function getLayoutMeta(path: string): LayoutMetadata | undefined {
  if (path in layoutMetadata) {
    return layoutMetadata[path as LayoutRoute];
  }

  return undefined;
}
