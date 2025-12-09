"use client";
import { useState, useCallback } from "react";
import type { SEOData } from "../effects/seo-effects";

export const useSeoEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [seoScore, setSeoScore] = useState(0);

  const validateAndUpdateSEO = useCallback(
    async (seoData: Partial<SEOData>) => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Calculate score
        let score = 0;
        if (seoData.title?.length ?? 0 >= 50) score += 25;
        if (seoData.description?.length ?? 0 >= 150) score += 25;
        if (seoData.canonicalUrl) score += 20;
        score += 30; // base score

        setSeoScore(Math.min(score, 100));

        return { success: true, data: seoData };
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
    validateAndUpdateSEO,
    isLoading,
    error,
    seoScore,
  };
};
