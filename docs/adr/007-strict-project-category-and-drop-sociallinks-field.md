# ADR-007: `projects.category` is a strict union, and the deprecated `siteSettings.socialLinks` field is gone
Date: 2026-10-14   Status: proposed

## Context
Two schema loose ends. `projects.category` was `v.string()`, while every reader
cast it to `"app" | "website"` (5 casts in the admin Projects tab), so the type
the code relied on was never enforced. `siteSettings.socialLinks`, the embedded
object ADR-001 replaced with a `socialLinks` table, stayed in the schema as
optional because the production row still carried it then. ADR-001 listed it
as a migration owed later. Both are narrowing changes, and Convex validates
every existing document against the new schema on deploy.

## Decision
`convex/schema.ts` exports `projectCategory = v.union(v.literal("app"),
v.literal("website"))`. It types the `projects` table and the `getByCategory`,
`create` and `update` args in `convex/projects.ts`, and the casts are gone
(PR #27). All 8 prod rows (5 website, 3 app) already used those two values.
`siteSettings.socialLinks` is removed from the schema (PR #25). `convex data
--prod` showed the single prod `siteSettings` row no longer had the field, so no
data migration was needed. The rule used for both, and for future narrowing:
check prod data with `convex data --prod` before narrowing a schema, and deploy
Convex before the frontend. The second half is the standing rule from the
09-27-2026 outage in `PARKING_LOT.md`, where the frontend shipped before the
Convex functions it called existed.

## Consequences
+ The category type is enforced by the server, not by casts. A bad value
  (`getByCategory("bogus")`) is rejected instead of quietly returning `[]`.
+ Closes ADR-001's leftover. One source of social links in the schema.
- Adding a third category is now a schema change plus a Convex deploy, not just
  an admin edit.
- The "check prod first" step is manual. Nothing stops a later schema PR from
  skipping it, and a dev deployment can pass while prod data fails the push.
- `browserLinks.category` is still a free `v.string()`. Only `projects` was
  narrowed.

## Alternatives rejected
- Keep `v.string()` and the casts. The type stays a promise nobody checks.
- Run a widen-migrate-narrow migration for `socialLinks` anyway. Prod had
  nothing to migrate, so it would have been ceremony.

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason: a
later narrowing PR trusted the dev deployment, skipped `convex data --prod`, and
the prod push failed schema validation mid-release, or the frontend went out
first and called args prod Convex didn't accept yet. The rule lives in an ADR
and a parking-lot note, not in a script or CI check.
Early warning sign to watch for: a `convex deploy` to prod failing with a
schema validation error, or a merged PR touching `convex/schema.ts` with no
note that prod data was checked.
