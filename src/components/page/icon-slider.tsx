"use client";

import { AnimatePresence, motion, wrap } from "framer-motion";
import { useState, SVGProps, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import IconBlock from "./icon-block";
import Image from "next/image";

export type SliderItem = {
  name: string;
  logo: string;
  url?: string;
  year?: string;
  location?: string;
};

interface IconSliderProps {
  items: SliderItem[];
  itemsPerGroup?: number;
  gridCols?: 2 | 3 | 4 | 6;
  gridRows?: 1 | 2 | 3;
  title?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  variant?: "large-block" | "small-block";
  className?: string;
}

type SliderGroupProps = {
  items: SliderItem[];
  direction: number;
  gridCols: number;
  gridRows: number;
  variant: "large-block" | "small-block";
};

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

  // Create groups
  const itemGroups: SliderItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerGroup) {
    const group = items.slice(i, i + itemsPerGroup);
    // Pad group with empty slots if needed to maintain grid structure
    while (group.length < itemsPerGroup) {
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
    itemGroups[selectedGroup] || items.slice(0, itemsPerGroup);

  return (
    <div className={className}>
      {title && (
        <h2 className="text-center font-semibold text-lg mb-4">{title}</h2>
      )}

      <div className="flex items-center justify-between gap-4">
        {shouldShowNavigation ? (
          <Button
            variant="neutral"
            size="icon"
            round
            className="h-12 w-12"
            aria-label="Previous"
            onClick={() => setSlide(-1)}
          >
            <ArrowLeft />
          </Button>
        ) : (
          <div className="w-12" />
        )}

        <div className="flex-1 relative h-80 overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <SliderGroup
              key={selectedGroup}
              items={currentItems}
              direction={direction}
              gridCols={gridCols}
              gridRows={gridRows}
              variant={variant}
            />
          </AnimatePresence>
        </div>

        {shouldShowNavigation ? (
          <Button
            variant="neutral"
            size="icon"
            round
            className="h-12 w-12"
            aria-label="Next"
            onClick={() => setSlide(1)}
          >
            <ArrowRight />
          </Button>
        ) : (
          <div className="w-12" />
        )}
      </div>

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

const SliderGroup = forwardRef<HTMLDivElement, SliderGroupProps>(
  ({ items, direction, gridCols, gridRows, variant }, ref) => {
    const gridColsClass = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
    }[gridCols];

    const gridRowsClass = {
      1: "grid-rows-1",
      2: "grid-rows-2",
      3: "grid-rows-3",
    }[gridRows];

    return (
      <motion.div
        ref={ref}
        className={`absolute inset-0 grid ${gridColsClass} ${gridRowsClass} gap-6 p-4`}
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
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 1, scale: 0.9 }}
              animate={{
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" },
              }}
              className="relative"
            >
              <IconBlock
                variant={variant}
                href={item.url && item.url !== "#" ? item.url : undefined}
                label=""
                className="h-full"
              >
                {variant === "large-block" ? (
                  <Image
                    src={item.logo}
                    alt={`${item.name} logo`}
                    width={180}
                    height={126}
                    className="object-contain w-full h-full max-w-[180px] max-h-[126px] transition-all duration-300 brightness-0 dark:brightness-0 dark:invert group-hover:filter-none"
                    sizes="160px"
                  />
                ) : (
                  <Image
                    src={item.logo}
                    alt={`${item.name} logo`}
                    width={80}
                    height={80}
                    className="object-contain"
                    sizes="80px"
                  />
                )}
              </IconBlock>

              {/* Optional overlay info for conferences/items with extra data */}
              {(item.year || item.location) && (
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <p className="text-xs text-muted opacity-75">
                    {item.year}
                    {item.year && item.location && " • "}
                    {item.location}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    );
  }
);

SliderGroup.displayName = "SliderGroup";

// Icons
const iconsProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "28",
  height: "28",
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
