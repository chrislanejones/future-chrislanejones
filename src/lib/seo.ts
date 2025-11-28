import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexHttpClient(convexUrl);

export async function getPageSEO(path: string): Promise<Metadata> {
  try {
    const data = await convex.query(api.seo.getSEOByPath, { path });

    if (data && data.title && data.description) {
      const metadata: Metadata = {
        title: data.title,
        description: data.description,
      };

      if (data.canonicalUrl) {
        metadata.alternates = {
          canonical: data.canonicalUrl,
        };
      }

      return metadata;
    }

    console.log(`No SEO data found for path: ${path}, using defaults`);
    return getDefaultSEO(path);
  } catch (error) {
    console.error("Error fetching SEO from Convex:", error);
    return getDefaultSEO(path);
  }
}

function getDefaultSEO(path: string): Metadata {
  const defaults: Record<string, Metadata> = {
    "/": {
      title: "Chris Lane Jones | React & WordPress Developer in Virginia",
      description:
        "Full-stack developer specializing in Next.js, React, and WordPress. Building modern web applications for businesses and government agencies from Virginia.",
      alternates: { canonical: "https://chrislanejones.com" }, // Corrected for defaults
    },
    "/about": {
      title: "About Chris Jones | Developer, Hiker & Community Leader",
      description:
        "From video production to web development - my journey through React frameworks, leading Richmond's WordPress meetup, and life in Virginia's Shenandoah Mountains.",
      alternates: { canonical: "https://chrislanejones.com/about" }, // Corrected for defaults
    },
    "/blog": {
      title: "Blog | Web Development, React & WordPress Insights",
      description:
        "Articles and tutorials about web development, React, Next.js, WordPress, and building modern web applications. Tips, tricks, and lessons learned from the field.",
      alternates: { canonical: "https://chrislanejones.com/blog" }, // Corrected for defaults
    },
    "/contact": {
      title: "Contact Chris Lane Jones | Web Development Services",
      description:
        "Get in touch for web development projects, WordPress maintenance, React consulting, or speaking opportunities. Available for freelance work and collaborations.",
      alternates: { canonical: "https://chrislanejones.com/contact" }, // Corrected for defaults
    },
    "/projects": {
      title: "Web Development Projects | Next.js, React & WordPress Sites",
      description:
        "Full-stack projects featuring Next.js applications, WordPress plugins, image editors, and web tools. View my work with TypeScript, React, and modern frameworks.",
      alternates: { canonical: "https://chrislanejones.com/projects" }, // Corrected for defaults
    },
    "/career": {
      title: "Career & Experience | Chris Lane Jones Web Developer",
      description:
        "10+ years from video editor to senior developer. Experience with React, Next.js, WordPress, and building solutions for Fortune 500 companies and government agencies.",
      alternates: { canonical: "https://chrislanejones.com/career" }, // Corrected for defaults
    },
    "/browser-tabs": {
      title: "Developer Resources & Tools | Curated Web Dev Bookmarks",
      description:
        "My collection of essential web development resources: React libraries, design tools, icon sets, UI frameworks, and learning materials I reference daily.",
      alternates: { canonical: "https://chrislanejones.com/browser-tabs" }, // Corrected for defaults
    },
    "/conferences": {
      title: "Tech Conferences Attended | All Things Open, RenderATL & More",
      description:
        "Notes from web development conferences including All Things Open, WordCamp US, THAT Conference, RenderATL, and RVAJS. Insights from the JavaScript community.",
      alternates: { canonical: "https://chrislanejones.com/conferences" }, // Corrected for defaults
    },
    "/link-page": {
      title: "Connect With Chris Lane Jones | Social Media & Portfolio Links",
      description:
        "Find me on GitHub, LinkedIn, Twitter/X, and CodePen. Access my portfolio, blog posts, WordPress services, and web development resources all in one place.",
      alternates: { canonical: "https://chrislanejones.com/link-page" }, // Corrected for defaults
    },
    "/logo-page": {
      title: "Mountain Logo Design Story | Chris Lane Jones Brand Identity",
      description:
        "The meaning behind my mountain logo design - representing the journey through code and trails. Explore different logo variations and design philosophy.",
      alternates: { canonical: "https://chrislanejones.com/logo-page" }, // Corrected for defaults
    },
    "/site-history": {
      title: "Portfolio Evolution | From WordPress 2.1 to Next.js React App",
      description:
        "18 years of website evolution: from the Kubrick WordPress theme in 2007 to modern Next.js. See how my portfolio transformed alongside web technology.",
      alternates: { canonical: "https://chrislanejones.com/site-history" }, // Corrected for defaults
    },
    "/site-map": {
      title: "Site Map | Chris Lane Jones Portfolio Navigation",
      description:
        "Complete site map of my web development portfolio. Browse all pages including projects, blog posts, services, conference notes, and developer resources.",
      alternates: { canonical: "https://chrislanejones.com/site-map" }, // Corrected for defaults
    },
    "/wordpress-maintenance": {
      title: "WordPress Maintenance Services | Monthly Action Plan",
      description:
        "Comprehensive WordPress maintenance including security scans, plugin updates, performance optimization, and technical support. Three hours of site changes monthly with 99.9% uptime guarantee.",
      alternates: {
        canonical: "https://chrislanejones.com/wordpress-maintenance",
      }, // Corrected for defaults
    },
    "/react-maintenance": {
      title: "React Application Maintenance | Monthly Support & Optimization",
      description:
        "Expert React app maintenance with dependency updates, security monitoring, performance optimization, and debugging. Three hours of consulting monthly for Next.js and React applications.",
      alternates: { canonical: "https://chrislanejones.com/react-maintenance" }, // Corrected for defaults
    },
  };

  return (
    defaults[path] || {
      title: "Chris Lane Jones — Dev & Hiker",
      description: "Building modern web applications.",
    }
  );
}
