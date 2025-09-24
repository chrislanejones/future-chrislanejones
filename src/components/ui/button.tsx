import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
    "transition shadow-passive focus-ring hover:shadow-glow",
    "disabled:opacity-50 disabled:pointer-events-none select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Default: panel background, NO green at rest */
        neutral: ["bg-panel card", "text-[color:var(--color-ink)]"].join(" "),
        /* Optional: filled accent (only if you want a green button variant) */
        base: [
          "bg-[color:var(--color-muted-accent)]",
          "hover:bg-[color:var(--color-muted-accent)]",
          "text-[color:var(--color-accent-ink)]",
          "border border-transparent",
        ].join(" "),
        accent: [
          "bg-[color:var(--color-accent)]",
          "text-[color:var(--color-on-accent, #0b0d10)]",
          "border border-transparent",
        ].join(" "),
        outline: [
          "bg-transparent",
          "text-[color:var(--color-ink)]",
          "border border-white/12",
        ].join(" "),
        ghost: "bg-transparent text-[color:var(--color-ink)]",
      },
      size: {
        sm: "h-9 text-sm",
        md: "h-10 text-sm",
        lg: "h-11 text-base",
      },
      round: { true: "rounded-full", false: "" },
      asLink: { true: "no-underline", false: "" },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
      round: false,
      asLink: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  round,
  asLink,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, round, asLink }),
        className
      )}
      {...props}
    />
  );
}
