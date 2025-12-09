"use client";
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  compact?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span className="text-sm text-muted">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
      <p className="text-muted">{message}</p>
    </div>
  );
};
