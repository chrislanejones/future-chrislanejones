# Parking Lot

Adjacent problems noticed during sessions — not fixed in the diff they were found in.

- **2026-07-07 — Linting is broken repo-wide.** `pnpm lint` runs `next lint`, which was
  removed in Next 16 ("Invalid project directory provided: .../lint"). Running eslint
  directly fails with `ERR_MODULE_NOT_FOUND: @eslint/eslintrc` from `eslint.config.mjs`
  (dep missing after the security dependency patching). Needs: migrate the lint script to
  the ESLint CLI and install/repair the flat-config deps.
