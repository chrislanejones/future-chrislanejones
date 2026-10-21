# ADR-012: Load interactive WebGL near the viewport and respect motion preferences

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The coastal identity includes animation and live 3D, but these should not determine whether visitors can read the portfolio. The recorded hero decision is already covered by ADR-009.

## Decision

Keep the sandcastle and decorative coast in dynamically imported client scenes. Load near the viewport, pause ongoing motion when offscreen or the tab is hidden, and honor reduced motion. The decorative coast skips narrow screens and Data Saver. Use IntersectionObserver and the Web Animations API for public section reveals, with content present before animation starts.

## Consequences

The initial page does less graphics work and retains meaningful content without motion. Dynamic scenes introduce loading, browser/GPU failure and interaction states. Device policies differ between a decorative scene and an interactive game; they should not be described as one global WebGL cutoff.

## Alternatives considered in this record

Eagerly mounting all scenes increases initial CPU/GPU cost. Removing all interactive 3D loses a deliberate feature of the beach design. Using the legacy live town for banners is superseded by ADR-009.

## Revisit when

Initial rendering or graphics memory regress, or a feature requires interaction before its scene is ready.

## Evidence

[Coast floor](../../src/components/coastal/coast-floor.tsx), [sandcastle builder](../../src/components/coastal/sandcastle-builder.tsx), [Reveal](../../src/components/coastal/reveal.tsx), [ADR-009](009-page-banners-use-recorded-video-loops.md).

[Decision index](INDEX.md) · [Chapter 10](README.md)
