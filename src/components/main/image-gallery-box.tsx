"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Images, X } from "lucide-react";

type Direction = "left" | "right";

interface PhotoProps {
  width: number;
  height: number;
  src: string;
  alt: string;
  direction: Direction;
}

// Photo component (similar to the one referenced)
const Photo = ({ width, height, src, alt, direction }: PhotoProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl ring-2 ring-white/10 shadow-lg">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        sizes={`${width}px`}
      />
    </div>
  );
};

// Photo Gallery component (adapted from the referenced code)
const PhotoGallery = ({
  animationDelay = 0.5,
}: {
  animationDelay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // First make the container visible with a fade-in
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    // Then start the photo animations after a short delay
    const animationTimer = setTimeout(() => {
      setIsLoaded(true);
    }, (animationDelay + 0.4) * 1000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  // Animation variants for the container
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

  // Animation variants for each photo
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
      rotate: 0,
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

  // Trail/hiking photos - replace these with your actual hiking photos
  const photos = [
    {
      id: 1,
      order: 0,
      x: "-320px",
      y: "15px",
      zIndex: 50,
      direction: "left" as Direction,
      src: "/gallery/Hiking-1.webp", // Replace with your hiking photos
    },
    {
      id: 2,
      order: 1,
      x: "-160px",
      y: "32px",
      zIndex: 40,
      direction: "left" as Direction,
      src: "/gallery/Hiking-2.webp",
    },
    {
      id: 3,
      order: 2,
      x: "0px",
      y: "8px",
      zIndex: 30,
      direction: "right" as Direction,
      src: "/gallery/Old-times.webp",
    },
    {
      id: 4,
      order: 3,
      x: "160px",
      y: "22px",
      zIndex: 20,
      direction: "right" as Direction,
      src: "/gallery/Hiking-1.webp",
    },
    {
      id: 5,
      order: 4,
      x: "320px",
      y: "44px",
      zIndex: 10,
      direction: "left" as Direction,
      src: "/gallery/Hiking-2.webp",
    },
  ];

  return (
    <div className="relative flex h-[350px] w-full items-center justify-center">
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
          <div className="relative h-[220px] w-[220px]">
            {[...photos].reverse().map((photo) => (
              <motion.div
                key={photo.id}
                className="absolute left-0 top-0"
                style={{ zIndex: photo.zIndex }}
                variants={photoVariants}
                custom={{
                  x: photo.x,
                  y: photo.y,
                  order: photo.order,
                }}
              >
                <Photo
                  width={220}
                  height={220}
                  src={photo.src}
                  alt="Hiking trail photo"
                  direction={photo.direction}
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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const openGallery = () => setIsGalleryOpen(true);
  const closeGallery = () => setIsGalleryOpen(false);

  return (
    <>
      {/* Main Card */}
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
              <h3 className="font-semibold text-lg">Trail time</h3>
              <p className="text-sm text-ink/80">
                Weekend loops, sunrise summits, and mapping GPX tracks.
              </p>
            </div>
            <motion.button
              onClick={openGallery}
              className="h-12 w-12 rounded-full bg-accent/90 hover:bg-accent flex items-center justify-center transition-colors ml-4 shadow-lg"
              whileTap={{ scale: 0.95 }}
              aria-label="Open photo gallery"
            >
              <Images size={20} className="text-on-accent" />
            </motion.button>
          </div>
        </div>
      </motion.article>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-base/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeGallery}
          >
            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-7xl mx-4 p-8 rounded-3xl bg-panel/95 backdrop-blur-md shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeGallery}
                className="absolute top-6 right-6 h-10 w-10 rounded-full bg-ink/20 hover:bg-ink/30 flex items-center justify-center transition-colors z-10"
                whileTap={{ scale: 0.9 }}
                aria-label="Close gallery"
              >
                <X size={20} className="text-ink" />
              </motion.button>

              {/* Gallery Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-ink mb-2">
                  Trail Gallery
                </h2>
                <p className="text-muted">
                  Adventures in the mountains, capturing sunrise summits and
                  weekend loops.
                </p>
              </div>

              {/* Photo Gallery */}
              <PhotoGallery animationDelay={0.2} />

              {/* Gallery Footer */}
              <div className="text-center mt-8">
                <p className="text-muted text-sm">
                  Follow along for more trail adventures and GPX mapping
                  projects.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
