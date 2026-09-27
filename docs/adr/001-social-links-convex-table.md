# ADR-001: Social links move from hard-coded TSX arrays into a Convex `socialLinks` table
Date: 2026-09-27   Status: draft

## Context
Every social icon row was a literal array in `src/components/page/links.tsx`, so
adding a platform or reordering the header meant a code change and a deploy. The
only Convex-backed alternative was the embedded `siteSettings.socialLinks`
object: five named keys (github, linkedin, twitter, codepen, youtube), no
arbitrary platforms, and no way to say "slot 3 in the header, slot 0 in the
footer." The live link page also interleaves the two sets — Home is the first
button, the React and WordPress services buttons are the last — so the grouping
that works for the header's icon row cannot reproduce it. 17 links, three
surfaces, three different orders.

## Decision
One `socialLinks` table, one row per link, with three optional slot numbers —
`headerOrder`, `footerOrder`, `linkPageOrder` — one per surface. `undefined`
means "not on that surface," and the number is the position it renders in, so a
single row sits at header slot 2, footer slot 4, and link-page slot 7 at once.
`kind` ("social" | "extra") is now only the admin panel's list grouping; it no
longer affects render order anywhere. Each surface query reads its own index over
a `q.gte(field, 0)` range: `undefined` sorts before every number, so the range
skips rows with no slot and returns the rest already in slot order. The row stores
an `iconKey` string that `src/lib/social-icons.tsx` resolves to a react-icons
component, because a React component is not a storable Convex value.
`siteSettings.socialLinks` stays in the schema as optional and deprecated — the
production document still carries it, so removing it would fail validation — but
it is gone from `updateProfile` args, so nothing writes it any more.

## Consequences
+ Adding, reordering, or retiring a link is an admin edit, not a deploy.
+ Three independent orders with no duplicated rows, and no surface has to inherit
  another's grouping — the link page can put Home first and services last.
+ Each surface read is one index range, no table scan and no sorting in JS.
+ A new platform costs one entry in `SOCIAL_ICONS`, and the admin icon picker is
  generated from that same list, so picker and renderer cannot drift.
- Two sources of truth for the same icon row: the old arrays stay in `links.tsx`
  as the cold-query fallback, on the theory that an empty header is worse than a
  stale one. Nothing tests that they still agree with Convex.
- Four order fields per row (`order` plus three slots) and no canonical order.
  Moving a link means renumbering each surface separately, and the `gte(…, 0)`
  range quietly hides any row given a negative slot.
- The deprecated embedded field now needs a migration later rather than never.

## Alternatives rejected
- Grow the embedded `siteSettings.socialLinks` object — five fixed keys, no
  per-surface ordering, no arbitrary platforms.
- A boolean `showOnLinkPage` plus the `kind` grouping for link-page order — tried
  it; it forces every social link above every extra, which puts Home last.
- Two tables, `socialLinks` + `extraLinks` — identical columns and identical
  queries; a `kind` literal is cheaper than duplicating both.
- A join table per surface — right answer only if a link could appear twice on one
  surface. It cannot, so it buys three joins for nothing.
- Store SVG markup or an icon URL on the row — markup is an injection surface to
  sanitize, a URL is a network request per icon, and both give up tree-shaking
  and the typed key.
- Migrate the deprecated embedded field away now — it is unread and harmless, and
  a data migration against the live profile document is its own riskier session.

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason: the
fallback arrays. Convex is the source of truth on three surfaces, but `links.tsx`
still holds a full copy of the header and footer rows and nothing checks that the
two agree. The first time a link is retired in the admin panel — a dead account, a
renamed handle — it disappears from Convex while any surface whose query has not
resolved yet, or any environment where the table was never seeded such as a fresh
preview deploy, keeps rendering the dead link. That reads as a caching bug, gets
chased in Convex, and the stale array is the last place anyone looks.
Early warning sign to watch for: a link edited or deleted in `/admin` still
showing in the header or footer after a hard reload, or the header and the link
page disagreeing on the same page load.
