# Architecture Decision Records

[Chapter 10 overview](README.md) · [Book contents](../README.md)

One decision, one numbered file, one focused record. Numbers are never reused and never
renumbered. Status stays `draft` until Chris accepts it. Superseded records stay
in place — a later ADR points back at the one it replaces.

| #   | Title                                                                       | Status | Date       |
| --- | --------------------------------------------------------------------------- | ------ | ---------- |
| [001](001-social-links-convex-table.md) | Social links move from hard-coded TSX arrays into a Convex `socialLinks` table | draft | 09-27-2026 |
| [002](002-resume-in-convex-storage.md) | The downloadable resume moves out of git into Convex file storage | draft | 10-13-2026 |
| [003](003-sanitize-blog-html-with-dompurify.md) | Sanitize blog HTML with DOMPurify; posts can't run scripts | draft; superseded in part by 008 | 10-13-2026 |
| [004](004-public-write-rate-limits-and-shared-owner-policy.md) | Rate-limit public writes with the Convex rate-limiter; one fail-closed owner policy | draft | 10-13-2026 |
| [005](005-enforced-csp-without-nonces.md) | Enforce a host-allowlist CSP; keep inline scripts until nonces are decided | proposed | 10-14-2026 |
| [006](006-admin-resume-upload.md) | The owner can replace the resume from the admin panel (extends ADR-002) | proposed | 10-14-2026 |
| [007](007-strict-project-category-and-drop-sociallinks-field.md) | `projects.category` is a strict union, and the deprecated `siteSettings.socialLinks` field is gone | proposed | 10-14-2026 |
| [008](008-sanitize-blog-html-with-sanitize-html.md) | Sanitize blog HTML with sanitize-html instead of isomorphic-dompurify (supersedes ADR-003 in part) | proposed | 10-14-2026 |
| [009](009-page-banners-use-recorded-video-loops.md) | The home hero and page banners show a still, then a recorded video loop, instead of live three.js | draft | 10-15-2026 |

## Beach-version retrospective records

Written on 2026-10-21 from the current implementation. Draft records do not imply historical approval or a production release. Earlier ADRs remain numbered and linked for continuity; no original-site backfill was added.

| # | Title | Status | Recorded |
| --- | --- | --- | --- |
| [010](010-app-router-and-auth-boundaries.md) | App Router with separate public and authenticated providers | draft | 2026-10-21 |
| [011](011-coastal-tokens-and-theme.md) | Share coastal tokens and one theme store | draft | 2026-10-21 |
| [012](012-progressive-motion-and-lazy-webgl.md) | Load interactive WebGL near the viewport and respect motion preferences | draft | 2026-10-21 |
| [013](013-sandcastle-state-and-rendering.md) | Keep sandcastle rules in a reducer separate from the Three.js scene | draft | 2026-10-21 |
| [014](014-convex-content-and-local-presentation.md) | Separate editable Convex content from local presentation rules | draft | 2026-10-21 |
| [015](015-browser-tabs-server-preloading.md) | Preload Browser Tabs for HTML and retain live subscriptions | draft | 2026-10-21 |
| [016](016-metadata-and-truthful-sitemap-dates.md) | Centralize identity metadata and emit only tracked sitemap dates | draft | 2026-10-21 |
| [017](017-media-storage-boundaries.md) | Keep uploaded images, resume storage and versioned scene assets distinct | draft | 2026-10-21 |
| [018](018-deferred-analytics.md) | Defer analytics until interaction or idle time | draft | 2026-10-21 |
| [019](019-dependency-updates-and-compatibility.md) | Update dependencies while preserving supported toolchain boundaries | draft | 2026-10-21 |
| [020](020-separate-frontend-and-backend-deployments.md) | Release the frontend and Convex backend as separate targets | draft | 2026-10-21 |
