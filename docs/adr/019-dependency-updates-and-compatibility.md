# ADR-019: Update dependencies while preserving supported toolchain boundaries

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The October beach maintenance pass updates runtime and development packages. Updating every major blindly exposed two concrete failures: typescript-eslint rejects TypeScript 7, and an unbounded Effect override supplied Effect 4 to UploadThing 7.

## Decision

Use pnpm and commit the manifest/lockfile together. Advance direct dependencies to current releases when checks support them. Keep TypeScript on 6.0.x until the ESLint integration supports 7. Constrain the security override for old Effect 3 versions to a patched 3.x range, while allowing the direct app dependency to use Effect 4. Verify types, lint, tests, production build and audits; record remaining warnings instead of hiding them.

## Consequences

The update preserves the upload SDK contract and a runnable lint gate. Some latest versions remain deliberately held. ESLint plugin peer declarations may lag the installed ESLint release; passing checks and warnings must both be reported. Unpatched transitive audit findings remain follow-up work.

## Alternatives considered in this record

Forcing TypeScript 7 breaks lint today. An override such as `>=3.20.0` can cross major versions. Freezing every dependency indefinitely avoids migration work but leaves fixes and maintenance behind.

## Revisit when

TypeScript 7 support lands in typescript-eslint, UploadThing supports Effect 4, or audit fixes become available.

## Evidence

[Manifest](../../package.json), [lockfile](../../pnpm-lock.yaml), [maintenance chapter](../chapters/08-maintenance/README.md), [validation record](../Change-summary.md).

[Decision index](INDEX.md) · [Chapter 10](README.md)
