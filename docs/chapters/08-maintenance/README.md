# Chapter 8: Testing and dependencies

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../07-seo/README.md) · [Next chapter](../09-deployment/README.md)

## Local quality gates

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm run lint
pnpm run test
pnpm run build
```

The tests cover backend authorization and rate limits, blog sanitization, project helpers and the sandcastle model. A test pass is not a replacement for checking browser behavior: verify navigation, both themes, search, an empty search result, and the changed interactive controls. Test upload/admin changes using an owner account in the intended environment.

If diagnosing bundler behavior, `pnpm exec next build --webpack` is an explicit alternative. Production builds need valid frontend configuration and access to the selected Convex deployment. Building the frontend does not deploy backend functions.

## Dependency updates

Use pnpm only. Keep `package.json` and `pnpm-lock.yaml` together. `pnpm outdated` checks available releases; `pnpm update --latest` may introduce major-version changes. Review peer ranges and migration notes, then run the gates above. Never use an unconstrained security override that can silently replace a dependency with an incompatible major version.

TypeScript stays on the supported 6.0 line while typescript-eslint 8.72 refuses TypeScript 7. UploadThing 7 uses Effect 3; the security override for old Effect 3 releases stays inside that major even when the app's direct Effect dependency advances to 4. See [ADR-019](../../adr/019-dependency-updates-and-compatibility.md).

Run `pnpm audit` and `pnpm audit --prod` separately. An unpatched development dependency must be recorded with its actual exposure, not silently hidden or described as a clean audit. Current validation and exceptions are recorded in the [change summary](../../Change-summary.md).

## Documentation upkeep

The root README is the book cover and chapter list. Each chapter explains one area and links to the source. Use ADRs for durable architectural choices, not every small CSS edit. Date retrospective records when written and state that they describe existing code; do not invent a historical acceptance date.

Keep existing ADR identifiers stable. Handoffs remain dated evidence, not the primary operating manual. The [parking lot](../../../PARKING_LOT.md) contains outstanding and historical findings; check source before treating an old note as current.

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../07-seo/README.md) · [Next chapter](../09-deployment/README.md)
