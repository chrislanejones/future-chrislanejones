// src/components/ui/image-pill.tsx
import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";

type ImagePillProps = {
  children: React.ReactNode;
  variant?: BadgeProps["variant"]; // e.g., "blue" | "green" | "dark"
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
};

const POS = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
} as const;

export function ImagePill({
  children,
  variant = "dark",
  className = "",
  position = "bottom-right",
}: ImagePillProps) {
  return (
    <Badge
      variant={variant}
      className={`absolute ${POS[position]} p px-3 py-1.5 shadow-lg ${className}`}
    >
      {children}
    </Badge>
  );
}
