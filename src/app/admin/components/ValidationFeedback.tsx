"use client";
import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface ValidationFeedbackProps {
  errors: string[];
  warnings: string[];
  success: string[];
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  errors,
  warnings,
  success,
}) => {
  if (errors.length === 0 && warnings.length === 0 && success.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {errors.map((error, i) => (
        <div
          key={`error-${i}`}
          className="p-3 rounded-lg border bg-red-500/10 border-red-500/30 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      ))}

      {warnings.map((warning, i) => (
        <div
          key={`warning-${i}`}
          className="p-3 rounded-lg border bg-yellow-500/10 border-yellow-500/30 flex items-start gap-2"
        >
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-yellow-700 dark:text-yellow-400" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            {warning}
          </p>
        </div>
      ))}

      {success.map((msg, i) => (
        <div
          key={`success-${i}`}
          className="p-3 rounded-lg border bg-green-500/10 border-green-500/30 flex items-start gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-700 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-400">{msg}</p>
        </div>
      ))}
    </div>
  );
};
