"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Unified card variants that standardize all styles
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
    padding: "medium",
    glass: false,
    height: "full",
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
  padding,
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
      className={`${cardVariants({ size, padding, glass, height, border, shadow, hover, })} ${className}`}
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
