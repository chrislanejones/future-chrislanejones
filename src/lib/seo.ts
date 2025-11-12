import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexHttpClient(convexUrl);

export async function getPageSEO(path: string): Promise<Metadata> {
  try {
    const data = await convex.query(api.seo.getSEOByPath, { path });

    if (data && data.title && data.description) {
      return {
        title: data.title,
        description: data.description,
      };
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
    },
    "/about": {
      title: "About Chris Jones | Developer, Hiker & Community Leader",
      description:
        "From video production to web development - my journey through React frameworks, leading Richmond's WordPress meetup, and life in Virginia's Shenandoah Mountains.",
    },
    "/blog": {
      title: "Blog | Web Development, React & WordPress Insights",
      description:
        "Articles and tutorials about web development, React, Next.js, WordPress, and building modern web applications. Tips, tricks, and lessons learned from the field.",
    },
    "/contact": {
      title: "Contact Chris Lane Jones | Web Development Services",
      description:
        "Get in touch for web development projects, WordPress maintenance, React consulting, or speaking opportunities. Available for freelance work and collaborations.",
    },
    "/projects": {
      title: "Web Development Projects | Next.js, React & WordPress Sites",
      description:
        "Full-stack projects featuring Next.js applications, WordPress plugins, image editors, and web tools. View my work with TypeScript, React, and modern frameworks.",
    },
    "/career": {
      title: "Career & Experience | Chris Lane Jones Web Developer",
      description:
        "10+ years from video editor to senior developer. Experience with React, Next.js, WordPress, and building solutions for Fortune 500 companies and government agencies.",
    },
    "/browser-tabs": {
      title: "Developer Resources & Tools | Curated Web Dev Bookmarks",
      description:
        "My collection of essential web development resources: React libraries, design tools, icon sets, UI frameworks, and learning materials I reference daily.",
    },
    "/conferences": {
      title: "Tech Conferences Attended | All Things Open, RenderATL & More",
      description:
        "Notes from web development conferences including All Things Open, WordCamp US, THAT Conference, RenderATL, and RVAJS. Insights from the JavaScript community.",
    },
    "/link-page": {
      title: "Connect With Chris Lane Jones | Social Media & Portfolio Links",
      description:
        "Find me on GitHub, LinkedIn, Twitter/X, and CodePen. Access my portfolio, blog posts, WordPress services, and web development resources all in one place.",
    },
    "/logo-page": {
      title: "Mountain Logo Design Story | Chris Lane Jones Brand Identity",
      description:
        "The meaning behind my mountain logo design - representing the journey through code and trails. Explore different logo variations and design philosophy.",
    },
    "/site-history": {
      title: "Portfolio Evolution | From WordPress 2.1 to Next.js React App",
      description:
        "18 years of website evolution: from the Kubrick WordPress theme in 2007 to modern Next.js. See how my portfolio transformed alongside web technology.",
    },
    "/site-map": {
      title: "Site Map | Chris Lane Jones Portfolio Navigation",
      description:
        "Complete site map of my web development portfolio. Browse all pages including projects, blog posts, services, conference notes, and developer resources.",
    },
    "/wordpress-maintenance": {
      title: "WordPress Maintenance Services | Monthly Action Plan",
      description:
        "Comprehensive WordPress maintenance including security scans, plugin updates, performance optimization, and technical support. Three hours of site changes monthly with 99.9% uptime guarantee.",
    },
    "/react-maintenance": {
      title: "React Application Maintenance | Monthly Support & Optimization",
      description:
        "Expert React app maintenance with dependency updates, security monitoring, performance optimization, and debugging. Three hours of consulting monthly for Next.js and React applications.",
    },
  };

  return (
    defaults[path] || {
      title: "Chris Lane Jones — Dev & Hiker",
      description: "Building modern web applications.",
    }
  );
}