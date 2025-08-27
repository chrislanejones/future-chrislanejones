"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Images } from "lucide-react";
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

      {/* White description area */}
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
    setClickedPhotoId(photoId);
    // Reset after animation
    setTimeout(() => setClickedPhotoId(null), 300);
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

  // Trail/hiking photos with descriptions
  const photos = [
    {
      id: 1,
      order: 0,
      x: "-320px",
      y: "15px",
      rotate: -8,
      zIndex: 50,
      direction: "left" as Direction,
      src: "/gallery/Hiking-1.webp",
      description: "Morning summit views",
    },
    {
      id: 2,
      order: 1,
      x: "-160px",
      y: "32px",
      rotate: 5,
      zIndex: 40,
      direction: "left" as Direction,
      src: "/gallery/Hiking-1.webp",
      description: "Trail marker at mile 3",
    },
    {
      id: 3,
      order: 2,
      x: "0px",
      y: "8px",
      rotate: -3,
      zIndex: 30,
      direction: "right" as Direction,
      src: "/gallery/Hiking-1.webp",
      description: "Ridge line adventure",
    },
    {
      id: 4,
      order: 3,
      x: "160px",
      y: "22px",
      rotate: 7,
      zIndex: 20,
      direction: "right" as Direction,
      src: "/gallery/Hiking-1.webp",
      description: "Sunset from the peak",
    },
    {
      id: 5,
      order: 4,
      x: "320px",
      y: "44px",
      rotate: -5,
      zIndex: 10,
      direction: "left" as Direction,
      src: "/gallery/Hiking-1.webp",
      description: "GPX track mapping",
    },
  ];

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center">
      <motion.div
        className="relative mx-auto flex w-full max-w-6xl justify-center"
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
          <div className="relative h-[280px] w-[240px]">
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
                  width={220}
                  height={220}
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

export default function ImageGalleryBox() {
  return (
    <motion.article
      className="relative md:col-span-2 md:row-span-2 card rounded-3xl overflow-hidden bg-panel"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Image
        alt="hiking"
        src="/Hiking.webp"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent"></div>
      <div className="relative p-6 flex items-end h-full">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="font-semibold text-lg">Photo Gallery</h3>
            <p className="text-sm text-ink/80">
              Sunrise summits, gadgets and oldies.
            </p>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <motion.button
                className="h-12 w-12 rounded-full bg-ink/20 hover:bg-ink/30 flex items-center justify-center transition-colors ml-4 shadow-lg p-0"
                whileTap={{ scale: 0.95 }}
                aria-label="Open photo gallery"
              >
                <Images size={20} className="text-ink" />
              </motion.button>
            </DrawerTrigger>
            <DrawerContent className="h-[50vh]">
              <div className="mx-auto w-full max-w-7xl">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-2xl font-bold">
                    Trail Gallery
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Adventures in the mountains, capturing sunrise summits and
                    weekend loops.
                  </DrawerDescription>
                  <p className="text-center text-sm text-muted mt-2">
                    Click any photo to bring it to the front. Use Tab to
                    navigate between photos.
                  </p>
                </DrawerHeader>
                <div className="px-4 pb-4 flex-1 overflow-hidden">
                  <PhotoGallery animationDelay={0.2} />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </motion.article>
  );
}
