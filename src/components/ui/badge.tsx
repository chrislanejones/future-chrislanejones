import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Accessible Badge component
 * Neutral gray background, colored outline border only
 * – High contrast text across both light/dark modes
 * – Optional colored focus ring
 */

const badgeVariants = cva(
  // shared base styles
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
    "transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: `
          bg-gray-100 dark:bg-gray-800
          text-[color:var(--color-ink)]
          border border-[color:var(--color-border)]
          focus-visible:ring-[color:var(--color-accent)]
        `,

        blue: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#3b82f6]
          focus-visible:ring-[#3b82f6]
        `,
        red: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#ef4444]
          focus-visible:ring-[#ef4444]
        `,
        yellow: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#eab308]
          focus-visible:ring-[#eab308]
        `,
        green: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#22c55e]
          focus-visible:ring-[#22c55e]
        `,
        pink: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#ec4899]
          focus-visible:ring-[#ec4899]
        `,
        purple: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#a855f7]
          focus-visible:ring-[#a855f7]
        `,
        cyan: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#06b6d4]
          focus-visible:ring-[#06b6d4]
        `,
        orange: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#f97316]
          focus-visible:ring-[#f97316]
        `,
        dark: `
          bg-gray-100 dark:bg-gray-800 text-[color:var(--color-ink)]
          border border-[#0f172a]
          focus-visible:ring-[#0f172a]
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * High‑contrast accessible badge
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant }),
        "font-medium leading-none tracking-tight"
      )}
      {...props}
    />
  );
}

export { badgeVariants };
