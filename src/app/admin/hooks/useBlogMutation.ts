"use client";
import { useState, useCallback } from "react";
import type { BlogPostData } from "../effects/blog-effects";

export const useBlogMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPost = useCallback(async (post: BlogPostData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, data: post };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePost = useCallback(
    async (postId: string, post: Partial<BlogPostData>) => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true, data: post };
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
    createPost,
    updatePost,
    isLoading,
    error,
  };
};
