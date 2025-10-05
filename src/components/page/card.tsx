"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("card rounded-3xl bg-panel", {
  variants: {
    size: {
      small: "col-span-1 row-span-1 min-h-[25px] md:min-h-[25px]",
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
    color: {
      default: "bg-panel",
      blue: "!bg-blue-500/40 border-blue-400/30 border !bg-opacity-100",
      red: "!bg-red-500/40 border-red-400/30 border !bg-opacity-100",
      yellow: "!bg-yellow-500/40 border-yellow-400/30 border !bg-opacity-100",
      green: "!bg-green-500/40 border-green-400/30 border !bg-opacity-100",
      pink: "!bg-pink-500/40 border-pink-400/30 border !bg-opacity-100",
      purple: "!bg-purple-500/40 border-purple-400/30 border !bg-opacity-100",
      cyan: "!bg-cyan-500/40 border-cyan-400/30 border !bg-opacity-100",
      orange: "!bg-orange-500/40 border-orange-400/30 border !bg-opacity-100",
    },
  },
  defaultVariants: {
    size: "medium",
    padding: "medium",
    glass: false,
    height: "full",
    color: "default",
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
  color,
  className = "",
  delay = 0,
  id,
  style,
}: CardProps) {
  return (
    <motion.article
      id={id}
      className={`${cardVariants({
        size,
        padding,
        glass,
        height,
        color,
      })} ${className}`}
      style={{
        ...style,
        // Force visibility with inline styles
        willChange: "transform, opacity",
      }}
      initial={{
        opacity: 0,
        y: 20, // Reduced from 50 for more subtle motion
        scale: 0.95, // Less dramatic scale change
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.4, // Shorter duration for subtler animation
        delay,
        type: "spring",
        stiffness: 300, // Higher stiffness for less bouncy feel
        damping: 30, // More damping for smoother animation
      }}
      // Removed whileHover animation
      // Add viewport animation trigger
      viewport={{ once: true }}
    >
      {children}
    </motion.article>
  );
}

export default Card;
