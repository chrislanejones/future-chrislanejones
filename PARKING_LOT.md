# Parking Lot

Adjacent problems noticed during sessions — not fixed in the diff they were found in.

- **2026-07-08 — SeoTab reactive re-sync can wipe unsaved edits (low sev).**
  `SeoTabEnhanced.tsx` re-sync effect (~line 126) reads `selectedPage` but deps on
  `[mergedPages]`; a concurrent Convex query re-run while typing calls setSelectedPage →
  overwrites formData + exits edit mode. Doesn't fire in a normal solo edit. Guard: skip
  overwrite while `isEditing`, include `selectedPage.path` in deps.
- **2026-07-08 — Dead loading spinners (cosmetic).** `CareerTimelineTabEnhanced.tsx:~227`
  and `MessagesTabEnhanced.tsx:~156` gate a `<LoadingSpinner>` on `x === undefined`, but the
  query is `useQuery(...) ?? []`, so it's never undefined — the list flashes an empty state
  during load instead of a spinner. Keep the raw query result un-defaulted for the check.
- **2026-07-08 — schema decisions (from Felix SSOT audit).** (1) `projects.category` is
  `v.string()` but the client narrows to `"app"|"website"` with casts — make it a union and
  drop the casts. (2) `browserLinks.screenshotUrl`/`screenshotUpdatedAt` are read/rendered
  but never written (dead half-built feature) — build the write path or remove.
  (3) `SITE_URL` (`https://www.chrislanejones.com`) is hardcoded in ~20 files and
  `SeoTabEnhanced.tsx:662` uses the non-www apex in its canonical preview — extract one const.
  (4) Dead duplicated-shape files under `admin/effects/*` and `admin/hooks/*` are unimported
  and drifted — recommend deletion.
- **2026-07-08 — Blog is client-only (SEO).** `/blog` index and `/blog/[slug]` body render via
  client `useQuery`, so the post list and article body are absent from server HTML (crawlers
  see a spinner). JSON-LD + metadata + 404s are now server-rendered, but the body itself still
  needs SSR — fetch server-side (copy `conferences/page.tsx`), keep likes/comments as a client
  island. The `[slug]` body is delicate: content is injected via imperative innerHTML +
  `new Function()` script re-execution for interactive post widgets.
- **2026-07-08 — a11y/perf (from audit).** Accent `#6ea34d` is ~3.0:1 on white (below AA) for
  green text/hover + skip link; mobile menu is `aria-modal` with no focus trap/Escape; theme
  applied in useEffect → FOUC (next-themes is installed but unused); header nav gated behind
  isMounted (CLS); `three` (~600KB) is an unused dependency; `Footer.tsx:12` imports unused
  `dynamic`. Accent contrast is a design decision — needs sign-off.
- **2026-07-08 — Dead admin hooks.** `src/app/admin/hooks/useBlogMutation.ts` (a stub that
  fakes API calls with setTimeout), `useCareerEffect`, `useSeoEffect`, `useLinksEffect`,
  and `useEngagementEffect` are imported nowhere. The stub in particular is misleading —
  it looks like the real blog save path. Candidates for deletion (Felix).
- **2026-07-08 — MediaDrawer uses native `confirm()`** for permanent media deletion while
  every other destructive action uses a custom modal. Inconsistent UX; replace with the
  shared confirm modal pattern.
- **2026-07-07 — Linting is broken repo-wide.** `pnpm lint` runs `next lint`, which was
  removed in Next 16 ("Invalid project directory provided: .../lint"). Running eslint
  directly fails with `ERR_MODULE_NOT_FOUND: @eslint/eslintrc` from `eslint.config.mjs`
  (dep missing after the security dependency patching). Needs: migrate the lint script to
  the ESLint CLI and install/repair the flat-config deps.
