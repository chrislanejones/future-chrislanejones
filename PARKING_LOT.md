# Parking Lot

Adjacent problems noticed during sessions — not fixed in the diff they were found in.

- **2026-07-08 — Finish the Clerk production-instance migration (user-owned).** Security is
  already enforced owner-only in code (`convex/authz.ts`) and the DEV Clerk instance
  (`amazed-akita-72`) has restricted mode ON, so no one else can sign up. A Clerk PRODUCTION
  instance for this app already exists but is "awaiting deployment." To finish: add Clerk's DNS
  records at the registrar, recreate the "convex" JWT template on the prod instance, set
  `pk_live_…`/`sk_live_…` in Vercel prod env, enable restricted mode on the prod instance, then
  repoint the Convex issuer — `npx convex env set CLERK_JWT_ISSUER_DOMAIN <prod-domain> --prod
  && npx convex deploy` (auth.config.ts is already env-driven, so no code change). Chris is the
  sole admin (Clerk id `user_36c1KtgcpJ5waZjYB39KKwB5pU3`).
- **2026-07-08 — SeoTab reactive re-sync can wipe unsaved edits (low sev).**
  `SeoTabEnhanced.tsx` re-sync effect (~line 126) reads `selectedPage` but deps on
  `[mergedPages]`; a concurrent Convex query re-run while typing calls setSelectedPage →
  overwrites formData + exits edit mode. Doesn't fire in a normal solo edit. Guard: skip
  overwrite while `isEditing`, include `selectedPage.path` in deps. **RESOLVED 10-14-2026** (PR #3) — a refresh mid-edit now waits until save or cancel; fresh data still loads when not editing.
- **2026-07-08 — Dead loading spinners (cosmetic).** `CareerTimelineTabEnhanced.tsx:~227`
  and `MessagesTabEnhanced.tsx:~156` gate a `<LoadingSpinner>` on `x === undefined`, but the
  query is `useQuery(...) ?? []`, so it's never undefined — the list flashes an empty state
  during load instead of a spinner. Keep the raw query result un-defaulted for the check. **RESOLVED 10-14-2026** (PR #3) — also fixed the same pattern in `EngagementTabEnhanced.tsx`.
- **2026-07-08 — schema decisions (from Felix SSOT audit).** (1) `projects.category` is
  `v.string()` but the client narrows to `"app"|"website"` with casts — make it a union and
  drop the casts. (2) `browserLinks.screenshotUrl`/`screenshotUpdatedAt` are read/rendered
  but never written (dead half-built feature) — build the write path or remove.
  (3) `SITE_URL` (`https://www.chrislanejones.com`) is hardcoded in ~20 files and
  `SeoTabEnhanced.tsx:662` uses the non-www apex in its canonical preview — extract one const.
  (4) Dead duplicated-shape files under `admin/effects/*` and `admin/hooks/*` are unimported
  and drifted — recommend deletion.
- **2026-07-08 — Blog `/blog/[slug]` article body not in SSR HTML (SEO).** **RESOLVED 2026-09-23** (f10d3b0):
  server-rendered article passed as children; client only mounts widgets. Original notes: The `/blog` index is
  now server-rendered (done). Post metadata, canonical, article OG tags, `BlogPosting` JSON-LD,
  and `notFound()` are all server-rendered too. The remaining gap is the article BODY text —
  it's still client-rendered via `useQuery` + imperative `innerHTML` + `new Function()` script
  re-execution (needed for interactive post widgets like the Rust-vs-GC stepper).
  ATTEMPTED 2026-07-08: passing the server-fetched post to the client component and rendering
  the body via `dangerouslySetInnerHTML` (scripts stripped, re-run on mount). It put the body
  text in SSR HTML BUT the hydrated client component left a duplicate hidden DOM copy and the
  widget script populated the wrong copy (broke interactivity). Reverted. CORRECT approach:
  make the article a **server component** (`page.tsx` already fetches the post) that renders the
  body + `<h1>` + cover + tags, with only likes/comments as a client island — the body subtree
  then never hydrates, so no duplication. The widget scripts, being in the initial server HTML,
  execute on hard-load; add a small client script-runner if client-nav interactivity is needed.
- **2026-07-08 — a11y/perf (from audit).** Accent `#6ea34d` is ~3.0:1 on white (below AA) for
  green text/hover + skip link; mobile menu is `aria-modal` with no focus trap/Escape; theme
  applied in useEffect → FOUC (next-themes is installed but unused); header nav gated behind
  isMounted (CLS); `three` (~600KB) is an unused dependency; `Footer.tsx:12` imports unused
  `dynamic`. Accent contrast is a design decision — needs sign-off. **RESOLVED 10-13/14-2026** — the green accent is retired for coastal teal (design guide, PR #8); the mobile menu is a Radix sheet with focus trap and Escape; `three` is used again (sandcastle, coast floor).
- **2026-07-08 — Dead admin hooks.** `src/app/admin/hooks/useBlogMutation.ts` (a stub that
  fakes API calls with setTimeout), `useCareerEffect`, `useSeoEffect`, `useLinksEffect`,
  and `useEngagementEffect` are imported nowhere. The stub in particular is misleading —
  it looks like the real blog save path. Candidates for deletion (Felix). **RESOLVED 10-13-2026** — the five unused hooks and `HtmlEditor.tsx` were removed.

- **2026-07-08 — MediaDrawer uses native `confirm()`** for permanent media deletion while
  every other destructive action uses a custom modal. Inconsistent UX; replace with the
  shared confirm modal pattern. **RESOLVED 10-14-2026** (PR #11) — one `ConfirmDialog` for every destructive admin action.
- **2026-07-07 — Linting is broken repo-wide.** `pnpm lint` runs `next lint`, which was
  removed in Next 16 ("Invalid project directory provided: .../lint"). Running eslint
  directly fails with `ERR_MODULE_NOT_FOUND: @eslint/eslintrc` from `eslint.config.mjs`
  (dep missing after the security dependency patching). Needs: migrate the lint script to
  the ESLint CLI and install/repair the flat-config deps. **RESOLVED 2026-09-01** — `pnpm lint` runs `eslint src convex` (see next entry).
- **2026-09-01 — 146 pre-existing lint problems, now finally visible.** Lint had been
  silently broken (`eslint.config.mjs` imported `@eslint/eslintrc`, which was never
  installed; `pnpm lint` still called `next lint`, removed in Next 16). Both are fixed —
  the config now spreads `eslint-config-next/core-web-vitals` + `/typescript` directly and
  `pnpm lint` runs `eslint src convex`. That surfaced a backlog nobody had seen:
  **65 errors, 81 warnings**. By rule: `no-unused-vars` 60w, `react-hooks/set-state-in-effect`
  22e, `no-explicit-any` 19e, `react-hooks/exhaustive-deps` 16w, `react/no-unescaped-entities`
  16e, `@next/next/no-img-element` 3w, plus a handful of `react-hooks/purity`,
  `no-empty-object-type`, `jsx-a11y/alt-text`. None were introduced by the Sept 2026 package
  update — they were always there, just unreported. The 16 `no-unescaped-entities` and 60
  `no-unused-vars` are mechanical; the 22 `set-state-in-effect` need real thought per site. **MOSTLY RESOLVED 10-14-2026** — 0 errors; 22 warnings left (PR #16 removed 29 unused imports). The rest are half-wired admin pieces (Media gallery-slot metadata editing, unused create/assign/unassign mutations, `onSignOut`, `handleMarkAsRead`) and type-only imports in `convex/`.
- **2026-09-01 — TypeScript 7 is blocked by typescript-eslint.** TS 7.0.2 typechecks this
  repo clean (only fix needed was react-day-picker v10 renaming `initialFocus` → `autoFocus`),
  but `typescript-eslint` 8.69 hard-refuses TS 7 ("does not support TS 7.0"), which takes
  `eslint-config-next` down with it. Held at TS 6.0.3 so the lint gate stays runnable.
  Retry when typescript-eslint ships TS 7 support (tracking:
  https://github.com/typescript-eslint/typescript-eslint/issues/10940).
- **2026-09-23 — Older titles still live in SEO metadata (found while swapping the hero title).**
  The hero and link-page h1 now read "Senior Web Engineer | React, TypeScript & Rust/WebAssembly
  | AI Automation | Enterprise CMS & WCAG Accessibility", but two spots still carry older
  titles: the home `<title>` ("Chris Lane Jones | Senior Web Engineer & AI Automation", seeded in
  `convex/seo.ts:135` and editable in the admin SEO tab) and the Person JSON-LD `jobTitle`
  ("Full-Stack Web Developer") plus its description in `src/app/page.tsx:35`. Chris to decide
  whether those should follow the new title; the `<title>` is a length/keyword call, not a paste.
  **MOSTLY RESOLVED 2026-09-23** (39767c6): jobTitle, JSON-LD, layout, fallbacks and SEO seed
  updated. Live `/` and `/career-and-resume` titles come from Convex rows — edit them in the
  admin SEO tab (Chris) to finish.
  Also: the Codeberg repo's website field was not checked (GitHub's was fixed).
- **2026-09-23 — Three unused dependencies found during the README audit.**
  `react-dnd`/`react-dnd-html5-backend` (package.json) are never imported —
  admin drag-to-reorder (Clients, Career Timeline, Pages & Menu tabs) is
  hand-rolled with native `onDragStart`/`onDragOver`/`onDrop`. `three` is
  still unused too, confirming the 2026-07-08 finding survived the Sept 2026
  dependency bump. All three are dead weight in `package.json`; remove or
  wire up. **RESOLVED 2026-09-23** — removed in 228d27a.
- **2026-09-23 — Admin-showcase screenshots are dead-wired.**
  `AdminShowcasePage.tsx`'s `sections[].image` paths (e.g.
  `/admin-showcase/dashboard.webp`) are defined but never rendered — the
  component always shows a static "Screenshot coming soon" placeholder.
  Dropping files into `public/admin-showcase/` per its README won't do
  anything until the component actually renders `section.image`.
- **2026-09-23 — `/site-map` gaps found during the README audit.** The
  Sitemap card's link list omits `/blog` and `/admin-showcase`; its
  "Changelog" card is a permanent "Coming Soon" placeholder with no data
  behind it; ~~its BlueSky link 404s~~ — false alarm: the link works in a
  browser and the handle resolves (the audit's curl sent no user agent).
  Fixed in the same pass: the card's "Next.js 14" copy (now 16) and a
  `/logo` link that should have been `/logo-page`. **RESOLVED 10-13-2026** — `/blog` and `/admin-showcase` are in the Sitemap card now.

- **2026-09-23 — Codeberg repo metadata still unchecked.** Tried to verify
  the Codeberg mirror's description/website field for this audit;
  codeberg.org was unreachable from this sandbox (curl and WebFetch both
  timed out). Still needs a manual check — see the 2026-09-23 entry above.
  **Checked later 2026-09-23 via API:** description is stale ("Next.js 14…
  Effect") and website is blank. Needs a Codeberg login to edit (Chris).
- **2026-09-23 — Security audit follow-ups (Vera).** Fixed same day: public
  `getComments` leaked commenter emails (a5aa3bd, **Convex deploy pending**);
  security headers + report-only CSP (8060d99). Still open, all Low: (1) no
  rate limit/captcha on `toggleLike`, `addComment`, `contactMessages.create`;
  (2) `src/middleware.ts:53` lets any signed-in Clerk user load the `/admin`
  shell (data stays owner-gated); (3) JSON-LD in `blog/[slug]/page.tsx:98` and
  `ConferenceDetailPage.tsx:39` doesn't escape `<`; (4) `convex/seo.ts` 97/106/
  117/129 lack `args: {}`; (5) blog inline scripts via `new Function` — keep or
  port to React widgets. Enforce the CSP (rename the header) once the console
  stays clean. **RESOLVED 10-14-2026** — (1) rate limits + validation (PR #1); (2) server-side owner gate on /admin (PR #1); (3) `jsonLd()` escapes `<`; (4) explicit `args` (PR #1); (5) DOMPurify, stored scripts no longer run (469b929); CSP enforced (PR #4).
- **2026-09-23 — AI/SEO: blog bodies are the biggest remaining gap.** **RESOLVED same day** (f10d3b0): posts now
  serve 250–2,860 words to non-JS crawlers. Leftover: 2 posts (web-worker, Next.js 14) put an
  `<h1>` inside their body, giving the page two h1s — change it to `##`/`<h2>` in the admin editor. **RESOLVED 10-14-2026** (PR #18) — the bodies were already h2; the second h1 came from the `loading.tsx` fallback ("One moment."), now a paragraph.
  Crawlers that skip
  JavaScript see ~81 words of a post (title/excerpt only); every other page serves 230–670.
  `/llms-full.txt` now carries full post text as a stopgap, but Google and most AI crawlers
  read the page, not llms.txt. The real fix is the server-rendered article from the
  2026-07-08 "Blog body not in SSR" entry above.
- **2026-09-24 — Admin leftovers from the UI pass (290a880).** (1) Stale banner rows for
  `/career`, `/projects/apps`, `/projects/websites` (all redirect now): select each in the SEO
  panel and click Delete — the panel can delete header-only rows now. Keep `/fallback`.
  (2) Settings → Profile is empty in prod and nothing on the public site reads `siteSettings`;
  wire it up or drop the form. **RESOLVED 09-27-2026** — Profile moved out of Settings into its
  own "Profile & Social" panel, and the avatar now feeds the home page "My Ramblings" card and
  the link page. Still needs its one-time seed in prod (Settings → Data Management → Profile). (3) `src/app/admin/components/HtmlEditor.tsx` is unimported
  (the blog uses HtmlEditorEnhanced). (4) The Messages inbox is mostly SEO spam — see the
  rate-limit/Turnstile item in the security follow-ups.
- **2026-09-27 — Drop the deprecated `siteSettings.socialLinks` object.** Social links live in
  their own `socialLinks` table now, but the old embedded object
  (github/linkedin/twitter/codepen/youtube) is still on the production `siteSettings` document,
  so the schema keeps it as optional. Nothing reads or writes it. Clean-up is a one-line
  migration that patches the field to `undefined` on the single row, then removes it from
  `convex/schema.ts` — worth doing on the next Convex migration pass, not on its own. **RESOLVED 10-14-2026** — the prod row no longer had the field, so it was dropped from the schema with no data migration.
- **2026-09-27 — Prod social/profile data was imported by CLI, not by the seed buttons.** The
  seed mutations are admin-gated (`requireAdmin`) and `npx convex run` has no Clerk identity,
  so prod was populated with `npx convex import --prod` instead: 16 `socialLinks` rows, the
  headshot appended to `media`, and the `siteSettings` row replaced with avatar/name/bio added
  (its `_id`, `_creationTime` and `location` preserved). A full snapshot was taken first. The
  seed function and the imported rows are generated from the same list, but nothing enforces
  that — if the seed changes, re-import or reseed rather than assuming they still match.
- **2026-09-27 — The link-page card headings are still hard-coded.** `LinkGrid.tsx` now pulls the
  avatar and every button from Convex, but the `<h1>` job title and `<h2>` tagline above them are
  still literals in the component. The profile row already has a `bio` field doing nothing —
  either wire those two headings to Convex or accept they're static and note it.
- **2026-09-27 — Outage: a missing Convex function blanked the whole site.** After the
  socialLinks commit shipped to Vercel but BEFORE `npx convex deploy` ran, prod Convex had no
  `socialLinks:*` functions. `Header` and `Footer` sit in the root layout and called
  `useQuery(api.socialLinks.getForHeader/getForFooter)`; Convex's `useQuery` THROWS on a server
  error, and a throw during render in the root layout took every page down with
  "This page couldn't load" — the HTML still returned 200, so uptime checks would not have
  caught it. Fixed by moving those queries into `social-icon-row.tsx` behind an error boundary
  that falls back to the hard-coded lists, plus a per-tab boundary in the admin dashboard and one
  around the link page's link card. **Standing rule: never call `useQuery` from a component in
  the root layout without an error boundary, and deploy Convex BEFORE (or with) the frontend that
  depends on it — the two deploys are independent and the frontend always wins the race.**
- **2026-10-13 — Admin upload UI for the resume.** Resume now lives in Convex storage
  (ADR-002); updates go through `scripts/upload-resume.sh` from the CLI only. An Admin →
  Career tab uploader would remove the CLI step. The script also uploads PDF then Word in two
  steps, so a failure halfway leaves a mismatched pair live. **RESOLVED 10-14-2026** (PR #24) — Admin → Career Timeline has a Resume files panel; each format uploads and publishes independently.
- **10-13-2026 — Add the VITA major IT projects dashboard as a project.** Chris built
  https://www.vita.virginia.gov/demo/major-it-projects-current-and-forecast-expenditure/
  for VITA. Needs a card in `src/data/projects-data.ts` (or the Convex projects table via
  /admin → Projects), a screenshot in `public/projects/`, and a short description in his voice. **RESOLVED 10-13-2026** — added to Projects (Convex + fallback snapshot).

- **10-13-2026 — Resume WIP in the beach worktree diverges from prod.** The committed
  `convex/resume.ts` (ported from old main, `getDownload`/`setFile`) is what prod Convex runs
  and what the live career page uses. The uncommitted working-tree `convex/resume.ts`
  (`getCurrent`/`publishOctober2026`) and `CareerPage.tsx` edits are a different design.
  Do NOT run `convex deploy` from this worktree while they're uncommitted: it would replace
  `getDownload` and break the live resume links. Either drop the WIP or finish it and deploy
  both halves together. **RESOLVED 10-13-2026** — the WIP put resume files back in git, against ADR-002, so only its copy changes shipped; the Old Website footer link was deleted in prod. The WIP is saved at `/tmp/claude-trash/2026-10-13/resume-wip.patch`.

- **10-13-2026 — Mobile performance follow-ups (home scores 74 mobile / 98 desktop).**
  Remaining Lighthouse savings on `/`: gtag.js is 159 KB and the single largest download
  (consider dropping GA for PostHog alone, or loading it only after consent); two
  render-blocking CSS chunks (~340 ms); the shared client chunk (`3x023…`, ~800 ms CPU at
  4x slowdown) — audit framer-motion and lucide imports for tree-shaking; project preview
  images could be served at 640w on phones (61 KB).
  **Re-measured 10-14-2026** (Lighthouse 12, mobile, 3 runs): score **80–88**, TBT ~100 ms, CLS 0,
  render-blocking ~0 ms, gtag no longer loads during page load. What's left is LCP **3.8–4.6 s**, all
  of it render delay on the hero photo (it downloads by ~0.7 s). Codex's 3D hero (draft PR #22)
  replaces that image, so re-measure LCP after it lands instead of tuning the photo now.
- **10-13-2026 — Clerk is scoped to /admin now.** `ClerkProvider` lives in
  `src/providers/ConvexAdminProvider.tsx`, mounted by `src/app/admin/layout.tsx`; the public
  site uses a plain `ConvexProvider`. Any future public page that needs `useAuth`/`useUser`
  must mount inside that provider or it will throw.

## 10-14-2026 — hero loading

- The light ocean layer (`hero-ocean-lite.tsx`) copies the sea part of the terrain shader and the camera from `hero-coast-scene.tsx`. Move the shared GLSL and camera numbers into one module so the two can't drift.
- `public/hero/coast-{light,dark}.webp` are screenshots of the live 3D. Recapture them whenever the scene's look or camera changes; a small capture script would make that one command.
- `/blog/[slug]` returns 200 for missing slugs (soft 404) because `src/app/blog/loading.tsx` streams the response.
- **10-14-2026 — `braces` advisory has no fix yet (dev only).** High-severity ReDoS in `braces <=3.0.3`
  via `eslint-config-next > @next/eslint-plugin-next > fast-glob > micromatch`. Lint tooling only,
  never shipped. `postcss-selector-parser` was patched by override (PR #15). Re-run `pnpm audit`
  when a fixed `braces`/`micromatch` lands.
- **10-14-2026 — Codex's hero WIP is behind main.** `~/repo/future-chrislanejones-beach` holds
  uncommitted 3D coast hero work (`hero-coast-scene.tsx`, `hero-coast-model.ts`, `hero-photo.tsx`,
  `page.tsx`, `coastal.module.css`) on a base 50+ commits behind `main`. Commit it to a branch and
  rebase on `main` before shipping; its CSS and `page.tsx` edits overlap today's merges. **RESOLVED 10-14-2026** — hero shipped on `feat/3d-coast-hero`, patched onto `main`.
- **10-14-2026 — ADRs 003, 004 and 005 are drafts.** DOMPurify blog sanitizing (003), public-write
  rate limits + shared owner policy (004), enforced CSP without nonces (005). Chris to accept or edit.
- **10-14-2026 — Media Manager: no UI for home-gallery slot alt text/description.**
  `handleEditGalleryMetadata`/`handleSaveGalleryMetadata` exist in `MediaTabEnhanced.tsx` but no
  control opens them; the library view (PR #17) covers per-image alt text and filename. **RESOLVED 10-14-2026** (PR #23) — Edit details under each filled slot.
- **10-14-2026 — Hero ocean layer duplicates the sea shader.** `hero-ocean-lite.tsx` copies the
  sea part of the terrain shader and the camera from `hero-coast-scene.tsx`. Move the shared GLSL
  and camera numbers into one module so the two can't drift.
- **10-14-2026 — Hero stills go stale with the scene.** `public/hero/coast-{light,dark}.webp` are
  screenshots of the live 3D. Recapture them whenever the scene's look or camera changes; a small
  capture script would make that one command.
- **10-14-2026 — Blog soft 404.** `/blog/[slug]` returns 200 for missing slugs because
  `src/app/blog/loading.tsx` streams the response.
- **10-15-2026 — Home hero 3D files are unused now.** The home hero shows stills of the newer
  3d-world (docs/handoffs/2026-10-15-page-banner-scenes.md), so nothing imports
  `hero-coast-scene.tsx`, `hero-ocean-lite.tsx`, `ocean-clock.ts`, `hero-coast-model.ts` or
  `coast-atmosphere.tsx` any more. Choose between deleting them and porting the newer town into
  the site so the hero can move again. The README's "How the hero loads" section still describes
  the old three stages and needs a chris-voice rewrite either way.
- **10-15-2026 — `street-view-banner.tsx` lives only as uncommitted WIP** in
  ~/repo/future-chrislanejones-beach, never on main. The scene banners replace it; drop it
  there once that branch is reconciled.
- **10-15-2026 — Site-history banner shows the edge of the 3D world.** Its aerial
  camera still catches the flat field and haze where the town ends (top left), which
  Chris flagged on /projects. Re-shoot it tilted down like projects
  (docs/handoffs/2026-10-15-page-banner-scenes.md).
- **10-15-2026 — 3d-world loop mode.** Blending each moving part (waves, tree bend,
  flags, boat) with itself one period earlier would make recordings repeat exactly,
  with no pixel crossfade or ghosting at the seam. Started as branch `feat/loop-mode`
  in ~/ai-repo/3dworld-loop (no commits yet). A "Record loop" button with WebCodecs
  would replace the scratch recording scripts.
- **10-21-2026 — `THREE.Clock` deprecation warning.** Every R3F `<Canvas>` logs it once:
  @react-three/fiber 9.8.2 (latest stable) still builds its store clock with `new THREE.Clock()`.
  Nothing in our code to change; it goes away when R3F 10 ships stable and we upgrade.
- **10-21-2026 — Dead link in Browser Tabs.** `azumbrunnen.me` answers 410 Gone, so its favicon
  and Google's fallback both 404 in the console. Delete the row (Admin → Browser Tabs) and the
  entry in `src/data/linkSeed.ts`, or point it at a new URL.
- **10-21-2026 — Prod Convex React Icons favicon.** The seed now uses
  `https://react-icons.github.io/react-icons/favicon.png`; the prod `browserLinks` row still has
  `/favicon.ico` (404). Edit it in Admin or run `browserLinks:update --prod`.
- **10-21-2026 — Missing blog image.** `/blog/rust-vs-gc.webp` 404s on
  /blog/rust-borrow-checker-vs-garbage-collector (live and local); the file isn't in `public/blog/`.
