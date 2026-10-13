# Claude session summary: 10-13-2026 (beach site launch day)

Live site: chrislanejones.com, served by the Vercel project `future-chrislanejones`, which now
builds from **`chrislanejones/future-chrislanejones-beach@main`**. Last production deploy in this
session: `7924cfa` (docs) on top of `469b929` (security). Prod Convex: `hardy-fox-765`.

## How to work in this repo now

| Thing | Where |
| --- | --- |
| Ship from | `~/ai-repo/beach-verify` (clean worktree, branch `beach-push`, `git push beach beach-push:main`) |
| Chris's working copy | `~/repo/future-chrislanejones-beach` (branch `design/beach-homepage`, tracks `beach/main`). Codex also edits here directly |
| Convex deploy | `cd ~/ai-repo/beach-verify && git pull && pnpm exec convex deploy -y`. Never from a checkout with uncommitted `convex/` edits |
| Live content edits | `/admin` in Chrome (Chris signs in), or Convex mutations via the signed-in admin session's Clerk token |
| Old mountain site | `~/repo/future-chrislanejones` (archive; Vercel no longer watches it) |

## Shipped today (highlights)

| Area | What |
| --- | --- |
| Launch | Vercel Git source switched to the beach repo; resume-in-Convex-storage commits cherry-picked from the old repo |
| Design | Drawn shoreline banners with surfer/dolphin, sandcastle game (stacking, moats, bucket loader), waves favicon + logo card, full-screen mobile menu (no dropdowns), radio antenna, hover nav menus |
| Content | Blog covers v2 (illustrated, `/blog/covers/<slug>.webp`), new post "I Moved to a Beach Town…", PGA Golf + VITA projects, rvatech conference, outlined conference logos, SEO copy for 9 pages |
| Performance | Clerk scoped to `/admin`, analytics deferred to first interaction, WOFF2 fonts, hero water shader deferred, 18 WebPs recompressed, unused bighorn model removed. Home mobile Lighthouse 49 → 81, desktop 99 |
| Accessibility | axe WCAG 2.2 AA clean on 19 pages × 2 themes; keyboard focus visible; 0 overflow at 7 widths incl. 280px |
| Security | DOMPurify sanitizer for all blog HTML paths, stored-script execution removed, Next 16.3.8, Sharp ≥0.35.5, source-map-js ≥1.2.2; `pnpm audit --prod` clean. ADR 003 (draft) |
| CSS (from Codex) | Shared tokens, `data-coastal-theme`, `/color-guide` page |

## In flight

Two one-time cloud routines (Opus 5.5) fired at ~00:00 UTC 10-14, each opening a PR against `main`:

| Routine | Branch | Scope |
| --- | --- | --- |
| `trig_01EPJDdD8WHHHjsiVAq8NeUy` | `security/abuse-controls-and-admin-hardening` | Rate limiting + validation on contact/comments/likes, admin owner check, shared owner policy, `args: {}` on 11 functions, dead effects files, ADR 004 |
| `trig_016XZv9Kfw26VoUUzCzv2mGF` | `design/css-single-source-of-truth` | Three-role type scale, color tokens, the handoff's CSS findings list |

Check them at https://claude.ai/code/routines. **The security PR changes `convex/`: deploy Convex
from a clean checkout before or together with merging it.**

## Needs Chris

- `sudo apt-get update && sudo apt-get upgrade` (147 pending), then `sudo needrestart`.
- `fnm install 24 && fnm use 24` (Node 25 is EOL).
- `chmod 600 ~/repo/future-chrislanejones-beach/.env.local`.
- Accept or edit ADR 003 (draft).

## Still open

- Enforced CSP (nonce-based); admin redesign and Pages editor (see the CSS/admin handoff).
- MediaDrawer / Links Manager native `confirm()` → shared confirm modal.
- `/projects` mobile Lighthouse 74 (loads every screenshot up front).
- Two dev-only advisories (braces, postcss-selector-parser).
