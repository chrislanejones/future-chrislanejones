"use client";
import { useState } from "react";
import { Effect } from "effect";

type UseEffectMutationReturn<A> = {
  execute: () => Promise<A | null>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
};

export const useEffectMutation = <A, E extends Error>(
  effect: Effect.Effect<A, E, never>
): UseEffectMutationReturn<A> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const execute = async (): Promise<A | null> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await Effect.runPromise(effect);
      setIsSuccess(true);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error, isSuccess };
};
