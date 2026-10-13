type ProjectMedia = {
  title: string;
  description: string;
  image?: string;
  customUrl?: string;
  vercelUrl?: string;
  githubUrl?: string;
  codebergUrl?: string;
};

export const imageHorseMarketingProject = {
  title: "Image Horse - Marketing Website",
  description:
    "Marketing site for Image Horse, a photo editor that runs in your browser. Five prerendered pages cover features, pricing, architecture and a dated release log.",
  features: [
    "React 19, Vite and React Router, prerendered to static HTML per route",
    "One route table drives the nav, sitemap, canonical tags and JSON-LD",
    "Trail Log and features list generated from git history and the docs",
    "⌘K command palette that searches every page and feature",
    "Vercel config with a www redirect, real 404s and immutable asset caching",
  ],
  image: "/projects/Image-Horse-Marketing-Page.webp",
  customUrl: "https://imagehorse.app/",
};

export function isImageHorseApp(project: ProjectMedia) {
  return [
    "image horse",
    "image horse: multi image annotator and compressor",
    "multi image annotator and compressor",
    "image editor & optimizer",
  ].includes(project.title.trim().toLowerCase());
}

/** Keep refreshed project previews and destinations consistent with legacy CMS data. */
export function projectPresentation(project: ProjectMedia) {
  if (isImageHorseApp(project)) {
    return {
      title: "Image Horse: Multi Image Annotator and Compressor",
      description:
        "A browser-based image annotation and editing tool powered by Rust/WASM for pixel-level operations and React + TypeScript for the UI. Edits run in WebAssembly on your own machine and originals live in the browser's IndexedDB.",
      image: "/projects/Image-Horse-WebApp.webp",
      imageFit: "contain" as const,
      imageAspectRatio: 1799 / 1002,
      href: "https://edit.imagehorse.app/",
    };
  }
  if (project.title.trim().toLowerCase().startsWith("alembic")) {
    return {
      title: project.title,
      description: project.description,
      image: "/projects/Alembic-AI-Website.webp",
      imageFit: "contain" as const,
      imageAspectRatio: 1920 / 810,
      href: "https://getalembic.com/",
    };
  }
  return {
    title: project.title,
    description: project.description,
    image: project.image,
    imageAspectRatio: undefined,
    imageFit: project.title.trim().toLowerCase() === imageHorseMarketingProject.title.toLowerCase()
      ? "cover" as const
      : "contain" as const,
    href: [project.customUrl, project.vercelUrl, project.githubUrl, project.codebergUrl]
      .find((url) => url?.trim() && url.trim() !== "#"),
  };
}
