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
