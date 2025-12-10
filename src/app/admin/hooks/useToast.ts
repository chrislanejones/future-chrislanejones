"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "loading";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const toast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, toast]);

      if (type !== "loading" && duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "success", duration),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "error", duration),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => addToast(message, "info", duration),
    [addToast]
  );

  const loading = useCallback(
    (message: string) => addToast(message, "loading", 0),
    [addToast]
  );

  const withToast = useCallback(
    async <T>(
      mutation: () => Promise<T>,
      options: {
        loading?: string;
        success?: string;
        error?: string;
      } = {}
    ): Promise<T | null> => {
      const loadingId = options.loading ? loading(options.loading) : null;
      try {
        const result = await mutation();
        if (loadingId) removeToast(loadingId);
        if (options.success) success(options.success);
        return result;
      } catch (err) {
        if (loadingId) removeToast(loadingId);
        const errorMessage =
          options.error ||
          (err instanceof Error ? err.message : "Something went wrong");
        error(errorMessage);
        return null;
      }
    },
    [loading, success, error, removeToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    loading,
    withToast,
  };
};
