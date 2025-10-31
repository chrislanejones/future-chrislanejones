// src/components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // keep your base shadcn-like variants
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",

        // SOLID, MODE-INDEPENDENT COLOR BADGES (same in light/dark)
        blue: "bg-[#3b82f6] text-white border-[#3b82f6]",
        red: "bg-[#ef4444] text-white border-[#ef4444]",
        yellow: "bg-[#eab308] text-white border-[#eab308]",
        green: "bg-[#22c55e] text-white border-[#22c55e]",
        pink: "bg-[#ec4899] text-white border-[#ec4899]",
        purple: "bg-[#a855f7] text-white border-[#a855f7]",
        cyan: "bg-[#06b6d4] text-white border-[#06b6d4]",
        orange: "bg-[#f97316] text-white border-[#f97316]",

        // Optional neutral pill for overlays where you want a single look
        dark: "bg-[#0f172a] text-white border-[#0f172a]", // slate-900
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
