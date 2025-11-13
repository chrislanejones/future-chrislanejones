// src/data/logo-variants.ts

export type LogoVariant = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const logoVariants: LogoVariant[] = [
  {
    title: "Tracing Mountain",
    description:
      "The original line-art sketch with layered mountain ranges, flowing horizon lines, and careful attention to depth. This version shows the complete vision with all the detailed landscape elements.",
    image: "/site-icons/Tracing-Moutain.webp",
    imageAlt: "Detailed line-traced mountain with layered landscapes",
  },
  {
    title: "Mountain Sketch",
    description:
      "A bold, simplified outline focusing on the dominant peak. Clean and minimalist, this version captures the essential mountain shape without the sun, perfect for dark mode and high-contrast applications.",
    image: "/site-icons/Mountain-sketch.webp",
    imageAlt: "Bold outline sketch of mountain peak on dark background",
  },
  {
    title: "Main Logo",
    description:
      "The full-color hero version with rich teal and olive tones creating depth, topped with the signature bright green outline and warm orange sun. This is the complete identity piece with all layers and colors working together.",
    image: "/site-icons/Main-Logo.webp",
    imageAlt: "Full-color mountain logo with layered greens and orange sun",
  },
  {
    title: "Favicon Mountain",
    description:
      "A single-peak interpretation optimized for small sizes. The bright green outline against darker tones ensures visibility at tiny dimensions, making it ideal for browser tabs and app icons.",
    image: "/site-icons/Favicon-Mountain.webp",
    imageAlt: "Single mountain peak optimized for small favicon sizes",
  },
];
