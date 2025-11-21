"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Unified card variants that standardize all styles
const cardVariants = cva("card rounded-3xl bg-panel", {
  variants: {
    size: {
      small: "col-span-1 row-span-1",
      medium: "col-span-1 md:col-span-2 row-span-1 ",
      large: "col-span-1 md:col-span-2",
      wide: "col-span-1 md:col-span-4 row-span-1",
      hero: "col-span-1 md:col-span-4 row-span-1",
      full: "col-span-1 md:col-span-6 row-span-1",
      "page-full": "col-span-1",
      "page-half": "col-span-1 md:col-span-1",
      "page-third": "col-span-1 lg:col-span-1",
    },
    glass: {
      true: "glass",
      false: "",
    },
    height: {
      small: "min-h-[25px] md:min-h-[25px]",
      medium: "min-h-[200px] md:min-h-[210px]",
      large: " md:row-span-2 min-h-[400px] md:min-h-[420px]",
      xl: "min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]",
    },
    border: {
      none: "border-0",
      thin: "border border-[color:var(--color-border)] border-opacity-30",
      standard: "border border-[color:var(--color-border)]",
      accent: "border border-accent",
    },
    shadow: {
      none: "shadow-none",
      soft: "shadow-passive",
      glow: "shadow-glow",
    },
    hover: {
      none: "",
      lift: "transition-transform hover:scale-[1.02]",
      glow: "transition hover:shadow-glow",
      border: "transition-colors hover:border-accent",
    },
  },
  defaultVariants: {
    size: "medium",
    glass: false,
    height: "medium",
    border: "standard",
    shadow: "soft",
    hover: "none",
  },
});

interface UnifiedCardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  style?: React.CSSProperties;
}

export function Card({
  children,
  size,
  glass,
  height,
  border,
  shadow,
  hover,
  className = "",
  delay = 0,
  id,
  style,
}: UnifiedCardProps) {
  return (
    <motion.article
      id={id}
      className={`${cardVariants({ size, glass, height, border, shadow, hover })} ${className} pointer-events-auto`}
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
      // Add viewport animation trigger
      viewport={{ once: true }}
    >
      {children}
    </motion.article>
  );
}

// Define image styles that are consistent across all cards
export function CardImage({
  src,
  alt,
  className = "",
  priority = false,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
} & Omit<React.ComponentPropsWithoutRef<typeof motion.img>, "src" | "alt">) {
  return (
    <div className="relative overflow-hidden rounded-xl aspect-[16/9]">
      {fill ? (
        <motion.img
          src={src}
          alt={alt}
          className={`object-cover w-full h-full border border-[color:var(--color-border)] border-opacity-30 ${className}`}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          {...props}
        />
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className={`object-cover w-full h-full border border-[color:var(--color-border)] border-opacity-30 ${className}`}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          {...props}
        />
      )}
    </div>
  );
}

export default Card;
