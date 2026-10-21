# Chapter 1: Getting started

[Book contents](../../README.md) · [Project home](../../../README.md) · [Next chapter](../02-architecture/README.md)

Use Node.js **22 (22.13 or newer) or 24+**, pnpm, and your own Convex and Clerk projects. UploadThing supports admin media uploads; PostHog supports analytics.

### 1. Install dependencies

```bash
git clone https://github.com/chrislanejones/future-chrislanejones-beach.git
cd future-chrislanejones-beach
pnpm install --frozen-lockfile
```

### 2. Connect Convex

```bash
pnpm exec convex dev
```

Follow the CLI prompts to select or create a development project. It writes deployment configuration to `.env.local` and syncs the functions in `convex/`. Keep this process running while developing.

### 3. Configure the frontend

Add your own values to `.env.local`, preserving the deployment values written by Convex:

```dotenv
# Convex deployment and public endpoints
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment-name.convex.site

# Clerk application keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk user IDs allowed to upload media through the Next.js API
ADMIN_USER_IDS=user_your_clerk_user_id

# UploadThing v7 token for admin uploads
UPLOADTHING_TOKEN=your_uploadthing_token

# PostHog project key and ingestion host
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

`.env.local` is ignored by Git. Public pages use the unauthenticated Convex provider. Clerk loads under `/admin` and protects uploads through the API middleware. Analytics start after interaction or a delay. Configure the corresponding integrations when adapting the site.

### 4. Configure backend authentication

In Clerk, create a JWT template named `convex` using the Convex template. Set these variables on your **Convex development deployment**, using the dashboard or CLI:

```bash
pnpm exec convex env set CLERK_JWT_ISSUER_DOMAIN https://your-clerk-frontend-api-domain
pnpm exec convex env set ADMIN_USER_IDS user_your_clerk_user_id
```

Use the Clerk issuer URL for the same application as your frontend keys. Set `ADMIN_USER_IDS` in both environments: Convex uses it for content administration, and Next.js uses it for upload authorization. Convex fails closed when its allowlist is missing. Next.js also fails closed in production; its development-only fallback is not a substitute for configuring your own owner ID.

See [convex/auth.config.ts](../../../convex/auth.config.ts), [convex/authz.ts](../../../convex/authz.ts), and the [upload endpoint](../../../src/app/api/uploadthing/core.ts).

### 5. Start the website

In a second terminal:

```bash
pnpm run dev
```

Open [localhost:3000](http://localhost:3000). To use Webpack explicitly:

```bash
pnpm run dev --webpack
```

Sign in at `/admin` with an allowed Clerk account. The Settings → Data Management panel provides seed controls for supported content sections. Content records live in the connected Convex deployment; cloning this repository does not copy the existing database.

## Before changing backend data

Confirm the deployment name in `.env.local` and the Convex dashboard. Frontend and backend environments are separate. Never copy a production deployment key into a shared example. The dependency installation and frontend checks do not deploy backend functions.

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Next chapter](../02-architecture/README.md)
