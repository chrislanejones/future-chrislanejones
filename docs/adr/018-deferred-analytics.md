# ADR-018: Defer analytics until interaction or idle time

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

Third-party analytics can compete with the public page on initial load. App Router navigation also needs pageview tracking without enabling duplicate automatic tracking.

## Decision

Load PostHog dynamically and inject GA after the first supported interaction or a ten-second timer. Disable automatic pageview capture in those initializers, queue route-derived URLs until startup completes, and send explicit pageviews. Keep the current GA identifier in DeferredAnalytics; PostHog configuration comes from frontend environment variables.

## Consequences

Analytics work starts later and route changes can be recorded. Short visits before initialization may not be measured. Queued URLs include query strings, so avoid sensitive data in URLs and review analytics settings separately. Delaying initialization is not consent collection.

## Alternatives considered in this record

Immediate analytics increases initial work. Removing analytics avoids that cost but loses the current measurement capability. A consent workflow is a separate decision, not something this timing mechanism implements.

## Revisit when

Measurement loss, duplicate navigation events, privacy requirements or third-party host changes require a different approach.

## Evidence

[DeferredAnalytics](../../src/providers/DeferredAnalytics.tsx), [root layout](../../src/app/layout.tsx), [CSP](../../next.config.mjs).

[Decision index](INDEX.md) · [Chapter 10](README.md)
