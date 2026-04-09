"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useAuthFromClerk() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        return await getToken({ template: "convex", skipCache: forceRefreshToken });
      } catch {
        return null;
      }
    },
    [getToken]
  );

  return useMemo(
    () => ({
      isLoading: !isLoaded,
      isAuthenticated: isSignedIn ?? false,
      fetchAccessToken,
    }),
    [isLoaded, isSignedIn, fetchAccessToken]
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthFromClerk}>
      {children}
    </ConvexProviderWithAuth>
  );
}
