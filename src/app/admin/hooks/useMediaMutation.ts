"use client";
import { useState, useCallback } from "react";
import type { MediaFile } from "../effects/media-effects";

export const useMediaMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadMedia = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        uploaded: files.length,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignMedia = useCallback(
    async (mediaId: string, targetType: string, targetId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    uploadMedia,
    assignMedia,
    isLoading,
    error,
  };
};
