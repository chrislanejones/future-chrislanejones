# ADR-010: App Router with separate public and authenticated providers

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The beach site needs crawler-visible pages and interactive content without making every public visitor load an authentication SDK.

## Decision

Use Next.js App Router for routes, server reads, metadata and handlers. Keep the root Convex provider unauthenticated. Mount Clerk and the authenticated Convex provider under `/admin`; protect admin rendering, backend operations and uploads independently. Public queries remain public by design.

## Consequences

Public pages avoid Clerk scripts and session handshakes. The backend remains usable by server-rendered pages. Two provider paths and independently configured frontend/backend environments must stay consistent; a layout guard alone cannot secure a mutation.

## Alternatives considered in this record

A root-level Clerk provider is simpler to wire but adds auth work to every public visit. A purely static frontend would need separate handling for live content, uploads and admin workflows.

## Revisit when

Public pages begin needing personalized data, or provider state crosses the public/admin boundary incorrectly.

## Evidence

[Root layout](../../src/app/layout.tsx), [public provider](../../src/providers/ConvexClientProvider.tsx), [admin provider](../../src/providers/ConvexAdminProvider.tsx), [admin layout](../../src/app/admin/layout.tsx), [ADR-004](004-public-write-rate-limits-and-shared-owner-policy.md).

[Decision index](INDEX.md) · [Chapter 10](README.md)
