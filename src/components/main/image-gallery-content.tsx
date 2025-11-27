"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/page/card";
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
    <>
      {/* Media section */}
      <div className="relative flex-1">
        <Image
          alt="Theo and I"
          src="/gallery/fan-gallery/Theo-and-I-at-RenderATL.webp"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/10 to-transparent" />
      </div>

      {/* Footer */}
      <CardFooter className="grid grid-cols-[1fr_auto] items-center gap-4">
        <h3 className="text-ink tracking-tight">Conference Fan Shots</h3>
        <GalleryDrawer
          photos={photos}
          title="Gallery Drawer"
          animationDelay={0.2}
        />
      </CardFooter>
    </>
  );
}
