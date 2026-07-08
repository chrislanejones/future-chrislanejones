# Parking Lot

Adjacent problems noticed during sessions — not fixed in the diff they were found in.

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
