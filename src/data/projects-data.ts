// Public project snapshot from Convex. Shared by the homepage and archive
// while the live queries load, so their featured selections stay consistent.
export type Project = {
  id: string;
  title: string;
  description: string;
  features?: string[];
  image?: string;
  githubUrl?: string;
  codebergUrl?: string;
  vercelUrl?: string;
  customUrl?: string;
  featured: boolean;
  category: "app" | "website";
  order?: number;
};

export const projects: Project[] = [
  {
    "id": "kx732jjx2er7xk0z5qdcgh2br97yahez",
    "title": "Image Horse",
    "description": "A browser-based image annotation and editing tool powered by Rust/WASM for pixel-level operations and React + TypeScript for the UI. Edits run in WebAssembly on your own machine and originals live in the browser's IndexedDB.",
    "features": [
      "Rust/WASM engine for every pixel operation — crop, resize, levels, blur, text, and shapes",
      "Web Workers keep the engine and image codecs off the main thread",
      "Service worker plus IndexedDB: offline-friendly, and pixels never leave the tab",
      "50-step undo/redo, rotation/flip, and per-photo edit persistence",
      "Batch editor: bulk logo stamp, pattern rename, and crop mirroring across selected images"
    ],
    "image": "/projects/Image-Horse-App.webp",
    "githubUrl": "https://github.com/chrislanejones/rust-wasm-photo-tool",
    "codebergUrl": "https://codeberg.org/chrislanejones/rust-wasm-photo-tool",
    "vercelUrl": "https://edit.imagehorse.app/",
    "featured": true,
    "category": "app",
    "order": 1
  },
  {
    "id": "pga-golf-game",
    "title": "PGA Golf Game",
    "description": "A 3D golf game that runs in the browser. Pick a golfer (a dinosaur from Beach Blvd, a quarterback, or a big cat), aim with the arrow keys or by dragging, then hold Space and let go at the power you want. The scene, physics, obstacles, courses, and audio are all hand-written TypeScript on React Three Fiber.",
    "features": [
      "Three playable golfers, each with their own swing",
      "Aim with the arrow keys or a drag; hold Space and release for power",
      "Hand-rolled ball physics, obstacles, and course data",
      "React Three Fiber scene with instanced grass and flyover cameras",
      "State in zustand, no game engine"
    ],
    "image": "/projects/PGA-Golf-Game.webp",
    "githubUrl": "https://github.com/chrislanejones/pga-golf-game",
    "vercelUrl": "https://pga-golf-game.vercel.app/",
    "featured": false,
    "category": "app",
    "order": 2
  },
  {
    "id": "kx72swawqazwe2mbtkchg24x5h84gtd4",
    "title": "Alembic - AI Marketing Analytics Platform",
    "description": "Enterprise-grade marketing intelligence platform that uses advanced causality models and AI to provide predictive insights and measure marketing ROI across all channels.",
    "features": [
      "Next.js 14 with App Router and server-side rendering",
      "Sanity CMS integration for dynamic content management",
      "Tailwind CSS for responsive enterprise UI/UX",
      "TypeScript for type-safe development",
      "Optimized image delivery and performance"
    ],
    "image": "/projects/Get-Alembic-Website.webp",
    "customUrl": "https://getalembic.com/",
    "vercelUrl": "https://getalembic.com/",
    "featured": true,
    "category": "website",
    "order": 1
  },
  {
    "id": "vita-major-it-projects",
    "title": "VITA Major IT Projects Dashboard",
    "description": "A public dashboard for the Virginia IT Agency that tracks the Commonwealth's major IT projects: forecast budget, spend to date, status, and project type across 71 projects. Pick a quarterly list, filter by agency, status, type, or budget range, and switch between overview, charts, a data table, and project cards. I built this for VITA, where I work on the web team.",
    "features": [
      "Quarterly project lists back to November 2025",
      "Filters by status, agency, project type, and budget range",
      "Overview, charts, data table, and project card views",
      "Per-agency portfolio breakdown by project",
      "Built to the Commonwealth's accessibility standards"
    ],
    "image": "/projects/VITA-Major-IT-Projects.webp",
    "customUrl": "https://www.vita.virginia.gov/demo/major-it-projects-current-and-forecast-expenditure/",
    "featured": false,
    "category": "website",
    "order": 2
  },
  {
    "id": "kx78ppb2mjg5cgebw6zbx3d9xs7yb3hj",
    "title": "Web Crawler (Golang)",
    "description": "A performant web crawler built with Go, featuring concurrent scraping, rate limiting, and structured data extraction for SEO analysis and content auditing.",
    "features": [
      "Built in Go (Golang) for high concurrency and efficient network operations.",
      "Integrates PDF and DOCX parsing through external libraries (pdfcpu and gooxml)",
      "Features bot protection detection for systems like Cloudflare, Incapsula, and Sucuri"
    ],
    "image": "/projects/Web-Crawler-Golang-App.webp",
    "githubUrl": "https://github.com/chrislanejones",
    "featured": false,
    "category": "app",
    "order": 3
  },
  {
    "id": "kx7at5abnbheyxbx3rbp2zm2v984gvy2",
    "title": "Job Listing Plugin for WordPress with Elementor Theme",
    "description": "A comprehensive WordPress plugin that integrates with the Ashby job board API to display current job listings on your website using Elementor.",
    "features": [
      "Scheduled API data fetching at customizable times",
      "Database storage for improved performance",
      "Elementor widget for easy display",
      "Responsive card-based UI with customizable styling",
      "Admin interface for setup and management"
    ],
    "image": "/projects/Job-Listing-WordPress-Plugin.webp",
    "githubUrl": "https://github.com/chrislanejones/job-listing-plugin",
    "featured": false,
    "category": "website",
    "order": 3
  },
  {
    "id": "kx7dq0bd0sddw7pn713gfyfqqh8eckwr",
    "title": "Image Horse - Marketing Website",
    "description": "Marketing site for Image Horse, a photo editor that runs in your browser. Five prerendered pages cover features, pricing, architecture and a dated release log.",
    "features": [
      "React 19, Vite and React Router, prerendered to static HTML per route",
      "One route table drives the nav, sitemap, canonical tags and JSON-LD",
      "Trail Log and features list generated from git history and the docs",
      "⌘K command palette that searches every page and feature",
      "Vercel config with a www redirect, real 404s and immutable asset caching"
    ],
    "image": "/projects/Image-Horse-Marketing-Page.webp",
    "customUrl": "https://imagehorse.app/",
    "vercelUrl": "https://imagehorse.app/",
    "featured": true,
    "category": "website",
    "order": 4
  },
  {
    "id": "kx7fdr7an971m0vh3dg56fxdf184hzeg",
    "title": "Wheelock Communities - Real Estate Development",
    "description": "Corporate website for Wheelock Communities, showcasing master-planned communities, luxury condominiums, and resort development projects across the United States.",
    "features": [
      "WordPress with custom theme development",
      "Advanced Custom Fields for flexible content management",
      "Responsive design with mobile-first approach",
      "Project portfolio with filterable gallery",
      "Optimized image delivery and lazy loading"
    ],
    "image": "/projects/Wheelock-Communities.webp",
    "customUrl": "https://wheel.chrislanejones.com/",
    "featured": false,
    "category": "website",
    "order": 5
  }
];

export const featuredProjects = projects.filter((project) => project.featured)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
