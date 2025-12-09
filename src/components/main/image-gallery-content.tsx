// src/components/main/image-gallery-content.tsx
"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import GalleryDrawer, { GalleryPhoto } from "@/components/page/gallery-drawer";

const photos: GalleryPhoto[] = [
  {
    src: "/gallery/fan-gallery/Theo-and-I-at-RenderATL.webp",
    alt: "Theo Browne and Chris at Render 2024",
    description: "Theo Browne and I at Render 2024",
  },
  {
    src: "/gallery/fan-gallery/Jason-Lengstorf-and-I.webp",
    alt: "Jason Lengstorf and I at Epic Web Conf 2025",
    description: "Jason Lengstorf and I at Epic Web Conf 2025",
  },
  {
    src: "/gallery/fan-gallery/Group-Photo-With-Kent-C-Dodds-at-THAT-Conf.webp",
    alt: "Group Photo with Kent C. Dodds at THAT Conf WI 2024",
    description: "Group Photo with Kent C. Dodds at THAT Conf WI 2024",
  },
  {
    src: "/gallery/fan-gallery/Kevin-Powell-And-I-THAT-Conf.webp",
    alt: "Kevin Powell And I THAT Conference WI 2025",
    description: "Kevin Powell And I THAT Conf WI 2025",
  },
  {
    src: "/gallery/fan-gallery/ChrisSev-Avindra-and-I-ATO-2024.webp",
    alt: "Chris Sev, Avindra Fernando, and I at ATO 2024",
    description: "Chris Sev, Avindra Fernando, and I at ATO 2024",
  },
];

export default function ImageGalleryContent() {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative flex-1 min-h-0">
        <Image
          src={photos[0].src}
          alt={photos[0].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/10 to-transparent" />
      </div>

      {/* Footer */}
      <div className="p-4 shrink-0 flex items-center justify-between gap-4 backdrop-blur-sm">
        <h3 className="text-ink tracking-tight truncate">
          Conference Fan Shots
        </h3>
        <GalleryDrawer photos={photos} title="Gallery" animationDelay={0.2} />
      </div>
    </div>
  );
}
