"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Images } from "lucide-react";
import Card from "../page/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Direction = "left" | "right";

interface PhotoProps {
  width: number;
  height: number;
  src: string;
  alt: string;
  direction: Direction;
  description: string;
  onClick: () => void;
}

// Photo component - now styled as polaroid
const Photo = ({
  width,
  height,
  src,
  alt,
  direction,
  description,
  onClick,
}: PhotoProps) => {
  return (
    <motion.button
      className="relative bg-white shadow-xl cursor-pointer transform-gpu focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      style={{
        width: width + 20,
        height: height + 60,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`View ${description} - click to bring to front`}
    >
      {/* Photo area */}
      <div className="p-2.5 pb-0">
        <div
          className="relative overflow-hidden"
          style={{ width: width - 5, height: height - 40 }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="object-cover rounded-sm"
            sizes={`${width}px`}
          />
        </div>
      </div>

      {/* White description area at bottom like a real Polaroid */}
      <div className="px-2.5 py-2 h-12 flex items-center justify-center">
        <p
          className="text-gray-800 text-xs text-center leading-tight"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          {description}
        </p>
      </div>
    </motion.button>
  );
};

// Photo Gallery component
const PhotoGallery = ({
  animationDelay = 0.5,
}: {
  animationDelay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clickedPhotoId, setClickedPhotoId] = useState<number | null>(null);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = setTimeout(() => {
      setIsLoaded(true);
    }, (animationDelay + 0.4) * 1000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  // Handle photo click to bring to front
  const handlePhotoClick = (photoId: number) => {
    // Toggle selection - if already clicked, unclick; otherwise click it
    if (clickedPhotoId === photoId) {
      setClickedPhotoId(null);
    } else {
      setClickedPhotoId(photoId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    }),
    visible: (custom: any) => ({
      x: custom.x,
      y: custom.y,
      rotate: custom.rotate,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  // Trail/hiking photos with descriptions - adjusted positions for larger photos
  const photos = [
    {
      id: 1,
      order: 0,
      x: "-400px",
      y: "15px",
      rotate: -8,
      zIndex: 50,
      direction: "left" as Direction,
      src: "/gallery/Theo-and-I.webp",
      description: "Theo Browne and I at Render 2024",
    },
    {
      id: 2,
      order: 1,
      x: "-200px",
      y: "32px",
      rotate: 5,
      zIndex: 40,
      direction: "left" as Direction,
      src: "/gallery/FCC-2017-Bold-Bean.webp",
      description: "Coding with Friends in Bold Bean Jax 2017",
    },
    {
      id: 3,
      order: 2,
      x: "0px",
      y: "8px",
      rotate: -3,
      zIndex: 30,
      direction: "right" as Direction,
      src: "/gallery/Kent-C-Dodds-Friends-and-I-at-Epic-Web.webp",
      description: "Kent C. Dodds, Friends, and I at the last THAT Conference",
    },
    {
      id: 4,
      order: 3,
      x: "200px",
      y: "22px",
      rotate: 7,
      zIndex: 20,
      direction: "right" as Direction,
      src: "/gallery/Pandemic-Office-Setup-2021.webp",
      description: "Pandemic Office Setup 2021",
    },
    {
      id: 5,
      order: 4,
      x: "400px",
      y: "44px",
      rotate: -5,
      zIndex: 10,
      direction: "left" as Direction,
      src: "/gallery/Chris-Hiking.webp",
      description: "Hiking in the Shanahdoah Valley",
    },
  ];

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center">
      <motion.div
        className="relative mx-auto flex w-full max-w-7xl justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="relative flex w-full justify-center"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <div className="relative h-[360px] w-[320px]">
            {[...photos].reverse().map((photo) => (
              <motion.div
                key={photo.id}
                className="absolute left-0 top-0"
                style={{
                  zIndex: clickedPhotoId === photo.id ? 100 : photo.zIndex,
                }}
                variants={photoVariants}
                custom={{
                  x: photo.x,
                  y: photo.y,
                  rotate: photo.rotate,
                  order: photo.order,
                }}
                animate={
                  clickedPhotoId === photo.id
                    ? {
                        x: photo.x,
                        y: photo.y,
                        rotate: 0,
                        scale: 1.05,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        },
                      }
                    : undefined
                }
              >
                <Photo
                  width={300}
                  height={300}
                  src={photo.src}
                  alt="Hiking trail photo"
                  direction={photo.direction}
                  description={photo.description}
                  onClick={() => handlePhotoClick(photo.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

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
      delay={delay}
      padding="none"
      className="relative overflow-hidden"
    >
      <Image
        alt="hiking"
        src="/gallery/Chris-Hiking.webp"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent"></div>

      {/* Gallery Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="base"
              size="icon"
              round
              aria-label="Open photo gallery"
            >
              <Images size={20} className="text-ink" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[60vh]">
            <div className="mx-auto w-full max-w-7xl">
              <DrawerHeader>
                <DrawerTitle className="text-center text-2xl font-bold">
                  Gallery Drawer
                </DrawerTitle>
                <DrawerDescription className="text-center">
                  Pictures I found in random folders on my computer.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4 flex-1 overflow-hidden">
                <PhotoGallery animationDelay={0.2} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="relative p-6 flex items-end h-full">
        <div>
          <h3 className="font-bold text-lg">Photo Gallery</h3>
          <p className="text-sm text-ink/80">
            summits, coding, conf friends, and more...
          </p>
        </div>
      </div>
    </Card>
  );
}
