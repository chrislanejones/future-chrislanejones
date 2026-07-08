// Convex verifies Clerk-issued JWTs against this issuer domain.
//
// To move from the Clerk DEV instance to a PRODUCTION instance, you no longer
// need to edit code — just point the Convex prod deployment at the production
// Clerk Frontend API domain:
//   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://clerk.chrislanejones.com --prod
// (create a "convex" JWT template on the production instance too). Falls back to
// the current dev instance so nothing changes until that env var is set.
export default {
  providers: [
    {
      domain:
        process.env.CLERK_JWT_ISSUER_DOMAIN ??
        "https://amazed-akita-72.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
