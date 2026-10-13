"use client";

import { ConvexProviderWithAuth } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useCallback, useMemo, type ReactNode } from "react";
import { convex } from "./ConvexClientProvider";

function useAuthFromClerk() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        return await getToken({ template: "convex", skipCache: forceRefreshToken });
      } catch (err) {
        console.error("Convex auth: failed to fetch Clerk token", err);
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

/**
 * Clerk and the authenticated Convex client load only under /admin, so public
 * pages don't pay for Clerk's scripts, cookies, or its dev-instance handshake.
 */
export function ConvexAdminProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#4ade80",
          colorBackground: "#0b0d10",
          colorInput: "#111418",
          colorInputForeground: "#f3f4f6",
        },
      }}
    >
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromClerk}>
        {children}
      </ConvexProviderWithAuth>
    </ClerkProvider>
  );
}
