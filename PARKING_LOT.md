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
  `no-unused-vars` are mechanical; the 22 `set-state-in-effect` need real thought per site.
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
  `/logo` link that should have been `/logo-page`.
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
  stays clean.
- **2026-09-23 — AI/SEO: blog bodies are the biggest remaining gap.** **RESOLVED same day** (f10d3b0): posts now
  serve 250–2,860 words to non-JS crawlers. Leftover: 2 posts (web-worker, Next.js 14) put an
  `<h1>` inside their body, giving the page two h1s — change it to `##`/`<h2>` in the admin editor.
  Crawlers that skip
  JavaScript see ~81 words of a post (title/excerpt only); every other page serves 230–670.
  `/llms-full.txt` now carries full post text as a stopgap, but Google and most AI crawlers
  read the page, not llms.txt. The real fix is the server-rendered article from the
  2026-07-08 "Blog body not in SSR" entry above.
- **2026-09-24 — Admin leftovers from the UI pass (290a880).** (1) Stale banner rows for
  `/career`, `/projects/apps`, `/projects/websites` (all redirect now): select each in the SEO
  panel and click Delete — the panel can delete header-only rows now. Keep `/fallback`.
  (2) Settings → Profile is empty in prod and nothing on the public site reads `siteSettings`;
  wire it up or drop the form. (3) `src/app/admin/components/HtmlEditor.tsx` is unimported
  (the blog uses HtmlEditorEnhanced). (4) The Messages inbox is mostly SEO spam — see the
  rate-limit/Turnstile item in the security follow-ups.
