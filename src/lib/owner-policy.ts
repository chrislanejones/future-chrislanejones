// Next.js side of the owner allowlist. Parsing and semantics live in
// convex/ownerPolicy.ts so the admin route, UploadThing and Convex agree.
import { isOwnerId, parseOwnerAllowlist } from "../../convex/ownerPolicy";

// Vercel production, or a local `next start` (NODE_ENV=production without
// Vercel). Previews and `next dev` use the dev fallback.
function isProductionRuntime(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv === "production";
  return process.env.NODE_ENV === "production";
}

export function isSiteOwner(userId: string | null | undefined): boolean {
  const allowlist = parseOwnerAllowlist(process.env.ADMIN_USER_IDS, {
    production: isProductionRuntime(),
  });
  if (allowlist.length === 0) {
    console.error(
      "ADMIN_USER_IDS is not set in production; admin access is closed.",
    );
  }
  return isOwnerId(userId, allowlist);
}
