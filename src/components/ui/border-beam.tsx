"use client";

import React from "react";

interface BorderBeamProps {
  duration?: number;
  size?: number;
  className?: string;
}

export function BorderBeam({
  duration = 8,
  size = 100,
  className = ""
}: BorderBeamProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-xl pointer-events-none ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, rgb(34, 197, 94) ${size/4}deg, transparent ${size/2}deg)`,
          animation: `border-beam ${duration}s linear infinite`,
        }}
      />
      <style jsx>{`
        @keyframes border-beam {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}