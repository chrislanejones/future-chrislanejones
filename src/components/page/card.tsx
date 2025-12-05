// src/components/page/card.tsx
"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "card rounded-3xl bg-panel border border-[color:var(--color-border)]",
  {
    variants: {
      size: {
        small: "col-span-1 row-span-1",
        medium: "col-span-1 md:col-span-2 row-span-1",
        large: "col-span-1 md:col-span-2",
        wide: "col-span-1 md:col-span-4 row-span-1",
        hero: "col-span-1 md:col-span-4 row-span-1",
        full: "col-span-1 md:col-span-6 row-span-1",
      },
      height: {
        small: "min-h-[25px] md:min-h-[25px]",
        medium: "min-h-[200px] md:min-h-[210px]",
        large: "md:row-span-2 min-h-[400px] md:min-h-[420px]",
        xl: "min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]",
      },
      layout: {
        default: "p-4",
        "media-top": "overflow-hidden flex flex-col",
        "media-bottom": "overflow-hidden flex flex-col-reverse",
        "media-left": "overflow-hidden flex flex-row",
        "media-right": "overflow-hidden flex flex-row-reverse",
        split: "grid md:grid-cols-2 gap-6 p-4",
        stacked: "flex flex-col gap-4 p-4",
      },
      mediaRadius: {
        none: "",
        sm: "[&>*:first-child]:rounded-sm",
        md: "[&>*:first-child]:rounded-md",
        lg: "[&>*:first-child]:rounded-lg",
        xl: "[&>*:first-child]:rounded-xl",
        "2xl": "[&>*:first-child]:rounded-2xl",
        top: "[&>*:first-child]:rounded-t-2xl",
        bottom: "[&>*:first-child]:rounded-b-2xl",
        inset:
          "[&>*:first-child]:rounded-2xl [&>*:first-child]:m-4 [&>*:first-child]:overflow-hidden",
      },
    },
    defaultVariants: {
      size: "medium",
      height: "medium",
      layout: "default",
      mediaRadius: "none",
    },
  }
);

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
  height,
  layout,
  mediaRadius,
  className = "",
  delay = 0,
  id,
  style,
}: UnifiedCardProps) {
  return (
    <motion.article
      id={id}
      className={`${cardVariants({
        size,
        height,
        layout,
        mediaRadius,
      })} ${className} pointer-events-auto`}
      style={{
        ...style,
        willChange: "transform, opacity",
      }}
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.4,
        delay,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.article>
  );
}

export function CardMedia({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative flex-1 min-h-0 ${className}`}>{children}</div>
  );
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-4 flex-shrink-0 ${className}`}>{children}</div>;
}

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
          className={`object-cover w-full h-full border border-[color:var(--color-border)] ${className}`}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          {...props}
        />
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className={`object-cover w-full h-full border border-[color:var(--color-border)] ${className}`}
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
