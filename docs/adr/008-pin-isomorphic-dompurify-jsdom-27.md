# ADR-008: Pin isomorphic-dompurify's jsdom to 27.3.0 so blog posts render on Vercel
Date: 2026-10-14   Status: proposed

## Context
On Vercel, every on-demand render of `/blog/[slug]` returns 500 with
`ERR_REQUIRE_ESM`. Prerendered posts are served from cache, so admin edits never
show up, and new or unknown slugs 500. Reproduced on a Vercel preview of main on
10-14-2026 (unknown slug: 500 MISS; prerendered post: 200 PRERENDER). Local
`next start` loads the module fine; only Vercel's runtime fails. The chain is
isomorphic-dompurify 4.5.0 → jsdom 30.1.2 → html-encoding-sniffer 7 /
whatwg-url 17 → `@exodus/bytes`, which is ESM-only. jsdom 26.x and 27.0–27.3 use
html-encoding-sniffer ^4 and don't depend on `@exodus/bytes`; 27.4.0 and 28+ do.

## Decision
Add a pnpm override in `package.json`: `"isomorphic-dompurify>jsdom": "27.3.0"`,
the newest jsdom without `@exodus/bytes`. isomorphic-dompurify stays at 4.5.0
and DOMPurify stays on the latest 3.4.x (3.4.16 today). This amends ADR-003's
dependency setup only; the sanitizing decision and policy don't change.

## Consequences
+ The ESM-only module is out of the production tree: `pnpm why @exodus/bytes
  --prod` is empty, and jsdom 30.1.2 remains only as vitest's dev peer.
  `pnpm audit --prod` reports no known vulnerabilities.
+ DOMPurify keeps getting security updates, since isomorphic-dompurify isn't
  downgraded.
- isomorphic-dompurify 4.5.0 declares jsdom ^29 or ^30, so we run it on a jsdom
  it doesn't support. It only calls `new JSDOM('')` and uses the window, which
  is why this works, but any upgrade can change that.
- jsdom on the server is frozen at 27.3.0 and misses jsdom fixes until the
  override comes out.
- Tests run on jsdom 30.1.2 (vitest) while production runs on 27.3.0, so a
  green test run doesn't prove server parsing behaves the same.

## Alternatives rejected
- Downgrade isomorphic-dompurify. Every release from 3.12.0 through 4.5.0
  requires jsdom ^29 or ^30, so this means going back before 3.12 and losing
  DOMPurify security updates.
- Pin Node 24 on Vercel. Tried on `fix/blog-node-24`; the preview still 500'd.
- Replace DOMPurify with sanitize-html on the server. A bigger change to a
  security-sensitive path (ADR-003). Not now.

## Revisit when
Remove the override when isomorphic-dompurify or jsdom ships a
CommonJS-compatible build, or when Vercel's runtime can `require()` the ESM
module. Re-check it on every isomorphic-dompurify upgrade.

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason:
the override outlived its purpose and became invisible. Renovate or a manual
bump moved isomorphic-dompurify to a version that uses a newer jsdom API, the
override silently forced 27.3.0 underneath it, and server sanitizing broke or
drifted from the browser. Nobody noticed because vitest runs a different jsdom
and the 11 ADR-003 cases passed there. Or the reverse: a jsdom security
advisory landed on 27.x and the pin kept us on the vulnerable line.
Early warning sign to watch for: any change to the `isomorphic-dompurify`
version in `package.json`, or a `pnpm audit --prod` hit on jsdom, without a
matching edit to this override.
