// Admin authorization for the Convex API.
//
// Convex functions are publicly callable over the internet, and Clerk sign-ups
// are open — so "is there a logged-in identity" is NOT authorization. Every
// admin query/mutation must confirm the caller is the site OWNER, not just any
// registered Clerk user. Gate on the Clerk user id (the JWT `sub` claim, which
// Convex exposes as identity.subject and which a user cannot forge).
//
// The allowlist comes from the ADMIN_USER_IDS Convex env var (comma-separated
// Clerk user ids), parsed by the shared policy in ./ownerPolicy:
//   pnpm exec convex env set ADMIN_USER_IDS "user_xxx,user_yyy"   (and --prod)
//
// Fail closed: Convex gives functions no reliable dev/prod signal, so every
// deployment is treated as production. If ADMIN_USER_IDS is unset or empty,
// nobody is an admin. Set it on each deployment (dev and prod) before use.

import type { Auth } from "convex/server";
import { isOwnerId, parseOwnerAllowlist } from "./ownerPolicy";

function adminUserIds(): string[] {
  return parseOwnerAllowlist(process.env.ADMIN_USER_IDS, { production: true });
}

// True only when the caller is authenticated AND on the admin allowlist.
// Use in admin QUERIES: `if (!(await isAdmin(ctx))) return <empty>;`
export async function isAdmin(ctx: { auth: Auth }): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  return !!identity && isOwnerId(identity.subject, adminUserIds());
}

// Throws unless the caller is an admin. Use in admin MUTATIONS.
export async function requireAdmin(ctx: { auth: Auth }): Promise<void> {
  if (!(await isAdmin(ctx))) throw new Error("Unauthorized");
}
