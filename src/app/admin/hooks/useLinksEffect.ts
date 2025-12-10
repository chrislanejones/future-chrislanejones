"use client";
import { useState, useCallback } from "react";
import { Effect } from "effect";
import type {
  BrowserLink,
  LinkValidationResult,
} from "../effects/links-effects";
import {
  validateLink,
  extractDomain,
  createLinkEffect,
  toggleFeaturedEffect,
  deleteCategoryEffect,
  filterLinksByCategoryEffect,
  getFeaturedLinksEffect,
  sortLinksEffect,
} from "../effects/links-effects";

export const useLinksEffect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationResult, setValidationResult] =
    useState<LinkValidationResult | null>(null);

  const validateAndCreateLink = useCallback(
    async (linkData: Partial<BrowserLink>) => {
      setIsLoading(true);
      setError(null);
      setValidationResult(null);

      try {
        const result = await Effect.runPromise(createLinkEffect(linkData));
        return { success: true, data: result };
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

  const validateLinkData = useCallback(
    async (linkData: Partial<BrowserLink>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await Effect.runPromise(validateLink(linkData));
        setValidationResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setValidationResult({
          isValid: false,
          errors: [error.message],
          warnings: [],
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getDomainFromUrl = useCallback(async (url: string) => {
    try {
      const domain = await Effect.runPromise(extractDomain(url));
      return domain;
    } catch (err) {
      return null;
    }
  }, []);

  const toggleLinkFeatured = useCallback(async (link: BrowserLink) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Effect.runPromise(toggleFeaturedEffect(link));
      return { success: true, data: result };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategoryWithLinks = useCallback(
    async (category: string, linkCount: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await Effect.runPromise(
          deleteCategoryEffect(category, linkCount)
        );
        return { success: true, data: result };
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

  const filterByCategory = useCallback(
    async (links: BrowserLink[], category: string) => {
      try {
        return await Effect.runPromise(
          filterLinksByCategoryEffect(links, category)
        );
      } catch {
        return links;
      }
    },
    []
  );

  const getFeaturedLinks = useCallback(async (links: BrowserLink[]) => {
    try {
      return await Effect.runPromise(getFeaturedLinksEffect(links));
    } catch {
      return [];
    }
  }, []);

  const sortLinks = useCallback(async (links: BrowserLink[]) => {
    try {
      return await Effect.runPromise(sortLinksEffect(links));
    } catch {
      return links;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validateAndCreateLink,
    validateLinkData,
    getDomainFromUrl,
    toggleLinkFeatured,
    deleteCategoryWithLinks,
    filterByCategory,
    getFeaturedLinks,
    sortLinks,
    clearError,
    clearValidation,
    isLoading,
    error,
    validationResult,
  };
};
