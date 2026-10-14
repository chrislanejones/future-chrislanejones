// Owner allowlist policy, shared by the Convex backend (convex/authz.ts), the
// Next.js admin route (src/app/admin/layout.tsx) and the UploadThing router
// (src/app/api/uploadthing/core.ts). Convex and Vercel keep separate env
// stores, so each side reads its own ADMIN_USER_IDS, but they parse it here so
// the semantics can't drift.
//
// Pure TypeScript with no Convex or Next imports, so both runtimes can load it.
//
// Rules:
// - ADMIN_USER_IDS is a comma-separated list of Clerk user ids (the JWT `sub`).
// - Unset, empty, or only commas/whitespace all mean "not configured".
// - Not configured in production → empty allowlist → nobody is an owner
//   (fail closed). Set the variable before deploying.
// - Not configured outside production → the dev fallback below, so local work
//   doesn't need the variable.

const DEV_FALLBACK_OWNER_IDS: readonly string[] = [
  "user_36c1KtgcpJ5waZjYB39KKwB5pU3",
];

export function parseOwnerAllowlist(
  raw: string | undefined,
  { production }: { production: boolean },
): string[] {
  const ids = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (ids.length > 0) return ids;
  return production ? [] : [...DEV_FALLBACK_OWNER_IDS];
}

export function isOwnerId(
  userId: string | null | undefined,
  allowlist: readonly string[],
): boolean {
  return !!userId && allowlist.includes(userId);
}
