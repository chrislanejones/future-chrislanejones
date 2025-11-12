"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* -------------------------------------------------------------------------- */
/*                                   Photo                                   */
/* -------------------------------------------------------------------------- */

const Photo = ({
  width = 300,
  height = 300,
  src,
  alt,
  direction,
  description,
  onClick,
}: PhotoProps) => (
  <motion.button
    className="relative bg-white shadow-xl cursor-pointer transform-gpu focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
    style={{
      width: width + 20,
      height: height + 60,
    }}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    aria-label={`View ${description}`}
  >
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
    <div className="px-2.5 py-2 h-12 flex items-center justify-center">
      <p className="text-gray-800 text-center leading-tight">{description}</p>
    </div>
  </motion.button>
);

/* -------------------------------------------------------------------------- */
/*                              Photo Gallery View                           */
/* -------------------------------------------------------------------------- */

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const visTimer = setTimeout(
      () => setIsVisible(true),
      animationDelay * 1000
    );
    const loadTimer = setTimeout(
      () => setIsLoaded(true),
      (animationDelay + 0.4) * 1000
    );

    return () => {
      clearTimeout(visTimer);
      clearTimeout(loadTimer);
      window.removeEventListener("resize", checkMobile);
    };
  }, [animationDelay]);

  const handlePhotoClick = (photoId: number) => {
    setClickedPhotoId(clickedPhotoId === photoId ? null : photoId);
  };

  const showNext = () => setCurrentIndex((i) => (i + 1) % photos.length);
  const showPrev = () =>
    setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);

  /* ---------------------- Photo positions for desktop ---------------------- */
  const positions = [...Array(Math.min(photos.length, 5)).keys()].map((i) => ({
    id: i + 1,
    order: i,
    x: ["-380px", "-190px", "0px", "190px", "380px"][i] || "0px",
    y: ["-10px", "5px", "-15px", "0px", "15px"][i] || "0px",
    rotate: [-8, 5, -3, 7, -5][i] || 0,
    zIndex: 50 - i * 10,
    direction: (i % 2 === 0 ? "left" : "right") as Direction,
  }));

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const photoVariants = {
    hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: any) => ({
      x: custom.x,
      y: custom.y,
      rotate: custom.rotate,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        delay: custom.order * 0.15,
      },
    }),
  };

  /* -------------------------------------------------------------------------- */
  /*                                    View                                   */
  /* -------------------------------------------------------------------------- */

  if (isMobile) {
    // Mobile slider with finger swipe gesture and polaroid styling
    const swipeConfidenceThreshold = 80; // minimum drag px before it switches
    const swipePower = (offset: number, velocity: number) =>
      Math.abs(offset) * velocity;

    const handleDragEnd = (_: any, { offset, velocity }: any) => {
      const swipe = swipePower(offset.x, velocity.x);

      if (swipe < -swipeConfidenceThreshold) {
        // Swipe left → Next photo
        setCurrentIndex((i) => (i + 1) % photos.length);
      } else if (swipe > swipeConfidenceThreshold) {
        // Swipe right → Previous photo
        setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
      }
    };

    // Generate random angles for each photo (consistent per photo)
    const mobileAngles = photos.map((_, i) => {
      const angles = [-8, 5, -3, 7, -5, -6, 4, -4, 6, -7];
      return angles[i % angles.length];
    });

    return (
      <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={photos[currentIndex].src}
            className="absolute inset-0 flex items-center justify-center p-3"
            initial={{ opacity: 0, x: 70, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: mobileAngles[currentIndex] }}
            exit={{ opacity: 0, x: -70, rotate: 0 }}
            transition={{ duration: 0.35 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
          >
            <motion.button
              className="relative bg-white shadow-xl cursor-grab active:cursor-grabbing transform-gpu focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              style={{
                width: 260,
                height: 320,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`View ${photos[currentIndex].description}`}
            >
              <div className="p-2.5 pb-0">
                <div
                  className="relative overflow-hidden"
                  style={{ width: 245, height: 245 }}
                >
                  <Image
                    src={photos[currentIndex].src}
                    alt={photos[currentIndex].alt}
                    width={250}
                    height={250}
                    className="object-cover rounded-sm"
                    sizes="250px"
                  />
                </div>
              </div>
              <div className="px-2.5 py-2 h-16 flex items-center justify-center">
                <p className="text-gray-800 text-center leading-tight text-sm">
                  {photos[currentIndex].description}
                </p>
              </div>
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* (Keep navigation buttons for accessibility) */}
        <div className="absolute bottom-3 flex justify-center gap-6">
          <Button
            variant="neutral"
            size="icon"
            round
            aria-label="Previous photo"
            onClick={() =>
              setCurrentIndex((i) => (i - 1 + photos.length) % photos.length)
            }
          >
            ‹
          </Button>
          <Button
            variant="neutral"
            size="icon"
            round
            aria-label="Next photo"
            onClick={() => setCurrentIndex((i) => (i + 1) % photos.length)}
          >
            ›
          </Button>
        </div>
      </div>
    );
  }

  // Desktop scattered polaroid layout
  return (
    <div className="relative flex h-[450px] w-full items-center justify-center">
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
          <div className="relative h-[300px] w-[280px]">
            {[...positions].reverse().map((position, index) => {
              const photoIndex = positions.length - 1 - index;
              const photo = photos[photoIndex];
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
                    width={240}
                    height={240}
                    src={photo?.src || ""}
                    alt={photo?.alt || ""}
                    direction={position.direction}
                    description={photo?.description || ""}
                    onClick={() => handlePhotoClick(position.id)}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                Gallery Drawer                              */
/* -------------------------------------------------------------------------- */

export default function GalleryDrawer({
  photos,
  title = "Gallery Drawer",
  description = "Click photos to bring them to the front",
  animationDelay = 0.2,
}: GalleryDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const adjustedDescription = isMobile
    ? "Swipe left or right to view the next photo"
    : description;

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

      <DrawerContent className="h-[72vh]">
        <div className="mx-auto w-full max-w-7xl">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-center">
              <h3>{title}</h3>
            </DrawerTitle>
            <DrawerDescription className="text-center">
              {adjustedDescription}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 pt-0 flex-1 overflow-hidden">
            <PhotoGallery photos={photos} animationDelay={animationDelay} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
