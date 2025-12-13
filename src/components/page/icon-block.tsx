"use client";

import React from "react";

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
  return (
    <div
      className={`group flex flex-col items-center justify-center
        rounded-lg border border-transparent
        bg-(--color-inner-card)
        hover:bg-(--color-muted-accent)
        hover:border-(--color-accent)
        hover:shadow-glow
        transition-all duration-300 cursor-pointer
        overflow-hidden aspect-square
        ${className}`}
      tabIndex={0}
    >
      {/* inner icon centered */}
      <div className="flex flex-col items-center justify-center h-full w-full p-3">
        <div className="flex items-center justify-center flex-1">
          {children}
        </div>
        <h4
          className="text-center text-(--color-ink)"
          style={{ fontSize: "var(--step--1)" }}
        >
          {label}
        </h4>
      </div>
    </div>
  );
}
