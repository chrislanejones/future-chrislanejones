# ADR-008: Sanitize blog HTML with sanitize-html instead of isomorphic-dompurify
Date: 2026-10-14   Status: proposed

Supersedes ADR-003 in part: the library changes, the sanitizing policy stands.

## Context
On Vercel, every on-demand render of `/blog/[slug]` returned 500 with
`ERR_REQUIRE_ESM`. Prerendered posts came from cache, so admin edits never
showed and new slugs 500'd. Local `next start` worked. Next.js always
externalizes jsdom from the server bundle, and Vercel's function runtime
(Node 22.x) refuses `require()` of ESM. jsdom 30 pulled in ESM-only
`@exodus/bytes`. Pinning jsdom to 27.3.0 removed that, and the 10-14-2026
preview still 500'd on `@asamuzakjp/css-color` (CJS, via cssstyle) requiring
ESM-only `@csstools/css-calc`. Every jsdom release brings a new one. The
sanitizer also runs during SSR of the client `BlogPostPage`, so any jsdom-based
sanitizer fails there too.

## Decision
`sanitize-html` ^2.18.0 (htmlparser2, no DOM, bundled rather than externalized)
replaces `isomorphic-dompurify` as the single sanitizer. It covers the server
render of `/blog/[slug]`, the admin preview, and the admin HTML editor (load
and paste). `BlogPostPage` no longer sanitizes in the browser: the article HTML
always comes from the server, and the client only re-mounts widgets when the
raw content changes. `isomorphic-dompurify` and the jsdom override are
removed. The policy is `POST_POLICY` in `src/lib/blog-content.ts`. It allows
content tags only, global `class`/`title`/`lang`/`dir`/`role`/`aria-*`/`data-*`
(`data-*` keeps widget markers), and per-tag attributes. Allowed schemes are
http, https, mailto, and tel, plus `data:` for images. Protocol-relative URLs
are off. Script, style, iframe, object, embed, svg, math, noscript, and similar
tags are dropped along with their contents, and `target="_blank"` links get
`rel="noopener noreferrer"`. This is slightly stricter than the old DOMPurify
policy: no `id`/`name` (DOM clobbering), no protocol-relative URLs, and the
added `rel`.

## Consequences
+ Blog posts render on demand on Vercel again. `pnpm why jsdom --prod` is
  empty, and `pnpm audit --prod` reports no known vulnerabilities.
+ All 7 published production posts produce the same output as under DOMPurify
  (token-level compare; the only difference is the added `rel`).
  `src/lib/blog-content.test.ts` has 29 tests: 21 XSS vectors (including
  noscript mutation, entity-encoded `javascript:`, `data:` links, svg/math,
  forms, style, link/meta/base) plus content that must survive (widgets,
  tables, code, https links/images, `data:` images, Markdown).
- sanitize-html (with postcss and htmlparser2) is heavier than DOMPurify. ADR-003
  rejected it for this weight. It now ships only in the admin bundle; public
  blog pages ship no sanitizer and no Markdown parser at all, so readers
  download less than before.
- sanitize-html doesn't parse with a browser DOM. Mutation-XSS safety rests on
  its attribute escaping and the strict allowlist, not on browser parsing. The
  tests pin the known vectors, not unknown ones.

## Alternatives rejected
- Pin jsdom under isomorphic-dompurify. Tried; it failed on the next ESM-only
  dependency.
- Downgrade isomorphic-dompurify. It loses DOMPurify updates and still uses
  jsdom.
- DOMPurify on linkedom or happy-dom. DOMPurify warns that these DOMs are
  unsafe.
- Force Next.js to bundle jsdom. Fragile: jsdom reads files at runtime.

## Revisit when
Vercel's runtime supports `require(esm)` and we want DOMPurify back, or
sanitize-html has a security advisory.

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason:
a parser differential. htmlparser2 reads some malformed markup one way, the
browser re-parses the sanitized string another way, and a payload that looked
like text to sanitize-html becomes an element in the page. DOMPurify avoids
this class of bug by sanitizing the browser's own parse tree. The 21 vectors
cover the known tricks, not the next one.
Early warning sign to watch for: a sanitize-html or htmlparser2 advisory, or a
widening of `POST_POLICY` (a new tag, attribute, or scheme) that doesn't add a
matching test case.
