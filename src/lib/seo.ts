import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { PERSON, SITE_URL } from "./structured-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexHttpClient(convexUrl);

// Next merges metadata shallowly: a page's openGraph/twitter object wholesale
// replaces the layout's, so every page must carry its own images or social
// cards render blank. Relative URLs resolve against metadataBase (layout.tsx).
export const DEFAULT_OG_IMAGE = "/Professional-Photo-of-Chris-Lane-Jones.webp";

/** Search results cut descriptions near 160 characters; trim long copy at a word. */
export function metaDescription(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").replace(/\s*[\u2013\u2014]\s*/g, ", ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

// The layout appends "| Chris Lane Jones" to every page title. Titles that
// already name Chris opt out, so they don't read "Chris Lane Jones | … |
// Chris Lane Jones".
function pageTitle(title: string): Metadata["title"] {
  return title.includes(PERSON.name) ? { absolute: title } : title;
}

function ogImages(url: string, alt: string) {
  return [{ url, width: 1200, height: 630, alt }];
}

export async function getPageSEO(path: string): Promise<Metadata> {
  try {
    const data = await convex.query(api.seo.getSEOByPath, { path });

    if (data && data.title && data.description) {
      const defaults = getDefaultSEO(path);
      const canonical = data.canonicalUrl || (defaults.alternates?.canonical as string | undefined) || `${SITE_URL}${path}`;
      const images = ogImages(data.ogImage || DEFAULT_OG_IMAGE, data.title);
      return {
        title: pageTitle(data.title),
        description: data.description,
        alternates: { canonical },
        openGraph: {
          title: data.title,
          description: data.description,
          url: canonical,
          type: "website",
          images,
        },
        twitter: {
          card: "summary_large_image",
          site: "@cljwebdev",
          creator: "@cljwebdev",
          title: data.title,
          description: data.description,
          images,
        },
      };
    }

    return getDefaultSEO(path);
  } catch (error) {
    console.error("Error fetching SEO from Convex:", error);
    return getDefaultSEO(path);
  }
}

function getDefaultSEO(path: string): Metadata {
  // Mirrors the live Convex rows; only used when Convex is unreachable.
  const defaults: Record<string, Metadata> = {
    "/": {
      title: "Chris Lane Jones | Senior Web Engineer, React & Rust/WASM",
      description: PERSON.description,
      alternates: { canonical: SITE_URL },
    },
    "/about": {
      title: "About Chris Lane Jones | Developer, Hiker & Community Leader",
      description:
        "From video production to web engineering, leading the Richmond WordPress meetup, and trading Virginia's mountains for Florida's beaches in 2026.",
      alternates: { canonical: `${SITE_URL}/about` },
    },
    "/blog": {
      title: "Blog: React, Rust & Web Engineering",
      description:
        "Notes on React, Next.js, Rust/WebAssembly, and WordPress from real client work and side projects, like moving an image engine into a web worker.",
      alternates: { canonical: `${SITE_URL}/blog` },
    },
    "/contact": {
      title: "Contact Chris Lane Jones | Web Development Services",
      description:
        "Get in touch about web projects, WordPress maintenance, React consulting, or speaking at a meetup. Based in Jacksonville, FL, and available for remote work.",
      alternates: { canonical: `${SITE_URL}/contact` },
    },
    "/projects": {
      title: "Projects: Apps, Tools & Client Websites",
      description:
        "Apps, tools, and client sites I've built with React, Next.js, TypeScript, Rust/WASM, and WordPress, including Image Horse, an in-browser image editor.",
      alternates: { canonical: `${SITE_URL}/projects` },
    },
    "/career-and-resume": {
      title: "Career & Resume | Chris Lane Jones, Senior Web Engineer",
      description:
        "Following the trail from video production to senior web engineer: React frameworks, open-source communities, and a decade of client work.",
      alternates: { canonical: `${SITE_URL}/career-and-resume` },
    },
    "/browser-tabs": {
      title: "Chrome Tabs I Left Open: Dev Resources",
      description:
        "The tabs I keep coming back to: React libraries, design systems, icon sets, and learning resources for web developers, sorted and searchable.",
      alternates: { canonical: `${SITE_URL}/browser-tabs` },
    },
    "/conferences": {
      title: "Conference Notes: All Things Open & More",
      description:
        "Notes and photos from the web and open-source conferences I've attended: All Things Open, WordCamp US, THAT Conference, RenderATL, and RVAJS.",
      alternates: { canonical: `${SITE_URL}/conferences` },
    },
    "/link-page": {
      title: "Links | Find Chris Lane Jones Online",
      description:
        "GitHub, Codeberg, LinkedIn, X, Bluesky, and more: all my links in one place, plus my portfolio, blog, and web development services.",
      alternates: { canonical: `${SITE_URL}/link-page` },
    },
    "/logo-page": {
      title: "About the Logo: From Mountains to Waves",
      description:
        "My logo went from a Shenandoah mountain to three ocean waves when we moved back to Florida in 2026. The story behind each design, plus downloads.",
      alternates: { canonical: `${SITE_URL}/logo-page` },
    },
    "/site-history": {
      title: "Site History: WordPress 2.1 to Next.js",
      description:
        "How chrislanejones.com changed over the years, from a Kubrick WordPress theme in 2007 to the 2026 beach redesign built on Next.js and Convex.",
      alternates: { canonical: `${SITE_URL}/site-history` },
    },
    "/site-map": {
      title: "Site Map & Changelog",
      description:
        "Every page on chrislanejones.com in one list, plus a changelog of new features, design changes, and content added to the site over time.",
      alternates: { canonical: `${SITE_URL}/site-map` },
    },
    "/wordpress-maintenance": {
      title: "WordPress Maintenance, Monthly Plan",
      description:
        "Three hours of site changes a month: copy edits, plugin updates, security scans, performance tuning, and US-based support for your WordPress site.",
      alternates: { canonical: `${SITE_URL}/wordpress-maintenance` },
    },
    "/react-maintenance": {
      title: "React App Maintenance, Monthly Plan",
      description:
        "Three hours of React app changes a month: component updates, dependency management, security audits, and performance reviews for Next.js apps.",
      alternates: { canonical: `${SITE_URL}/react-maintenance` },
    },
    "/admin-showcase": {
      title: "Admin Showcase: The Portfolio CMS",
      description:
        "A tour of the custom admin behind chrislanejones.com: pages, navigation, blog posts, media, redirects, and data reseeding on Next.js and Convex.",
      alternates: { canonical: `${SITE_URL}/admin-showcase` },
    },
  };

  const entry = defaults[path] || {
    title: "Chris Lane Jones | Senior Web Engineer",
    description: PERSON.description,
    alternates: { canonical: `${SITE_URL}${path}` },
  };

  const canonical =
    (entry.alternates as { canonical?: string })?.canonical ||
    `${SITE_URL}${path}`;
  const title = typeof entry.title === "string" ? entry.title : "Chris Lane Jones";
  const description = entry.description ?? "";

  const images = ogImages(DEFAULT_OG_IMAGE, title);
  return {
    ...entry,
    title: pageTitle(title),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      site: "@cljwebdev",
      creator: "@cljwebdev",
      title,
      description,
      images,
    },
  };
}
