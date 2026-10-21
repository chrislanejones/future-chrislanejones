# Chapter 6: Authentication and security

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../05-content-and-media/README.md) · [Next chapter](../07-seo/README.md)

## Owner access

Public Convex reads use an unauthenticated provider. The admin layout checks the signed-in Clerk user against the owner allowlist before rendering the dashboard. Convex independently checks `identity.subject` for protected operations. UploadThing performs its own owner check in the Next.js route. A Clerk account alone does not grant administration.

`ADMIN_USER_IDS` must be configured separately in the frontend and Convex environments. Convex fails closed if it is missing; Next.js fails closed in production. A development-only fallback exists in the shared policy and should not be relied on when adapting the project.

## Public writes

Contact submissions and supported blog interactions use server validators and the Convex rate-limiter component. The component is registered in [convex.config.ts](../../../convex/convex.config.ts). Limits and ownership checks belong on the server, not just in disabled UI controls. See [ADR-004](../../adr/004-public-write-rate-limits-and-shared-owner-policy.md).

## Content and response policy

- Blog HTML is sanitized through a shared allowlist ([ADR-008](../../adr/008-sanitize-blog-html-with-sanitize-html.md)).
- [next.config.mjs](../../../next.config.mjs) sends an enforced host-based CSP and other security headers.
- Inline scripts/styles remain permitted for the current rendering architecture; production eval is not allowed. This is a documented tradeoff, not a nonce-based CSP ([ADR-005](../../adr/005-enforced-csp-without-nonces.md)).
- HTTPS image sources are broad because saved link icons come from many hosts. Other integrations require explicit CSP hosts.
- Credentials belong in ignored environment files or deployment configuration. Never paste keys into ADRs or examples.

## Verification

Run the backend tests after changing authorization, validation or rate limits. Check negative cases as well as owner success. The existing [security handoff](../../handoffs/2026-10-13-security-handoff.md) is a dated investigation; current source and test results take precedence over its historical counts.

Analytics behavior and privacy choices are described in [ADR-018](../../adr/018-deferred-analytics.md). Delayed loading is a performance decision, not a consent mechanism.

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../05-content-and-media/README.md) · [Next chapter](../07-seo/README.md)
