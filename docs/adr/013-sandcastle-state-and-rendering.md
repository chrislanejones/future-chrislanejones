# ADR-013: Keep sandcastle rules in a reducer separate from the Three.js scene

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The sandcastle combines terrain changes, placed pieces, undo and several input methods. Putting rules entirely inside meshes would make behavior difficult to test and input methods inconsistent.

## Decision

Keep state transitions and terrain/piece rules in `sandcastle-model.ts`. The React builder dispatches shared actions from input controls, while the lazy Three.js scene renders state and reports placement intent. Undo/reset stay in the model. Keep play state local to the mounted feature rather than persisting each edit in Convex.

## Consequences

Rules can be tested without a GPU and different inputs can use the same operations. Scene code still needs browser checks for picking and visuals. Reloading/unmounting can lose a creation; this is a small portfolio interaction rather than a persistent multiplayer editor.

## Alternatives considered in this record

Mesh-owned state couples rules to rendering. Persisting every edit adds account/network requirements and contention for a feature that currently needs neither.

## Revisit when

Saved creations, sharing or multiplayer become explicit product requirements.

## Evidence

[Model](../../src/components/coastal/sandcastle-model.ts), [model tests](../../src/components/coastal/sandcastle-model.test.ts), [builder](../../src/components/coastal/sandcastle-builder.tsx), [scene](../../src/components/coastal/sandcastle-scene.tsx).

[Decision index](INDEX.md) · [Chapter 10](README.md)
