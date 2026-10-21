# ADR-014: Separate editable Convex content from local presentation rules

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The portfolio needs owner-editable content, but some rendering choices, curated photography and fallback records are maintained with code. Cloning a repository does not copy its database.

## Decision

Keep editable records in Convex and consume them through generated API types. Keep presentation mappings, selected photo lists and fallbacks in `src/data` and related helpers. Use admin tools for editorial changes and code review for presentation changes. Preserve the existing backend schema and social-link decisions rather than reconstructing their pre-beach history.

## Consequences

Content can update without redeploying every page, and rendering rules are versioned. Fallbacks can become stale or hide missing setup. A stored category and a displayed group may differ deliberately; changes need checking on the actual consuming surface.

## Alternatives considered in this record

All-static content would turn routine editing into code changes. Moving every design choice into arbitrary database fields would weaken type checking and add CMS complexity.

## Revisit when

Fallbacks repeatedly disagree with live records or editors need a presentation choice that is currently code-only.

## Evidence

[Schema](../../convex/schema.ts), [data directory](../../src/data/), [project presentation](../../src/data/project-presentation.ts), [browser grouping](../../src/app/browser-tabs/link-groups.ts), [ADR-001](001-social-links-convex-table.md), [ADR-007](007-strict-project-category-and-drop-sociallinks-field.md).

[Decision index](INDEX.md) · [Chapter 10](README.md)
