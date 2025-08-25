import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // base
    "inline-flex items-center justify-center font-semibold transition",
    "disabled:opacity-50 disabled:pointer-events-none",
    "rounded-[12px] px-4 h-10 gap-2",
    // focus + hover hooks (use the utilities from globals.css)
    "focus-ring", // gives the accent glow on :focus-visible
    "hover:shadow-glow", // your requested hover glow
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--color-accent)]",
          "text-[color:var(--color-on-accent)]",
        ].join(" "),
        secondary: [
          "bg-[color:var(--color-panel)]",
          "text-[color:var(--color-ink)]",
          "border border-white/10",
        ].join(" "),
        outline: [
          "bg-transparent",
          "text-[color:var(--color-ink)]",
          "border border-white/12",
        ].join(" "),
        ghost: "bg-transparent text-[color:var(--color-ink)]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
      },
      round: { true: "rounded-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", round: false },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  round,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, round }), className)}
      {...props}
    />
  );
}
