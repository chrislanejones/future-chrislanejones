"use client";

import Image from "next/image";
import Card from "../page/card";
import GalleryDrawer, { GalleryPhoto } from "../page/gallery-drawer";

const photos: GalleryPhoto[] = [
  {
    src: "/gallery/Theo-and-I.webp",
    alt: "Theo Browne and Chris at Render 2024",
    description: "Theo Browne and I at Render 2024",
  },
  {
    src: "/gallery/FCC-2017-Bold-Bean.webp",
    alt: "Coding at Bold Bean Jacksonville 2017",
    description: "Coding with Friends in Bold Bean Jax 2017",
  },
  {
    src: "/gallery/Kent-C-Dodds-Friends-and-I-at-Epic-Web.webp",
    alt: "Kent C. Dodds and friends at THAT Conference",
    description: "Kent C. Dodds, Friends, and I at the last THAT Conference",
  },
  {
    src: "/gallery/Pandemic-Office-Setup-2021.webp",
    alt: "Home office setup during pandemic",
    description: "Pandemic Office Setup 2021",
  },
  {
    src: "/gallery/Chris-Hiking.webp",
    alt: "Hiking in Shenandoah Valley",
    description: "Hiking in the Shanahdoah Valley",
  },
];

interface ImageGalleryBoxProps {
  size?:
    | "small"
    | "medium"
    | "large"
    | "wide"
    | "hero"
    | "full"
    | "page-full"
    | "page-half"
    | "page-third";
  delay?: number;
}

export default function ImageGalleryBox({
  size = "large",
  delay = 0.6,
}: ImageGalleryBoxProps) {
  return (
    <Card
      size={size}
      padding="none"
      shadow="soft"
      border="thin"
      delay={delay}
      className="overflow-hidden flex flex-col"
    >
      <div className="relative flex-1 min-h-[200px]">
        <Image
          alt="hiking"
          src="/gallery/Chris-Hiking.webp"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent"></div>

        <div className="absolute top-4 right-4 z-10">
          <GalleryDrawer
            photos={photos}
            title="Gallery Drawer"
            description="Pictures I found in random folders on my computer."
            animationDelay={0.2}
          />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl md:text-xl font-bold">Photo Gallery</h3>
        <p className="text-sm text-muted">
          summits, coding, conf friends, and more...
        </p>
      </div>
    </Card>
  );
}
