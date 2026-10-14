# Architecture Decision Records

One decision, one numbered file, one screen. Numbers are never reused and never
renumbered. Status stays `draft` until Chris accepts it. Superseded records stay
in place — a later ADR points back at the one it replaces.

| #   | Title                                                                       | Status | Date       |
| --- | --------------------------------------------------------------------------- | ------ | ---------- |
| [001](001-social-links-convex-table.md) | Social links move from hard-coded TSX arrays into a Convex `socialLinks` table | draft | 09-27-2026 |
| [002](002-resume-in-convex-storage.md) | The downloadable resume moves out of git into Convex file storage | draft | 10-13-2026 |
| [003](003-sanitize-blog-html-with-dompurify.md) | Sanitize blog HTML with DOMPurify; posts can't run scripts | draft | 10-13-2026 |
| [004](004-public-write-rate-limits-and-shared-owner-policy.md) | Rate-limit public writes with the Convex rate-limiter; one fail-closed owner policy | draft | 10-13-2026 |
| [005](005-enforced-csp-without-nonces.md) | Enforce a host-allowlist CSP; keep inline scripts until nonces are decided | proposed | 10-14-2026 |
| [006](006-admin-resume-upload.md) | The owner can replace the resume from the admin panel (extends ADR-002) | proposed | 10-14-2026 |
| [007](007-strict-project-category-and-drop-sociallinks-field.md) | `projects.category` is a strict union, and the deprecated `siteSettings.socialLinks` field is gone | proposed | 10-14-2026 |
| [008](008-pin-isomorphic-dompurify-jsdom-27.md) | Pin isomorphic-dompurify's jsdom to 27.3.0 so blog posts render on Vercel (amends ADR-003) | proposed | 10-14-2026 |
