"use client";
import { useState, useCallback } from "react";

export const useLinksEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validateAndCreateLink = useCallback(async (linkData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, data: linkData };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    validateAndCreateLink,
    isLoading,
    error,
  };
};
