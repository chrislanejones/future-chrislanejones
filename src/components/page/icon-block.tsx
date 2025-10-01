"use client";

import React, { useState } from "react";

interface IconBlockProps {
  children: React.ReactNode;
  label: string;
  className?: string;
}

export default function IconBlock({
  children,
  label,
  className = "",
}: IconBlockProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000); // Reset after animation
  };

  return (
    <div
      className={`
        group relative flex flex-col items-center gap-2 p-3 rounded-xl
        bg-[color:var(--color-muted-accent)] transition-all duration-300
        cursor-pointer tabindex="0"
        hover:bg-gradient-to-br hover:from-[color:var(--color-muted-accent)]
        hover:to-[color:var(--color-muted-accent)]/80
        focus:outline-none focus:ring-2 focus:ring-accent
        focus:ring-opacity-50
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br
        before:from-white/10 before:to-transparent before:opacity-0
        hover:before:opacity-100 before:transition-opacity before:duration-300
        ${className}
      `}
      tabIndex={0}
      onClick={handleClick}
    >
      {/* Animated border effect */}
      {isClicked && (
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

      <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-[color:var(--color-foreground)] group-hover:text-[color:var(--color-accent)] group-focus:text-[color:var(--color-accent)] relative z-10">
        {children}
      </div>
      <span className="text-center text-sm font-medium text-[color:var(--color-foreground)] relative z-10">
        {label}
      </span>
    </div>
  );
}
