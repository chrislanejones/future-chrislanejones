"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Exported now so NavigationMenu can import it
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg",
    "transition focus-ring hover:shadow-glow",
    "select-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none",
    "disabled:opacity-40 disabled:saturate-50",
  ].join(" "),
  {
    variants: {
      variant: {
        neutral: [
          "bg-(--color-surface-hover) shadow-glow",
          "text-foreground",
          "hover:bg-(--color-surface-hover) hover:border-(--color-border)",
          "focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2",
        ].join(" "),
        base: [
          "bg-(--color-muted-accent)",
          "hover:bg-(--color-surface-hover)",
          "text-foreground",
          "border border-transparent",
        ].join(" "),
        accent: [
          "bg-(--color-accent) shadow-glow",
          "hover:bg-(--color-accent)/90",
          "text-black",
          "border border-transparent",
        ].join(" "),
        outline: [
          "bg-transparent",
          "text-foreground",
          "border border-(--color-border)",
        ].join(" "),
        ghost: [
          "bg-transparent",
          "text-foreground",
          "hover:bg-(--color-surface-hover)",
        ].join(" "),
        disabled: [
          "bg-muted text-muted-foreground border border-dashed opacity-50 cursor-not-allowed pointer-events-none shadow-none saturate-50",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 py-2 text-sm",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-5 py-3 text-base",
        icon: "h-10 w-10 p-0",
      },
      round: { true: "rounded-full", false: "" },
      asLink: { true: "no-underline", false: "" },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
      round: false,
      asLink: false,
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
  asLink,
  asChild,
  showExternalIcon = false,
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
      className={cn(
        buttonVariants({ variant, size, round, asLink }),
        className
      )}
      {...buttonProps}
    >
      {enhancedChildren}
    </Comp>
  );
}
