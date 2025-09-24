"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("card rounded-3xl bg-panel", {
  variants: {
    size: {
      small: "col-span-1 row-span-1 min-h-[200px] md:min-h-[210px]",
      medium:
        "col-span-1 md:col-span-2 row-span-1 min-h-[200px] md:min-h-[210px]",
      large:
        "col-span-1 md:col-span-2 row-span-1 md:row-span-2 min-h-[400px] md:min-h-[420px]",
      wide: "col-span-1 md:col-span-4 row-span-1 min-h-[200px] md:min-h-[210px]",
      hero: "col-span-1 md:col-span-4 row-span-1 md:row-span-2 min-h-[400px] md:min-h-[420px]",
      full: "col-span-1 md:col-span-6 row-span-1 md:row-span-2 min-h-[400px] md:min-h-[420px]",
      "page-full": "col-span-1 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]",
      "page-half":
        "col-span-1 md:col-span-1 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]",
      "page-third":
        "col-span-1 lg:col-span-1 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]",
    },
    padding: {
      none: "p-0",
      small: "p-3 sm:p-4",
      medium: "p-4 sm:p-6",
      large: "p-6 sm:p-8",
    },
    glass: {
      true: "glass",
      false: "",
    },
    height: {
      auto: "h-auto",
      full: "h-full",
      fit: "h-fit",
    },
  },
  defaultVariants: {
    size: "medium",
    padding: "medium",
    glass: false,
    height: "full",
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  style?: React.CSSProperties;
}

export function Card({
  children,
  size,
  padding,
  glass,
  height,
  className = "",
  delay = 0,
  id,
  style,
}: CardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If not mounted or motion fails, show without animation
  if (!isMounted) {
    return (
      <article
        id={id}
        className={`${cardVariants({
          size,
          padding,
          glass,
          height,
        })} ${className}`}
        style={style}
      >
        {children}
      </article>
    );
  }

  return (
    <motion.article
      id={id}
      className={`${cardVariants({
        size,
        padding,
        glass,
        height,
      })} ${className}`}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      // Fallback if animation fails
      onAnimationStart={() => {
        // Ensure visibility after a timeout
        setTimeout(() => {
          const element = document.getElementById(id || "");
          if (element) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0px)";
          }
        }, (delay + 0.8) * 1000);
      }}
    >
      {children}
    </motion.article>
  );
}

export default Card;
