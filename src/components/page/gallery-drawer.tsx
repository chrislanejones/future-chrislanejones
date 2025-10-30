"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Images } from "lucide-react";

type Direction = "left" | "right";

export type GalleryPhoto = {
  src: string;
  alt: string;
  description: string;
  width?: number;
  height?: number;
};

interface PhotoProps extends GalleryPhoto {
  direction: Direction;
  onClick: () => void;
}

interface GalleryDrawerProps {
  photos: GalleryPhoto[];
  title?: string;
  description?: string;
  animationDelay?: number;
}

// Photo component - styled as polaroid
const Photo = ({
  width = 300,
  height = 300,
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
        <p className="text-gray-800 text-xs text-center leading-tight font-medium">
          {description}
        </p>
      </div>
    </motion.button>
  );
};

// Photo Gallery component
const PhotoGallery = ({
  photos,
  animationDelay = 0.5,
}: {
  photos: GalleryPhoto[];
  animationDelay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clickedPhotoId, setClickedPhotoId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      (animationDelay + 0.4) * 1000
    );

    return () => {
      window.removeEventListener("resize", checkMobile);
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

  // Mobile positions for 2x2 grid (showing all photos) - no rotation for clean grid
  const getMobilePositions = () => {
    const positions = [];
    const maxPhotos = Math.min(photos.length, 4); // Show max 4 on mobile

    for (let i = 0; i < maxPhotos; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      positions.push({
        id: i + 1,
        order: i,
        x: col === 0 ? "-90px" : "90px",
        y: row === 0 ? "-90px" : "90px",
        rotate: 0,
        zIndex: 50 - i * 10,
        direction: "left" as Direction,
      });
    }
    return positions;
  };

  // Desktop positions - scattered layout
  const getDesktopPositions = () => {
    const positions = [];
    const maxPhotos = Math.min(photos.length, 5); // Show max 5 on desktop
    const xPositions = ["-400px", "-200px", "0px", "200px", "400px"];
    const yPositions = ["15px", "32px", "8px", "22px", "44px"];
    const rotations = [-8, 5, -3, 7, -5];

    for (let i = 0; i < maxPhotos; i++) {
      positions.push({
        id: i + 1,
        order: i,
        x: xPositions[i] || "0px",
        y: yPositions[i] || "0px",
        rotate: rotations[i] || 0,
        zIndex: 50 - i * 10,
        direction: (i % 2 === 0 ? "left" : "right") as Direction,
      });
    }
    return positions;
  };

  const photoPositions = isMobile
    ? getMobilePositions()
    : getDesktopPositions();

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center">
      <motion.div
        className="relative mx-auto flex w-full max-w-7xl justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {isMobile ? (
          // Mobile: Simple 2x2 grid layout
          <motion.div
            className="grid grid-cols-2 gap-4 p-4"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            {photoPositions.map((position, index) => (
              <motion.div
                key={position.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      delay: position.order * 0.15,
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  },
                }}
                className={clickedPhotoId === position.id ? "z-50" : ""}
              >
                <Photo
                  width={140}
                  height={140}
                  src={photos[index]?.src || ""}
                  alt={photos[index]?.alt || ""}
                  direction={position.direction}
                  description={photos[index]?.description || ""}
                  onClick={() => handlePhotoClick(position.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Desktop: Original scattered layout
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[360px] w-[320px]">
              {[...photoPositions].reverse().map((position, index) => {
                const photoIndex = photoPositions.length - 1 - index;
                return (
                  <motion.div
                    key={position.id}
                    className="absolute left-0 top-0"
                    style={{
                      zIndex:
                        clickedPhotoId === position.id ? 100 : position.zIndex,
                    }}
                    variants={photoVariants}
                    custom={{
                      x: position.x,
                      y: position.y,
                      rotate: position.rotate,
                      order: position.order,
                    }}
                    animate={
                      clickedPhotoId === position.id
                        ? {
                            x: position.x,
                            y: position.y,
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
                      src={photos[photoIndex]?.src || ""}
                      alt={photos[photoIndex]?.alt || ""}
                      direction={position.direction}
                      description={photos[photoIndex]?.description || ""}
                      onClick={() => handlePhotoClick(position.id)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Main Gallery Drawer component
export default function GalleryDrawer({
  photos,
  title = "Gallery Drawer",
  description = "Click photos to bring them to the front",
  animationDelay = 0.2,
}: GalleryDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="neutral"
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
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 flex-1 overflow-hidden">
            <PhotoGallery photos={photos} animationDelay={animationDelay} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
