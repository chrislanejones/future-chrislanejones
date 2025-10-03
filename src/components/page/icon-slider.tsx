"use client";

import { AnimatePresence, motion, wrap } from "framer-motion";
import { useState, SVGProps, forwardRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export type SliderItem = {
  name: string;
  logo: string;
  url: string;
  year?: string;
  location?: string;
};

type ItemGroupProps = {
  items: SliderItem[];
  direction: number;
  isMobile: boolean;
  variant: "large-block" | "small-block" | "no-filter";
};

interface IconSliderProps {
  items: SliderItem[];
  itemsPerGroup?: number;
  gridCols?: 2 | 3 | 4 | 6;
  gridRows?: 1 | 2 | 3;
  title?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  variant?: "large-block" | "small-block" | "no-filter";
  className?: string;
}

const ItemGroup = forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ items, direction, isMobile, variant }, ref) => {
    // Determine image filter classes based on variant
    const getImageClasses = () => {
      if (variant === "no-filter") {
        return "object-contain w-full h-full max-w-[180px] max-h-[126px] transition-all duration-300";
      }
      return `
        object-contain w-full h-full max-w-[180px] max-h-[126px]
        transition-all duration-300
        brightness-0 dark:brightness-0 dark:invert
        group-hover:filter-none
      `;
    };

    return (
      <motion.div
        ref={ref}
        className={`absolute inset-0 grid ${
          isMobile ? "grid-cols-2 grid-rows-2" : "grid-cols-3 grid-rows-2"
        } gap-6 p-4`}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        }}
      >
        {items.map((item: SliderItem, index: number) => {
          // Skip empty slots
          if (!item.name || !item.logo) {
            return (
              <div
                key={`empty-${index}`}
                className="flex items-center justify-center"
              />
            );
          }

          return (
            <motion.a
              key={`${item.name}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center relative transition-all duration-300 
             opacity-90 hover:opacity-100 bg-[color:var(--color-base)] 
             hover:bg-[color:var(--color-muted-accent)] rounded-lg p-3 border border-transparent hover:border-accent"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 1, scale: 0.9 }}
              animate={{
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" },
              }}
            >
              <Image
                src={item.logo}
                alt={`${item.name} logo`}
                width={180}
                height={126}
                className={getImageClasses()}
                sizes="160px"
              />
            </motion.a>
          );
        })}
      </motion.div>
    );
  }
);

ItemGroup.displayName = "ItemGroup";

export default function IconSlider({
  items,
  itemsPerGroup = 6,
  gridCols = 3,
  gridRows = 2,
  title,
  showNavigation = true,
  showPagination = true,
  variant = "large-block",
  className = "",
}: IconSliderProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Adjust items per group based on mobile
  const effectiveItemsPerGroup = isMobile ? 4 : itemsPerGroup;

  // Create groups
  const itemGroups: SliderItem[][] = [];
  for (let i = 0; i < items.length; i += effectiveItemsPerGroup) {
    const group = items.slice(i, i + effectiveItemsPerGroup);
    // Pad group with empty slots if needed
    while (group.length < effectiveItemsPerGroup) {
      group.push({
        name: "",
        logo: "",
        url: "#",
      });
    }
    itemGroups.push(group);
  }

  function setSlide(newDirection: 1 | -1) {
    const nextGroup = wrap(0, itemGroups.length, selectedGroup + newDirection);
    setSelectedGroup(nextGroup);
    setDirection(newDirection);
  }

  const shouldShowNavigation = showNavigation && itemGroups.length > 1;
  const shouldShowPagination = showPagination && itemGroups.length > 1;
  const currentItems =
    itemGroups[selectedGroup] || items.slice(0, effectiveItemsPerGroup);

  return (
    <div className={className}>
      {title && (
        <h2 className="text-center font-semibold text-lg mb-4">{title}</h2>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Left Arrow */}
        {shouldShowNavigation ? (
          <Button
            variant="neutral"
            size="icon"
            round={true}
            aria-label="Previous"
            onClick={() => setSlide(-1)}
          >
            <ArrowLeft />
          </Button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex-1 relative h-80 overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <ItemGroup
              key={selectedGroup}
              items={currentItems}
              direction={direction}
              isMobile={isMobile}
              variant={variant}
            />
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        {shouldShowNavigation ? (
          <Button
            variant="neutral"
            size="icon"
            round={true}
            aria-label="Next"
            onClick={() => setSlide(1)}
          >
            <ArrowRight />
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Pagination dots */}
      {shouldShowPagination && (
        <div className="flex justify-center gap-2 mt-4">
          {itemGroups.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > selectedGroup ? 1 : -1);
                setSelectedGroup(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === selectedGroup
                  ? "bg-ink scale-110"
                  : "bg-gray-800/50 dark:bg-gray-300/50 hover:bg-gray-800/70 dark:hover:bg-gray-300/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Icons
const iconsProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function ArrowLeft() {
  return (
    <svg {...iconsProps}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg {...iconsProps}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
