"use client";

import { CheckCircle, AlertCircle, Info, X, Loader2 } from "lucide-react";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-right-5 fade-in duration-200 ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : toast.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                : toast.type === "loading"
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                  : "bg-zinc-500/10 border-zinc-500/30 text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {toast.type === "success" && (
            <CheckCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.type === "info" && <Info className="w-4 h-4 shrink-0" />}
          {toast.type === "loading" && (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          )}
          <span className="text-sm flex-1">{toast.message}</span>
          {toast.type !== "loading" && (
            <button
              onClick={() => onRemove(toast.id)}
              className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
