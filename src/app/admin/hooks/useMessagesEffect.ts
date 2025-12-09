"use client";
import { useState, useCallback } from "react";
import type { ContactMessage } from "../effects/messages-effects";

export const useMessagesEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markAsRead = useCallback(async (messageId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
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
  }, []);

  return {
    markAsRead,
    deleteMessage,
    isLoading,
    error,
  };
};
