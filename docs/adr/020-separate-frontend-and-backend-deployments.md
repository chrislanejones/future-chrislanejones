# ADR-020: Release the frontend and Convex backend as separate targets

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The beach frontend runs on Vercel while Convex functions, data and environment variables belong to a separate deployment. A frontend can compile against generated bindings for functions that have not reached its runtime backend.

## Decision

Confirm target names before release or data operations. Deploy required compatible backend changes before releasing a frontend that calls them. Treat data import/seed and environment configuration as explicit operations, not automatic side effects of a frontend build. Keep frontend and backend rollback plans separate. Follow the repository convention of previews and main-branch production only after verifying project settings.

## Consequences

Changes can be validated against the intended backend and data moves are deliberate. Releases require coordination, and a frontend rollback does not undo a schema/data migration. Current repository documentation does not substitute for a verified Vercel configuration or CI pipeline.

## Alternatives considered in this record

Assuming a Git push deploys both targets creates missing-function failures. Seeding on every build risks duplicate or overwritten data. Treating dev and production as interchangeable hides environment drift.

## Revisit when

A verified automated release pipeline coordinates both systems and can enforce compatibility, validation and recovery.

## Evidence

[Deployment chapter](../chapters/09-deployment/README.md), [ADR-007](007-strict-project-category-and-drop-sociallinks-field.md), [package scripts](../../package.json), [parking lot](../../PARKING_LOT.md).

[Decision index](INDEX.md) · [Chapter 10](README.md)
