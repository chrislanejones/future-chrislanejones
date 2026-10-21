# Chapter 10: Architecture decision records

[Book contents](../README.md) · [Previous chapter](../chapters/09-deployment/README.md) · [Project home](../../README.md)

ADRs explain why the beach site is organized this way, what each choice costs, and when to reconsider it. The chapters describe how to operate the project; the ADRs describe durable decisions.

**[Open the complete numbered index](INDEX.md).** Existing 001–009 records remain intact. Records 010–020 document the beach version retrospectively and retain draft status until accepted; their record date does not claim a historical approval date.

## Read by subject

| Subject | Records |
| --- | --- |
| Application and content boundaries | [010: App Router/auth](010-app-router-and-auth-boundaries.md), [014: Content/presentation](014-convex-content-and-local-presentation.md) |
| Coastal design and performance | [009: Recorded banners](009-page-banners-use-recorded-video-loops.md), [011: Tokens/theme](011-coastal-tokens-and-theme.md), [012: Lazy motion/WebGL](012-progressive-motion-and-lazy-webgl.md), [013: Sandcastle](013-sandcastle-state-and-rendering.md) |
| Search and discovery | [015: Server-preloaded links](015-browser-tabs-server-preloading.md), [016: Metadata and dates](016-metadata-and-truthful-sitemap-dates.md) |
| Storage and editorial data | [001: Social links](001-social-links-convex-table.md), [002: Resume storage](002-resume-in-convex-storage.md), [006: Resume uploads](006-admin-resume-upload.md), [007: Schema constraints](007-strict-project-category-and-drop-sociallinks-field.md), [017: Media boundaries](017-media-storage-boundaries.md) |
| Security and analytics | [004: Public writes/owner policy](004-public-write-rate-limits-and-shared-owner-policy.md), [005: CSP](005-enforced-csp-without-nonces.md), [008: Current sanitization](008-sanitize-blog-html-with-sanitize-html.md), [018: Analytics](018-deferred-analytics.md) |
| Maintenance and releases | [019: Dependencies](019-dependency-updates-and-compatibility.md), [020: Deployment targets](020-separate-frontend-and-backend-deployments.md) |

ADR-003's DOMPurify choice is superseded in part by ADR-008. Keep the earlier record as history rather than rewriting it to look as if the newer decision was always in place. ADR-009 records the original video rollout; current optional still-only scenes are explained in the [scene chapter](../chapters/04-design-and-scenes/README.md).

## Adding a decision

Use the next available number. Include context, the decision, consequences, alternatives, a revisit trigger and links to implementation evidence. Do not invent approval dates. Update this chapter and INDEX.md without renumbering old records. Document decisions introduced by the beach version or retained boundaries necessary to understand it; a comprehensive history of the original site is out of scope.
