# ADR-003: Sanitize blog HTML with DOMPurify; posts can't run scripts
Date: 2026-10-13   Status: draft

Superseded in part by ADR-008 (library only; the policy stands).

## Context
The 2026-10-13 security review (`SECURITY-HANDOFF-2026-10-13.md`, finding P1)
showed blog post HTML could execute JavaScript. `src/lib/blog-content.ts`
passed HTML through untouched, and its `stripScripts` regex left event handlers
(`<img onerror>`), `javascript:` links, and iframe `srcdoc` intact.
`BlogPostPage.tsx` re-created stored `<script>` tags and ran inline script text
with `new Function`. The admin preview used `dangerouslySetInnerHTML` on raw
content, and the visual editor loaded and pasted raw HTML via `innerHTML`.
Authoring is admin-only, so the real risks were pasted or imported HTML, a
compromised admin account, or future less-trusted editors, and the admin
preview runs in an authenticated context. An inventory of all 7 production
posts found 0 `<script>` tags and 0 `on*` handlers. The two interactive posts
use `data-stepper` markers mounted from source-controlled `STEPPER_CONFIGS`.

## Decision
`isomorphic-dompurify` 4.5.0 is the single sanitizer: plain DOMPurify in the
browser, DOMPurify + jsdom on the server. One policy in `sanitizePostHtml`:
HTML profile only (no SVG/MathML); forbids `style`, `iframe`, `frame`, `object`,
`embed`, `form`, `input`, `button`, `textarea`, `select`, `link`, `meta`, `base`
tags and `style`, `srcdoc`, `formaction` attributes; keeps `data-*` (widget
markers) and `target`/`rel` on links. `renderPostHtml` (HTML, or Markdown via
`marked`) always returns sanitized output and feeds the public article, the
admin preview, and the editor (load + paste). The client-side script
re-execution path (`new Function`, recreated `<script>` tags) is deleted.
Interactivity comes only from registered widget IDs.

Shipped alongside: `next` 16.3.6 → 16.3.8 (six advisories), plus
`pnpm.overrides` for `sharp` (>=0.35.5) and `source-map-js` (>=1.2.2).
`pnpm audit --prod` now reports 0. Two dev-only advisories stay open and are
accepted for now: `braces` (no upstream fix) and `postcss-selector-parser`
(fix needs a major bump). Re-check at the next dependency pass.

## Consequences
+ Stored, pasted, imported, or Markdown-embedded HTML can't run scripts on the
  public site or in the authenticated admin preview. 11 regression cases pass
  (script, img onerror, `javascript:` link, iframe srcdoc, svg onload, style
  tag/attr, Markdown raw HTML, stepper marker kept, code shown as text, link
  target kept, table kept).
+ Sanitizing at render time also covers every historical post, and an enforced
  CSP (currently report-only with `unsafe-inline`/`unsafe-eval`) is unblocked.
- jsdom adds weight to the server bundle for blog routes (server only; the
  browser gets plain DOMPurify).
- Inline styles and embeds in posts are gone. A future embed needs a dedicated
  component with an allowlisted provider.
- Nothing sanitizes on save, so raw HTML still sits in Convex and any new
  render path that skips `renderPostHtml` reopens the hole.

## Alternatives rejected
- Keep or extend the regex. Regex sanitizers miss event handlers, URL schemes,
  and parser quirks.
- `sanitize-html`. Node-oriented and heavier in the browser, and the admin
  editor needs browser-side sanitizing.
- DOMPurify browser-only. The public article is server-rendered, so the server
  has to sanitize too.
- Sanitize on save in Convex. Deferred, not rejected: render-time covers
  historical content, and a save-time pass can be added later.

Out of scope: rate limiting for public comment/contact/like mutations (P2).

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason:
a new surface renders post content without going through `renderPostHtml`.
An RSS feed, an OG/excerpt generator, a search snippet, or a second editor
reads `content` straight from Convex and drops it into `innerHTML`. The raw
HTML was never cleaned at rest, so the single-chokepoint guarantee only holds
while every caller remembers the chokepoint. The other plausible failure is
quieter: an isomorphic-dompurify or jsdom bump changes parsing on the server
so it no longer matches the browser, and nobody reruns the 11 cases.
Early warning sign to watch for: any new `dangerouslySetInnerHTML` or
`innerHTML` in `src/` that isn't fed by `renderPostHtml`, or a grep for
`post.content` / `.content` reaching JSX outside `blog-content.ts`.
