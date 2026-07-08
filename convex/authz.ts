// Admin authorization for the Convex API.
//
// Convex functions are publicly callable over the internet, and Clerk sign-ups
// are open — so "is there a logged-in identity" is NOT authorization. Every
// admin query/mutation must confirm the caller is the site OWNER, not just any
// registered Clerk user. Gate on the Clerk user id (the JWT `sub` claim, which
// Convex exposes as identity.subject and which a user cannot forge).
//
// Defaults to the owner's Clerk user id so the gate is closed even before the
// env var is set (no lockout, no accidental open door). Extend/override with the
// ADMIN_USER_IDS Convex env var (comma-separated Clerk user ids):
//   npx convex env set ADMIN_USER_IDS "user_xxx,user_yyy"   (and --prod)

const DEFAULT_ADMIN_USER_IDS = ["user_36c1KtgcpJ5waZjYB39KKwB5pU3"];

function adminUserIds(): string[] {
  const fromEnv = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_ADMIN_USER_IDS;
}

// True only when the caller is authenticated AND on the admin allowlist.
// Use in admin QUERIES: `if (!(await isAdmin(ctx))) return <empty>;`
export async function isAdmin(ctx: { auth: any }): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  return !!identity && adminUserIds().includes(identity.subject);
}

// Throws unless the caller is an admin. Use in admin MUTATIONS.
export async function requireAdmin(ctx: { auth: any }): Promise<void> {
  if (!(await isAdmin(ctx))) throw new Error("Unauthorized");
}
