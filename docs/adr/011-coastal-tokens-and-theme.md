# ADR-011: Share coastal tokens and one theme store

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The beach redesign spans public pages, admin controls and portaled dialogs. Independent colors and toggle state make those surfaces drift.

## Decision

Use semantic coastal color, type and radius tokens with CSS Modules for layouts and shared UI primitives for controls. Keep the light/dark preference in one external React store, synchronize the document class and browser storage, and use the existing local TT Interphases fonts.

## Consequences

Theme changes propagate across surfaces. Shared tokens make contrast improvements reusable. Portal scoping and legacy global colors still need care; theme support does not itself prove accessibility.

## Alternatives considered in this record

Per-component palettes and independent toggle state are easier to start but diverge. Replacing all styling with a new design-system package would require a larger migration without resolving content hierarchy.

## Revisit when

A new surface cannot consume the semantic roles or theme changes produce mismatched controls.

## Evidence

[Design guide](../SIMPLE-DESIGN-GUIDE.md), [global styles](../../src/app/globals.css), [theme store](../../src/lib/theme-store.ts), [admin layout](../../src/app/admin/layout.tsx).

[Decision index](INDEX.md) · [Chapter 10](README.md)
