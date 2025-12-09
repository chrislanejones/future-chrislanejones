"use client";
import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

type ErrorType =
  | "SettingsError"
  | "ValidationError"
  | "BackupError"
  | "HealthCheckError"
  | "unknown";

interface EffectErrorDisplayProps {
  error: Error | null;
  onDismiss: () => void;
}

export const EffectErrorDisplay: React.FC<EffectErrorDisplayProps> = ({
  error,
  onDismiss,
}) => {
  if (!error) return null;

  const getErrorType = (): ErrorType => {
    if (error.name === "ValidationError") return "ValidationError";
    if (error.name === "SettingsError") return "SettingsError";
    if (error.name === "BackupError") return "BackupError";
    if (error.name === "HealthCheckError") return "HealthCheckError";
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

  return (
    <div
      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} flex items-start gap-3`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.textColor}`} />
      <div className="flex-1">
        <h4 className={`font-semibold ${config.textColor}`}>
          {config.title}
        </h4>
        <p className={`text-sm mt-1 ${config.textColor}`}>
          {error.message}
        </p>
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

export const EffectSuccessDisplay: React.FC<{ message: string; onDismiss: () => void }> = ({
  message,
  onDismiss,
}) => (
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
