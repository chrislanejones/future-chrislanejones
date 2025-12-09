// src/app/admin/hooks/useSettingsEffect.ts
"use client";
import { useState, useCallback } from "react";

type UseEffectMutationReturn<A> = {
  execute: () => Promise<A | null>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
};

interface SeedResult {
  sourceId: string;
  label: string;
  success: boolean;
  message: string;
  timestamp: number;
  duration: number;
}

export const useSeedAllSources = () => {
  const [results, setResults] = useState<SeedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const seed = useCallback(
    async (
      dataSources: any[],
      selectedIds: Set<string>,
      onLog?: (message: string) => void
    ) => {
      setIsLoading(true);
      setError(null);
      setResults([]);

      try {
        const seedResults: SeedResult[] = [];

        for (const source of dataSources) {
          if (!selectedIds.has(source.id)) continue;

          onLog?.(`⏳ Reseeding ${source.label}...`);

          try {
            const startTime = Date.now();
            const message = await source.mutation();
            const duration = Date.now() - startTime;

            seedResults.push({
              sourceId: source.id,
              label: source.label,
              success: true,
              message:
                typeof message === "string"
                  ? message
                  : message?.message || "Success",
              timestamp: Date.now(),
              duration,
            });

            onLog?.(`✅ ${source.label} completed in ${duration}ms`);
          } catch (err) {
            const errorMsg =
              err instanceof Error ? err.message : "Unknown error";

            seedResults.push({
              sourceId: source.id,
              label: source.label,
              success: false,
              message: errorMsg,
              timestamp: Date.now(),
              duration: 0,
            });

            onLog?.(`❌ ${source.label}: ${errorMsg}`);
          }
        }

        setResults(seedResults);
        return seedResults;
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

  return { results, isLoading, error, seed };
};
