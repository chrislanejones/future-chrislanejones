"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

type LogoVariant = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const logoVariants: LogoVariant[] = [
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

function LogoCard({ variant, index }: { variant: LogoVariant; index: number }) {
  return (
    <Card
      size="page-half"
      className="overflow-hidden"
      delay={0.1 + index * 0.1}
    >
      <div className="flex flex-col h-full">
        {/* Logo Display Area */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden min-h-[280px] flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-[200px] max-h-[200px]">
            <Image
              src={variant.image}
              alt={variant.imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="mb-3">{variant.title}</h3>
          <p className="text-muted leading-relaxed">
            {variant.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

const LogoPage: React.FC = () => {
  return (
    <main className="site-container py-12">
      <Banner
        title="About the Logo"
        breadcrumbPage="Logo"
        description=" The mountain in my logo represents more than just a visual
            element—it's a symbol of the journey. Each peak conquered in code,
            each valley navigated through debugging, mirrors the trails I hike
            in the Shenandoah Mountains."
      />

      <FullWidthLayout>
        {/* Logo Variants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logoVariants.map((variant, index) => (
            <LogoCard key={variant.title} variant={variant} index={index} />
          ))}
        </div>
      </FullWidthLayout>
    </main>
  );
};

export default LogoPage;
