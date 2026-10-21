# ADR-016: Centralize identity metadata and emit only tracked sitemap dates

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The site has editable page metadata, dynamic detail routes and static index pages. Sitemap generation previously stamped static pages and conference years with the current time even when their content had not changed.

## Decision

Use shared site/person constants and the SEO helper for canonical identity and metadata defaults. Detail routes derive metadata from their records. Keep stored update dates on conference/project details and stored update-or-creation dates on posts. Omit `lastModified` on static pages and conference-year indexes with no tracked update date. Keep all existing sitemap URLs and do not invent content dates from deploy time.

## Consequences

The sitemap no longer advertises false freshness. Static pages lose a lastmod hint until a reliable content timestamp is available. Dynamic timestamps still depend on editorial write accuracy, and missing backend data can leave a partial sitemap.

## Alternatives considered in this record

Generation-time timestamps are easy but inaccurate. A manually invented date table is brittle. Git commit time can include unrelated refactors and does not capture Convex editorial updates.

## Revisit when

Page-level update tracking becomes available, or sitemap monitoring identifies incomplete dynamic entries.

## Evidence

[Sitemap](../../src/app/sitemap.ts), [SEO helper](../../src/lib/seo.ts), [structured data](../../src/lib/structured-data.ts), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

[Decision index](INDEX.md) · [Chapter 10](README.md)
