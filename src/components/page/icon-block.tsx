"use client";

import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconBlockVariants = cva(
  "group relative flex flex-col items-center gap-2 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:ring-opacity-50",
  {
    variants: {
      variant: {
        "small-block": [
          "p-3",
          "bg-[color:var(--color-muted-accent)]",
          "hover:bg-gradient-to-br hover:from-[color:var(--color-muted-accent)]",
          "hover:to-[color:var(--color-muted-accent)]/80",
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br",
          "before:from-white/50 before:to-transparent before:opacity-0",
          "hover:before:opacity-100 before:transition-opacity before:duration-300",
        ].join(" "),
        "large-block": [
          "p-3",
          "opacity-90 hover:opacity-100",
          "bg-[color:var(--color-base)]",
          "hover:bg-[color:var(--color-muted-accent)]",
          "rounded-lg",
          "transition-all duration-300",
          "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br",
          "before:from-white/50 before:to-transparent before:opacity-0",
          "hover:before:opacity-100 before:transition-opacity before:duration-300",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "small-block",
    },
  }
);

interface IconBlockProps extends VariantProps<typeof iconBlockVariants> {
  children: React.ReactNode;
  label?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export default function IconBlock({
  children,
  label,
  variant,
  className = "",
  href,
  onClick,
}: IconBlockProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
    if (onClick) onClick();
  };

  const content = (
    <>
      {/* Animated border effect for small-block only */}
      {isClicked && variant === "small-block" && (
        <div className="absolute -inset-0.5 rounded-xl pointer-events-none overflow-hidden">
          <div
            className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%]"
            style={{
              background:
                "conic-gradient(rgba(34, 197, 94, 0) 0deg, rgba(34, 197, 94, 1) 0deg, transparent 40deg)",
              animation: "border-spin 1s linear",
            }}
          ></div>
        </div>
      )}

      <style jsx>{`
        @keyframes border-spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {variant === "small-block" ? (
        <>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-[color:var(--color-foreground)] group-hover:text-[color:var(--color-accent)] group-focus:text-[color:var(--color-accent)] relative z-10">
            {children}
          </div>
          {label && (
            <span className="text-center text-sm font-medium text-[color:var(--color-foreground)] relative z-10">
              {label}
            </span>
          )}
        </>
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
          {label && (
            <div className="text-center mt-2">
              <h4 className="text-xs font-medium text-white mb-1">{label}</h4>
            </div>
          )}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(iconBlockVariants({ variant }), className)}
        onClick={handleClick}
        tabIndex={0}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={cn(iconBlockVariants({ variant }), className)}
      tabIndex={0}
      onClick={handleClick}
    >
      {content}
    </div>
  );
}
