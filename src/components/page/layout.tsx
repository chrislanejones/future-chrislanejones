"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageLayoutProps {
  children: ReactNode;
  layout?: "full" | "half" | "third" | "mixed";
  className?: string;
}

export function PageLayout({ children, layout = "full", className = "" }: PageLayoutProps) {
  const getGridClasses = () => {
    switch (layout) {
      case "full":
        return "grid grid-cols-1 gap-6 lg:gap-8";
      case "half":
        return "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8";
      case "third":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";
      case "mixed":
        return "grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8";
      default:
        return "grid grid-cols-1 gap-6 lg:gap-8";
    }
  };

  return (
    <motion.div
      className={`${getGridClasses()} ${className}`}
 
 
      
    >
      {children}
    </motion.div>
  );
}

export function FullWidthLayout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout layout="full" className={className}>
      {children}
    </PageLayout>
  );
}

export function HalfWidthLayout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout layout="half" className={className}>
      {children}
    </PageLayout>
  );
}

export function ThirdWidthLayout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout layout="third" className={className}>
      {children}
    </PageLayout>
  );
}

export function MixedLayout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout layout="mixed" className={className}>
      {children}
    </PageLayout>
  );
}
