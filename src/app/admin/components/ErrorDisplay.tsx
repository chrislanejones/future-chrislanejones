"use client";
import React from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

type ErrorType =
  | "SettingsError"
  | "ValidationError"
  | "BackupError"
  | "HealthCheckError"
  | "BlogError"
  | "MediaError"
  | "LinkError"
  | "SEOError"
  | "unknown";

interface ErrorDisplayProps {
  error: Error | null;
  onDismiss: () => void;
  compact?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  compact = false,
}) => {
  if (!error) return null;

  const getErrorType = (): ErrorType => {
    if (error.name === "ValidationError") return "ValidationError";
    if (error.name === "SettingsError") return "SettingsError";
    if (error.name === "BackupError") return "BackupError";
    if (error.name === "HealthCheckError") return "HealthCheckError";
    if (error.name === "BlogError") return "BlogError";
    if (error.name === "MediaError") return "MediaError";
    if (error.name === "LinkError") return "LinkError";
    if (error.name === "SEOError") return "SEOError";
    return "unknown";
  };

  const getErrorConfig = (type: ErrorType) => {
    const configs = {
      ValidationError: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        textColor: "text-yellow-700 dark:text-yellow-400",
        title: "Validation Error",
      },
      SettingsError: {
        icon: AlertCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700 dark:text-red-400",
        title: "Settings Error",
      },
      BackupError: {
        icon: AlertCircle,
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        textColor: "text-orange-700 dark:text-orange-400",
        title: "Backup Error",
      },
      HealthCheckError: {
        icon: Info,
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        textColor: "text-blue-700 dark:text-blue-400",
        title: "Health Check Error",
      },
      BlogError: {
        icon: AlertCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700 dark:text-red-400",
        title: "Blog Error",
      },
      MediaError: {
        icon: AlertCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700 dark:text-red-400",
        title: "Media Error",
      },
      LinkError: {
        icon: AlertCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700 dark:text-red-400",
        title: "Link Error",
      },
      SEOError: {
        icon: AlertCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700 dark:text-red-400",
        title: "SEO Error",
      },
      unknown: {
        icon: AlertCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700 dark:text-red-400",
        title: "Error",
      },
    };
    return configs[type];
  };

  const type = getErrorType();
  const config = getErrorConfig(type);
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor} flex items-start gap-2`}
      >
        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.textColor}`} />
        <p className={`text-sm ${config.textColor}`}>{error.message}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} flex items-start gap-3`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.textColor}`} />
      <div className="flex-1">
        <h4 className={`font-semibold ${config.textColor}`}>{config.title}</h4>
        <p className={`text-sm mt-1 ${config.textColor}`}>{error.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className={`text-lg shrink-0 ${config.textColor} hover:opacity-70`}
      >
        ×
      </button>
    </div>
  );
};
