"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// The one button style source. Every look reads the globals.css tokens:
// admin/interior controls use --color-*, coastal pages use --coast-*.
const boxy = "rounded-lg hover:shadow-glow";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "transition focus-ring",
    "select-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none",
    "disabled:opacity-40 disabled:saturate-50",
  ].join(" "),
  {
    variants: {
      variant: {
        // Filled teal, the Contact button color.
        primary: cn(
          boxy,
          "bg-(--color-accent) shadow-glow text-(--color-on-accent)",
          "border border-transparent hover:bg-(--color-accent)/90",
        ),
        // Outlined, the default admin action.
        secondary: cn(
          boxy,
          "bg-transparent text-foreground border border-(--color-border)",
        ),
        ghost: cn(
          boxy,
          "bg-transparent text-foreground hover:bg-(--color-surface-hover)",
        ),
        // Soft filled surface, used for round icon buttons outside the coast.
        neutral: cn(
          boxy,
          "bg-(--color-surface-hover) shadow-glow text-foreground",
          "hover:border-(--color-border)",
        ),
        // Filled danger for deletes; no teal glow on a red control.
        destructive: [
          "rounded-lg border border-transparent",
          "bg-(--color-danger) text-(--color-panel) hover:bg-(--color-danger)/85",
        ].join(" "),
        // Coastal teal pill: lg is the home hero "Contact Me", md the
        // interior page action. Geometry and hover live in compoundVariants.
        pill: [
          "rounded-(--radius-pill) bg-(--coast-accent) text-(--coast-on-accent)",
          "font-semibold whitespace-nowrap no-underline",
        ].join(" "),
        // Coastal outlined circle (carousel arrows, new quote, next track).
        circle: [
          "shrink-0 rounded-(--radius-pill) border border-(--coast-line)",
          "transition-[background-color,scale] duration-180",
          "hover:bg-(--coast-soft) active:scale-[0.94]",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 py-2 text-sm",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-5 py-3 text-base",
        icon: "size-10 p-0",
        "icon-sm": "size-8 p-0",
      },
      round: { true: "rounded-full", false: "" },
    },
    // Compound rules come after size, so the coastal shapes own their geometry.
    compoundVariants: [
      {
        variant: "pill",
        size: ["sm", "md", "icon", "icon-sm"],
        className: [
          "h-auto min-h-12 gap-3 px-[22px] py-3 text-[length:var(--type-body)]",
          "transition-opacity duration-200 hover:opacity-85",
          "[&_svg]:size-[17px] [&_svg]:shrink-0",
        ].join(" "),
      },
      {
        variant: "pill",
        size: "lg",
        className: [
          "h-auto gap-[22px] px-[25px] py-4 text-[length:var(--type-body)]",
          "max-md:gap-[17px] max-md:px-5 max-md:py-3.5",
          "transition-[translate,scale,box-shadow] duration-200",
          "hover:-translate-y-[3px] hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--coast-deep)_14%,transparent)]",
          "active:scale-[0.98] motion-reduce:translate-none motion-reduce:scale-none",
        ].join(" "),
      },
      { variant: "circle", className: "p-0" },
      { variant: "circle", size: "sm", className: "size-9" },
      { variant: "circle", size: ["md", "icon"], className: "size-10" },
      { variant: "circle", size: "lg", className: "size-11" },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "md",
      round: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showExternalIcon?: boolean;
}

export function Button({
  className,
  variant,
  size,
  round,
  asChild,
  showExternalIcon = false,
  type,
  children,
  ...props
}: ButtonProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const Comp = asChild ? Slot : "button";

  // Add external link icon on focus if enabled
  const enhancedChildren = React.useMemo(() => {
    if (!showExternalIcon) return children;

    if (
      React.isValidElement<{
        children?: React.ReactNode;
        onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
        onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
      }>(children)
    ) {
      const originalChildren = children.props.children;

      return React.cloneElement(children, {
        ...children.props,
        onFocus: (e: React.FocusEvent<HTMLElement>) => {
          setIsFocused(true);
          if (children.props.onFocus) {
            children.props.onFocus(e);
          }
        },
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
          setIsFocused(false);
          if (children.props.onBlur) {
            children.props.onBlur(e);
          }
        },
        children: (
          <>
            {originalChildren}
            {isFocused && (
              <ExternalLink
                className="w-4 h-4 ml-1 transition-opacity duration-200"
                aria-hidden="true"
              />
            )}
          </>
        ),
      });
    }

    // Fallback for text-only children
    return (
      <>
        {children}
        {isFocused && (
          <ExternalLink
            className="w-4 h-4 ml-1 transition-opacity duration-200"
            aria-hidden="true"
          />
        )}
      </>
    );
  }, [children, showExternalIcon, isFocused]);

  const buttonProps = {
    ...props,
    // Never submit a form by accident; forms opt in with type="submit".
    // Slot children (links) keep their own semantics.
    ...(asChild ? {} : { type: type ?? "button" }),
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      if (!showExternalIcon) setIsFocused(true);
      props.onFocus?.(e as React.FocusEvent<HTMLButtonElement>);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!showExternalIcon) setIsFocused(false);
      props.onBlur?.(e as React.FocusEvent<HTMLButtonElement>);
    },
  };

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, round }), className)}
      {...buttonProps}
    >
      {enhancedChildren}
    </Comp>
  );
}
