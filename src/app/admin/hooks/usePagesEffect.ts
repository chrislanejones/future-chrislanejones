"use client";
import { useState, useCallback } from "react";
import type { PageNavItem } from "../effects/pages-effects";

export const usePagesEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addPageToMenu = useCallback(async (item: Partial<PageNavItem>) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { success: true, data: item };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    addPageToMenu,
    isLoading,
    error,
  };
};
