// src/data/projects-data.ts
// Images can use either:
// - Local paths: "/projects/image-name.webp"
// - UploadThing URLs: "https://utfs.io/f/..." (upload via Admin > Media)

export type Project = {
  id: string;
  title: string;
  description: string;
  image?: string;
  githubUrl?: string;
  codebergUrl?: string;
  vercelUrl?: string;
  customUrl?: string;
  featured: boolean;
  category: "app" | "website";
  order?: number;
};

// Featured projects for the home page
export const featuredProjects: Project[] = [
  {
    id: "1",
    title: "Image Editor & Optimizer",
    description:
      "Next.js + TanStack app for cropping, painting, blur tools, and batch processing. Optimized for performance with Tailwind and Plotly for data visualization.",
    image: "/projects/Image-Horse-App.webp",
    githubUrl: "https://github.com/chrislanejones/multi-image-compress-and-edit",
    featured: true,
    category: "app",
    order: 1,
  },
  {
    id: "2",
    title: "Web Crawler (Golang)",
    description:
      "A performant web crawler built with Go, featuring concurrent scraping, rate limiting, and structured data extraction for SEO analysis and content auditing.",
    image: "/projects/Web-Crawler-Golang-App.webp",
    githubUrl: "https://github.com/chrislanejones/web-crawler-golang",
    featured: true,
    category: "app",
    order: 2,
  },
  {
    id: "3",
    title: "MPC Vim Filter Tool",
    description:
      "CLI tool for filtering and managing Music Player Daemon playlists with Vim-style keybindings. Built for keyboard-driven workflow efficiency.",
    image: "/projects/MPC-Vim-Filter-Tool.webp",
    githubUrl: "https://github.com/chrislanejones/mpc-vim-filter",
    featured: true,
    category: "app",
    order: 3,
  },
];

// All projects
export const projects: Project[] = [
  ...featuredProjects,
  // Add additional non-featured projects below
];
