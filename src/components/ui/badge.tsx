import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        // Color group variants with dark mode support
        blue: "bg-[rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(59,130,246,0.25)] dark:border-[rgba(59,130,246,0.5)]",
        red: "bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(239,68,68,0.25)] dark:border-[rgba(239,68,68,0.5)]",
        yellow:
          "bg-[rgba(234,179,8,0.15)] border-[rgba(234,179,8,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(234,179,8,0.25)] dark:border-[rgba(234,179,8,0.5)]",
        green:
          "bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(34,197,94,0.25)] dark:border-[rgba(34,197,94,0.5)]",
        pink: "bg-[rgba(236,72,153,0.15)] border-[rgba(236,72,153,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(236,72,153,0.25)] dark:border-[rgba(236,72,153,0.5)]",
        purple:
          "bg-[rgba(168,85,247,0.15)] border-[rgba(168,85,247,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(168,85,247,0.25)] dark:border-[rgba(168,85,247,0.5)]",
        cyan: "bg-[rgba(6,182,212,0.15)] border-[rgba(6,182,212,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(6,182,212,0.25)] dark:border-[rgba(6,182,212,0.5)]",
        orange:
          "bg-[rgba(249,115,22,0.15)] border-[rgba(249,115,22,0.3)] text-[color:var(--color-ink)] dark:bg-[rgba(249,115,22,0.25)] dark:border-[rgba(249,115,22,0.5)]",
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
