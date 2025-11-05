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
    "transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "[background-color:var(--badge-bg)] [color:var(--badge-text)]",
  {
    variants: {
      variant: {
        default: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[color:var(--color-border)]
          focus-visible:ring-[color:var(--color-accent)]
        `,

        blue: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[color:var(--color-accent-alt)]
          focus-visible:ring-[color:var(--color-accent-alt)]
        `,
        red: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[#ef4444]
          focus-visible:ring-[#ef4444]
        `,
        yellow: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[#eab308]
          focus-visible:ring-[#eab308]
        `,
        green: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[color:var(--color-accent)]
          focus-visible:ring-[color:var(--color-accent)]
        `,
        pink: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[#ec4899]
          focus-visible:ring-[#ec4899]
        `,
        purple: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[#a855f7]
          focus-visible:ring-[#a855f7]
        `,
        cyan: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[#06b6d4]
          focus-visible:ring-[#06b6d4]
        `,
        orange: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
          border border-[#f97316]
          focus-visible:ring-[#f97316]
        `,
        dark: `
          [--badge-bg:#f3f4f6] [--badge-text:#111827]
          dark:[--badge-bg:#0b0d10] dark:[--badge-text:#ffffff]
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
      style={{
        backgroundColor: 'var(--color-base)',
        color: 'var(--color-ink)',
      }}
      {...props}
    />
  );
}

export { badgeVariants };
