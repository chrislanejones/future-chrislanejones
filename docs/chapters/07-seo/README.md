# Chapter 7: Search and metadata

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../06-security/README.md) · [Next chapter](../08-maintenance/README.md)

## Metadata and canonical URLs

[seo.ts](../../../src/lib/seo.ts) loads editable per-page metadata from Convex with local defaults. [structured-data.ts](../../../src/lib/structured-data.ts) defines the person, site URL and shared JSON-LD graph. The root title template adds the owner's name; page titles that already contain it avoid duplication. Page-specific social metadata includes its own image because nested Next metadata is merged shallowly.

Blog, project and conference routes also build metadata for their own records. HTML embedded in JSON-LD is escaped through the shared helper. Update identity and domain values together when adapting the site.

## Browser Tabs and crawler-visible HTML

The page calls `preloadQuery` on the server and hands the payload to `usePreloadedQuery`. The initial HTML contains the saved links and category headings; hydration adds search and live updates. There is no separate crawler-only version. Convex preloading uses an uncached fetch, so this route depends on a successful server-side query rather than a static snapshot.

Verify with an HTTP fetch and inspect actual anchors/text, excluding serialized script payloads. A URL appearing only inside a script does not prove it was rendered as a link.

## Sitemap dates

[sitemap.ts](../../../src/app/sitemap.ts) includes static pages and dynamic conference, project and blog routes. Static pages and conference-year indexes omit `lastModified` because no reliable update date is tracked for those pages. Detail entries use their stored timestamps; blog entries fall back to creation time if needed. Regeneration time is never substituted for a content update.

Blog sitemap data is fetched from the Convex HTTP `/sitemap-data` endpoint. Missing configuration or backend failures can yield an incomplete sitemap, so validate its contents as well as its HTTP status. The human-readable `/site-map` is a separate page.

## Redirects and discovery

The request middleware reads active Convex redirects with a short worker-local cache and timeout. Static redirects are also configured in `next.config.mjs`. These only affect requests served by this app: they do not configure hosting for `old.`, `tech.` or client subdomains.

[robots.txt](../../../public/robots.txt) advertises the sitemap and restricts admin/API crawling. Robots exclusions are not authentication and do not guarantee deindexing. Inspect indexing and selected canonicals in Search Console; a performance export alone cannot diagnose those states.

See [ADR-015](../../adr/015-browser-tabs-server-preloading.md) and [ADR-016](../../adr/016-metadata-and-truthful-sitemap-dates.md).

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../06-security/README.md) · [Next chapter](../08-maintenance/README.md)
