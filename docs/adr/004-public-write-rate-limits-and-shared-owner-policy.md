# ADR-004: Rate-limit public writes with the Convex rate-limiter; one fail-closed owner policy
Date: 2026-10-13   Status: draft

## Context
The 2026-10-13 security review (`docs/handoffs/2026-10-13-security-handoff.md`,
findings P2 and P3) found two gaps. First, the three anonymous public mutations
(`contactMessages.create`, `blogPosts.addComment`, `blogPosts.toggleLike`) had
length caps but no rate limit. They accepted whitespace-only fields and never
checked that a post was published or that a reply's parent belonged to the same
post. A direct Convex call skips the form UI, so anyone could flood the inbox,
moderation queue, or like counts. Admin list queries `.collect()`ed those tables
with no cap. Second, the owner allowlist was parsed twice, in `convex/authz.ts`
and the UploadThing router, with different rules: an explicitly empty
`ADMIN_USER_IDS` fell back to a hard-coded id in Convex but meant "nobody" in
UploadThing. Both fell back to that id silently in production. The `/admin`
page only required a signed-in Clerk user, and sign-ups are open.

## Decision
**Rate limiting.** Mount the official `@convex-dev/rate-limiter` component
(0.4.2) in `convex/convex.config.ts`. `convex/rateLimits.ts` defines hourly
token buckets. Every write takes one token from a per-key bucket and one from a
global bucket:

| Action | Per key (key) | Global |
| --- | --- | --- |
| Contact | 5 (sender email, lowercased) | 30 |
| Comment | 10 (author email, lowercased) | 60 |
| Like toggle | 60 (localStorage visitor id) | 600 |

Convex mutations can't see the caller's IP, so every key is client-supplied and
low-trust. The global buckets bound what rotating keys can buy. Shared
validation helpers trim required fields, reject empty ones, and check email
syntax. Contact `source` must be one of the three values the site's forms send.
Comments and likes require a published post, and a reply's parent must exist on
the same post. Admin lists and counts of contact messages and comments, plus the
public approved-comment list, take at most 500 rows. The admin likes view reads
each post's `likesCount` instead of scanning `blogLikes`.

**Owner policy.** `convex/ownerPolicy.ts` (pure TypeScript, importable by both
runtimes) owns parsing: comma-separated Clerk ids, where unset, empty, and
comma-only all mean "not configured." Not configured in production gives an
empty allowlist, so access fails closed. Outside production it falls back to
the dev owner id. Convex has no reliable dev/prod signal, so `convex/authz.ts`
always uses production rules. Next (`src/lib/owner-policy.ts`) treats
`VERCEL_ENV=production`, or `NODE_ENV=production` off Vercel, as production.
UploadThing and a new server-side check in `src/app/admin/layout.tsx` share
that rule. Signed-in non-owners get an access-denied view before any dashboard
code renders.

## Consequences
+ Bursts from one key, or many rotated keys, hit a limit. Rejected calls write
  nothing, because the component is transactional and a thrown mutation rolls
  back the token too. 17 convex-test cases cover this (`pnpm test`).
+ One parsing contract. Production can't silently fall back to a hard-coded
  owner.
- A flood can drain a global bucket and block real visitors for up to an hour.
  That is acceptable for a portfolio contact form. Raise the limits or add a
  challenge if it happens.
- `ADMIN_USER_IDS` must now be set on every Convex deployment, dev included,
  and in Vercel production. A deploy without it locks the owner out until it is
  set (`pnpm exec convex env set ADMIN_USER_IDS …`).
- Lists past 500 rows are truncated (newest first). Real pagination needs
  UI work.
- The admin likes total now equals the public counter, which includes the
  seeded `likesCount` values, not a count of `blogLikes` rows.
- `convex/_generated/api.d.ts` was edited by hand, because `convex codegen`
  needs a deployment to analyze components. The next `convex dev`/`deploy`
  regenerates it.

## Alternatives rejected
- Hand-rolled table-backed counters. Racy under concurrency and lose quota on
  failed mutations. Convex's own guidelines point at the component.
- A challenge (Turnstile) verified in an HTTP action, with the write moved to
  an internal mutation. Stronger against bots, but it needs a site key, client
  widget, and CSP changes. Deferred until the limits prove insufficient.
- Keying on IP via a Next route handler. Adds a hop, and a direct Convex call
  would still bypass it unless the mutation became internal.
- Keeping the hard-coded owner fallback in production. Convenient, but it is
  the silent misconfiguration the review flagged.

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason: a
deploy reached a Convex deployment without `ADMIN_USER_IDS`, and the admin
dashboard went empty with every save failing "Unauthorized." The fail-closed
rule worked as designed, but nobody connected the empty dashboard to the env
var. Second most likely: a spam run drained the global contact bucket during a
real lead's visit, and the visitor saw "Too many requests" and left.
Early warning signs: "Unauthorized" errors in Convex logs right after a deploy,
or `Too many requests` errors from `contactMessages:create` in Convex logs.
