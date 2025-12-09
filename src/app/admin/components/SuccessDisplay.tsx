"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

interface SuccessDisplayProps {
  message: string;
  onDismiss: () => void;
  compact?: boolean;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({
  message,
  onDismiss,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="p-3 rounded-lg border bg-green-500/10 border-green-500/30 flex items-start gap-2">
        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-700 dark:text-green-400" />
        <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border bg-green-500/10 border-green-500/30 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-green-700 dark:text-green-400" />
      <div className="flex-1">
        <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-lg shrink-0 text-green-700 dark:text-green-400 hover:opacity-70"
      >
        ×
      </button>
    </div>
  );
};
