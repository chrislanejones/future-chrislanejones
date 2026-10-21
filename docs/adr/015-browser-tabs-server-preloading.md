# ADR-015: Preload Browser Tabs for HTML and retain live subscriptions

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The original Browser Tabs client query rendered a loading placeholder in the initial response. Crawlers and visitors without JavaScript could not read its saved resource collection from that HTML.

## Decision

Await `preloadQuery(api.browserLinks.getAll)` in the route Server Component, then pass the payload to `usePreloadedQuery` in BrowserTabs. Render the same groups and anchors on the server and client. Search remains local interactive state; hydrated results continue receiving Convex updates. Preserve saved categories while applying the curated display grouping.

## Consequences

Links and labels are crawlable without client execution, and hydration retains search/live updates. Preloading uses a no-store server fetch, so the route depends on backend availability and is not a cached static snapshot merely because it exports `revalidate`. A query failure should surface as a failure rather than masquerade as an empty successful collection.

## Alternatives considered in this record

A client-only query retains the original discovery problem. A static duplicate link array drifts from admin edits. A crawler-only page adds unnecessary divergent content.

## Revisit when

The collection becomes large enough to require pagination or server-side search, or rendering latency calls for an explicit caching policy.

## Evidence

[Server page](../../src/app/browser-tabs/page.tsx), [client collection](../../src/app/browser-tabs/BrowserTabs.tsx), [Convex preloading documentation](https://docs.convex.dev/client/nextjs/app-router/server-rendering).

[Decision index](INDEX.md) · [Chapter 10](README.md)
