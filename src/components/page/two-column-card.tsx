"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

const twoColumnCardVariants = cva(
  "rounded-3xl bg-panel p-4 md:p-6 lg:p-8 border border-(--color-border)",
  {
    variants: {
      size: {
        small: "col-span-1",
        medium: "col-span-1 md:col-span-2",
        large: "col-span-1 md:col-span-3",
        full: "col-span-1 md:col-span-4",
      },
      height: {
        small: "min-h-[300px] md:min-h-[320px]",
        medium: "min-h-[400px] md:min-h-[420px]",
        large: "min-h-[500px] md:min-h-[520px]",
      },
    },
    defaultVariants: {
      size: "medium",
      height: "medium",
    },
  }
);

interface TwoColumnCardProps
  extends VariantProps<typeof twoColumnCardVariants> {
  imagePosition?: "left" | "right";
  image: {
    src: string;
    alt: string;
  };
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  style?: React.CSSProperties;
}

function getContentOrder(imagePosition: "left" | "right"): string {
  return imagePosition === "left" ? "order-2" : "order-1";
}

function getImageOrder(imagePosition: "left" | "right"): string {
  return imagePosition === "left" ? "order-1" : "order-2";
}

export function TwoColumnCard({
  imagePosition = "left",
  image,
  children,
  size,
  height,
  className = "",
  delay = 0,
  id,
  style,
}: TwoColumnCardProps) {
  const contentOrder = getContentOrder(imagePosition);
  const imageOrder = getImageOrder(imagePosition);

  return (
    <motion.article
      id={id}
      className={`${twoColumnCardVariants({
        size,
        height,
      })} ${className} pointer-events-auto grid md:grid-cols-5 gap-8`}
      style={{
        ...style,
        willChange: "transform, opacity",
      }}
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      whileInView={{
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
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Content Column */}
      <div
        className={`flex flex-col justify-center md:col-span-2 ${contentOrder}`}
      >
        {children}
      </div>

      {/* Image Column */}
      <div
        className={`relative rounded-2xl overflow-hidden min-h-[300px] md:col-span-3 ${imageOrder}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={delay === 0}
        />
      </div>
    </motion.article>
  );
}

export default TwoColumnCard;
