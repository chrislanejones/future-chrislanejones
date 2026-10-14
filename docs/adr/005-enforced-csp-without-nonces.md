# ADR-005: Enforce a host-allowlist CSP; keep inline scripts until nonces are decided
Date: 2026-10-14   Status: proposed

## Context
The 2026-10-13 security review (`docs/handoffs/2026-10-13-security-handoff.md`,
finding P2) found the site only sent `Content-Security-Policy-Report-Only`, with
`'unsafe-inline'` and `'unsafe-eval'` for scripts and broad wildcards. ADR-003
removed executable blog content, which unblocks enforcement. Next.js App Router
writes inline `<script>` tags for the RSC payload on every page. Blocking inline
scripts needs a per-request nonce (hashes don't fit per-page payloads), and a
nonce forces every page to render dynamically, losing static output and the 60 s
ISR.

## Decision
`next.config.mjs` sends an enforced `Content-Security-Policy` built from the
third parties the code loads: Clerk (Frontend API host decoded from the
publishable key), Convex (deployment origin from `NEXT_PUBLIC_CONVEX_URL`),
PostHog, GA4, UploadThing, the Wistia embed on the 404 page, and the Vercel
Toolbar on preview builds only. It sets `object-src 'none'`, `base-uri 'self'`,
`form-action 'self'`, `frame-ancestors 'none'` and `upgrade-insecure-requests`.
`'unsafe-eval'` is only sent by `next dev`. `script-src` keeps `'unsafe-inline'`
and `style-src` keeps `'unsafe-inline'`. No report-only header is sent: a
`script-src` without `'unsafe-inline'` flags every inline script Next.js writes
on every page load, which buries real console errors and costs the Lighthouse
Best Practices score without telling us anything new. Whether to adopt nonces
is left to Chris.

## Consequences
+ Scripts, connections, frames, fonts, media and workers from unlisted hosts
  are blocked; plugins, `<base>` hijacking, off-site form posts and framing are
  blocked; eval is blocked in production.
+ Static and ISR pages are unchanged.
- An injected inline script would still run. Sanitizing blog HTML (ADR-003)
  stays the main XSS defense.
- `img-src` stays open to any `https:` host because link favicons come from
  admin-entered sites.
- A new third party, or a Clerk/Convex/PostHog host change without a rebuild,
  is blocked until the allowlist or env var is updated.
