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
  title?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  variant?: "large-block" | "small-block" | "no-filter";
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Item  Group                                */
/* -------------------------------------------------------------------------- */

const ItemGroup = forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ items, direction }, ref) => {
    const getImageClasses = () => `
      object-contain
      w-auto h-20 sm:h-24 lg:h-28
      opacity-90 hover:opacity-100
      transition-all duration-300
      grayscale contrast-110 brightness-[0.95]
      dark:invert
    `;

    return (
      <motion.div
        ref={ref}
        className={`
          absolute inset-0
          grid gap-6 p-4
          grid-cols-1 grid-rows-2          /* mobile: 1×2 */
          sm:grid-cols-2 sm:grid-rows-2    /* tablet: 2×2 */
          lg:grid-cols-4 lg:grid-rows-2    /* desktop: 4×2 */
        `}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        }}
      >
        {items.map((item, i) =>
          !item.name || !item.logo ? (
            <div key={`empty-${i}`} />
          ) : (
            <motion.a
              key={`${item.name}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center rounded-lg bg-[color:var(--color-base)] hover:bg-[color:var(--color-muted-accent)] p-4 transition-all duration-300 border border-transparent hover:border-[color:var(--color-accent)] hover:shadow-glow"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 1, scale: 0.95 }}
              animate={{
                scale: 1,
                transition: { duration: 0.45, ease: "easeOut" },
              }}
            >
              <Image
                src={item.logo}
                alt={`${item.name} logo`}
                width={200}
                height={120}
                className={getImageClasses()}
                sizes="(max-width: 640px) 100vw,
                       (max-width: 1024px) 50vw,
                       25vw"
              />
            </motion.a>
          )
        )}
      </motion.div>
    );
  }
);

ItemGroup.displayName = "ItemGroup";

/* -------------------------------------------------------------------------- */
/*                                Icon Slider                                */
/* -------------------------------------------------------------------------- */

export default function IconSlider({
  items,
  title,
  showNavigation = true,
  showPagination = true,
  variant = "large-block",
  className = "",
}: IconSliderProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [itemsPerView, setItemsPerView] = useState(8);

  // responsive grouping
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640)
        setItemsPerView(2); // mobile: 1×2
      else if (w < 1024)
        setItemsPerView(4); // tablet: 2×2
      else setItemsPerView(8); // desktop: 4×2
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------------------- group calculation --------------------------- */
  const itemGroups: SliderItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerView) {
    const group = items.slice(i, i + itemsPerView);
    while (group.length < itemsPerView)
      group.push({ name: "", logo: "", url: "#" });
    itemGroups.push(group);
  }

  /* ---------------------------- navigation logic ---------------------------- */
  function setSlide(newDirection: 1 | -1) {
    const next = wrap(0, itemGroups.length, selectedGroup + newDirection);
    setSelectedGroup(next);
    setDirection(newDirection);
  }

  const shouldShowNavigation = showNavigation && itemGroups.length > 1;
  const shouldShowPagination = showPagination && itemGroups.length > 1;
  const currentItems =
    itemGroups[selectedGroup] || items.slice(0, itemsPerView);

  /* ---------------------------------- render --------------------------------- */
  return (
    <div className={className}>
      {title && <h2 className="text-center mb-4">{title}</h2>}

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

        <div className="flex-1 relative h-[30rem] md:h-[32rem] overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <ItemGroup
              key={selectedGroup}
              items={currentItems}
              direction={direction}
              isMobile={false}
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
          {itemGroups.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > selectedGroup ? 1 : -1);
                setSelectedGroup(i);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i === selectedGroup
                  ? "bg-ink scale-110"
                  : "bg-gray-800/50 dark:bg-gray-300/50 hover:bg-gray-800/70 dark:hover:bg-gray-300/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Icons                                   */
/* -------------------------------------------------------------------------- */

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
