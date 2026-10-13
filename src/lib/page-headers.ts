/**
 * Static page header data - used as fallback while Convex loads
 * and for seeding the Convex database.
 */
export const staticPageHeaders: Record<
  string,
  { title: string; breadcrumbPage: string; description: string }
> = {
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
  "/career-and-resume": {
    title: "Career",
    breadcrumbPage: "Career",
    description:
      "Senior web engineering, enterprise CMS platforms, and AI automation. Explore my experience and download my October 2026 resume.",
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
      "My logo started as a mountain from eight years on the Shenandoah trails. When we moved back to Florida in 2026, it became three waves. Here is every version.",
  },
  "/projects": {
    title: "Projects",
    breadcrumbPage: "Projects",
    description:
      "A collection of full-stack applications, tools, and experiments built with modern technologies and a focus on performance and user experience.",
  },
  "/projects/apps": {
    title: "Projects",
    breadcrumbPage: "Projects",
    description:
      "A collection of full-stack applications, tools, and experiments built with modern technologies and a focus on performance and user experience.",
  },
  "/projects/websites": {
    title: "Projects",
    breadcrumbPage: "Projects",
    description:
      "Professional websites and web applications built for clients across various industries, featuring custom design and functionality.",
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
    title: "Site Map",
    breadcrumbPage: "Site Map",
    description:
      "Explore the pages, writing, projects, and resources on chrislanejones.com.",
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
  "/admin-showcase": {
    title: "Website Convex Admin",
    breadcrumbPage: "Admin Showcase",
    description:
      "A tour of the content tools powering this site, built with Next.js, Convex, and Clerk.",
  },
  "/fallback": {
    title: "Page",
    breadcrumbPage: "Page",
    description:
      "Content coming soon. In the meantime, enjoy exploring the rest of the site.",
  },
};

export type PageHeaderData = {
  title: string;
  breadcrumbPage: string;
  description: string;
};

/**
 * Get the header for a given path.
 * Falls back to the '/fallback' header when the path is unknown.
 */
export function getPageHeader(path: string): PageHeaderData {
  return staticPageHeaders[path] ?? staticPageHeaders["/fallback"];
}
