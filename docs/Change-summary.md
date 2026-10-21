# Change summary

[Documentation handbook](README.md) · [Project home](../README.md)

## 2026-10-21 — Documentation and portfolio maintenance

Status: committed on `design/beach-homepage`; this entry does not assert a production release.

- Replaced the long project README with a chapter index, nine handbook chapters and an architecture-decisions chapter. Added ADR-010 through ADR-020 as retrospective draft records.
- Preloaded Browser Tabs links on the server, retained live updates, and added category navigation and grouping.
- Removed generated modification dates from sitemap entries without tracked content-update dates.
- Updated dependencies and the pnpm lockfile, retaining TypeScript 6 and a compatible Effect 3 override for UploadThing.
- Refreshed About media and changed Site History to updated still images.
- Incorporated PR #47 from `beach/main`, retaining its hero, other page banners and résumé framing while preserving the local About and Site History changes.

Validation: frozen-lockfile installation, TypeScript, ESLint, all 69 tests across six files, and the production build passed. The production dependency audit reported no known vulnerabilities.

The full dependency audit reports one high-severity development dependency finding in `braces`, reached through the Next.js ESLint plugin and `fast-glob` ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)); pnpm reports no patched version. Installation also reports ignored build scripts for `@clerk/shared` and `core-js`. The build reports the existing `middleware` convention's deprecation in favor of `proxy`.
