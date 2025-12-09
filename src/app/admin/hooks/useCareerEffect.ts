"use client";
import { useState, useCallback } from "react";
import type { CareerEvent } from "../effects/career-effects";

export const useCareerEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = useCallback(async (event: Partial<CareerEvent>) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { success: true, data: event };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createEvent,
    isLoading,
    error,
  };
};
