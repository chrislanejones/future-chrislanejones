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
  "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium " +
    "transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "bg-base text-ink [font-size:var(--step-0)] [line-height:1.5]",
  {
    variants: {
      variant: {
        default: `
          border border-(--color-border)
          focus-visible:ring-(--color-accent)
        `,

        blue: `
          border border-(--color-accent-alt)
          focus-visible:ring-(--color-accent-alt)
        `,
        red: `
          border border-(--color-tag-red)
          focus-visible:ring-(--color-tag-red)
        `,
        yellow: `
          border border-(--color-tag-yellow)
          focus-visible:ring-(--color-tag-yellow)
        `,
        green: `
          border border-(--color-accent)
          focus-visible:ring-(--color-accent)
        `,
        pink: `
          border border-(--color-tag-pink)
          focus-visible:ring-(--color-tag-pink)
        `,
        purple: `
          border border-(--color-tag-purple)
          focus-visible:ring-(--color-tag-purple)
        `,
        cyan: `
          border border-(--color-tag-cyan)
          focus-visible:ring-(--color-tag-cyan)
        `,
        orange: `
          border border-(--color-tag-orange)
          focus-visible:ring-(--color-tag-orange)
        `,
        dark: `
          border border-(--color-tag-dark)
          focus-visible:ring-(--color-tag-dark)
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
        "font-medium leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export { badgeVariants };
