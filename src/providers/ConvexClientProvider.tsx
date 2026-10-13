"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/** Public pages only read public queries, so they skip Clerk entirely. */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
