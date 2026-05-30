import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Match the admin dashboard only — NOT public pages like /admin-showcase.
const isProtectedRoute = createRouteMatcher(["/admin", "/admin/(.*)"]);

interface ConvexRedirect {
  from: string;
  to: string;
  statusCode: number;
}

// Module-level cache shared across requests within a worker instance
let redirectCache: { data: ConvexRedirect[]; at: number } | null = null;
const CACHE_TTL = 60_000;

async function getRedirects(): Promise<ConvexRedirect[]> {
  const now = Date.now();
  if (redirectCache && now - redirectCache.at < CACHE_TTL) {
    return redirectCache.data;
  }
  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!siteUrl) return redirectCache?.data ?? [];
  try {
    const res = await fetch(`${siteUrl}/redirects`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return redirectCache?.data ?? [];
    const data: ConvexRedirect[] = await res.json();
    redirectCache = { data, at: now };
    return data;
  } catch {
    return redirectCache?.data ?? [];
  }
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Check dynamic Convex redirects (skip the admin dashboard + api paths)
  const isAdminDashboard = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdminDashboard && !pathname.startsWith("/api")) {
    const redirects = await getRedirects();
    const match = redirects.find((r) => r.from === pathname);
    if (match) {
      const destination = match.to.startsWith("http")
        ? match.to
        : new URL(match.to, req.url).toString();
      return NextResponse.redirect(destination, { status: match.statusCode });
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
