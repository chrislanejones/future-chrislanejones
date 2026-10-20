# CSS single source of truth: a handoff for Claude

Requested by Chris. Reviewed October 13, 2026, on `design/beach-homepage`.

**Security follow-up:** See [SECURITY-HANDOFF-2026-10-13.md](SECURITY-HANDOFF-2026-10-13.md) for the separate Linux/APT, dependency, Convex/admin authorization and HTML-injection audit. It includes confirmed findings, patch priorities and verification steps; it does not claim those security fixes have already been applied.

> **Current status:** The first sections record the original audit, before fixes. Implementation began later in this session at Chris's request. See **Implemented foundation and verification** below for applied changes. The admin redesign and page-content CMS remain a plan, not deployed features. Claude is concurrently working on blog covers, media assignments and the sandcastle scene; preserve those edits.

**Shared design values belong in one canonical token system. Components consume those values. Start with variables, then base typography, then shared primitives, then component layout. Use three primary text-size roles and central fluid sizing instead of inventing sizes in each component.**

This began as an audit and implementation guide; the first foundation fixes are recorded at the end. It does not mean the whole CSS migration is complete. The earlier guide Chris remembers was not located in this review; the recommendations below reconstruct that intent from this repository. Three sizes is a project simplification, not a universal CSS standard. Preserve the coastal design and active work while improving ownership.

## Confirmed worktree and active work

Linux `/proc/84746/cwd` resolved to `/home/clj/repo/future-chrislanejones-beach`; the process was `claude`. Its Next development-server shell also had this working directory. Another Claude process, PID 868, was in `rust-wasm-photo-tool`.

Recent source modification times observed, in America/New_York on October 13:

| Time | File |
| --- | --- |
| 18:19:32 | `src/components/coastal/sandcastle-scene.tsx` |
| 18:16:31 | `src/components/page/contact-form.tsx` |
| 18:16:31 | `src/app/globals.css` |
| 18:13:28 | `src/components/coastal/interior.module.css` |
| 18:13:28 | `src/components/ui/button.tsx` |
| 18:10:38 | `src/components/coastal/sandcastle-builder.tsx` |
| 18:05:28 | `src/components/coastal/coastal.module.css` |

These establish process location and recent activity; timestamps alone do not prove which process wrote each file or that a write is occurring at the instant of inspection. Re-read files before editing because Claude is working here concurrently. Existing changes in `PARKING_LOT.md`, `convex/resume.ts`, `src/app/career-and-resume/CareerPage.tsx`, and `src/lib/page-headers.ts` were already present. Preserve them.

## Complete CSS inventory

All eight authored CSS files were read, including responsive and reduced-motion sections: 3,942 lines at inspection. Counts below are static declaration counts, including overrides; they are not counts of computed sizes or confirmed visual defects. Generated/dependency CSS is excluded.

| File | Lines | Font-size declarations | Declarations without `var()` | Assessment |
| --- | ---: | ---: | ---: | --- |
| `src/app/globals.css` | 640 | 16 | 2 | Six global size tokens; duplicate selectors, competing sidebar definitions, global component styling. |
| `src/components/coastal/coastal.module.css` | 2,051 | 83 | 83 | Separate palette, 31 distinct size expressions, component and page systems bundled together. |
| `src/components/coastal/interior.module.css` | 728 | 21 | 21 | Independent heading scale, form rules, article overrides, repeated radii. |
| `src/components/coastal/conferences.module.css` | 86 | 19 | 19 | Good reuse of coastal color tokens; typography and dimensions still local. |
| `src/components/coastal/beach-banner.module.css` | 171 | 0 | 0 | Mostly illustration; local sky/sea/sand tokens are appropriate. Shared outer radius should use the UI token. |
| `src/components/coastal/sandcastle-builder.module.css` | 54 | 14 | 14 | Local heading clamp and mobile override; many independent control sizes/radii. |
| `src/components/page/icon-slider.module.css` | 27 | 0 | 0 | Mostly structural; coastal/global color fallback is a migration bridge. |
| `src/components/blog/blog-stepper.css` | 185 | 9 | 9 | Already consolidates duplicate widgets; local type, monospace stacks, warning colors and dark selector need attention. |

Also inspected the font loader in `src/app/layout.tsx`, Tailwind config, theme store, portal wrappers, the embedded styled-JSX CSS in `src/components/main/music-player-content.tsx`, and searched TS/TSX for inline font declarations and embedded styles. Styling also lives in utility class strings, SVG and canvas/Three.js code, and potentially stored article HTML. This is a source audit, not a browser/computed-style or database-content audit.

## Findings to address first

1. **Undefined font weight.** `globals.css` defines `--weight-demibold: 600`, but `.site-title`, `h1`, `h2`, and `h3` consume `--weight-semibold`, which is not defined in searched source. Standardize the name; use a temporary alias if needed. An unresolved variable invalidates that declaration.
2. **Two independently maintained palettes.** Global `--color-*` values coexist with `.coastalPage`'s `--coast-*` values and aliases. The body background, dropdown, mobile menu, and drawer repeat literal colors. Put shared theme definitions in one global location and have components consume semantic names.
3. **Portal inheritance matters.** Dropdown, sheet and drawer wrappers use portals. Variables defined only on `.coastalPage` do not inherit into a portal mounted outside that wrapper. `.mobileLinks a[aria-current="page"]` uses `--coast-accent` without a fallback. Verify its computed color in the open mobile menu. Establish the same theme on the portal root or a common DOM ancestor before replacing literal colors with variables.
4. **Typography bypasses the scale.** Global `--step--1` through `--step-4` are largely bypassed by coastal CSS. Hero, page intro, section headings, cards, article headings, and mobile overrides each pick their own sizes. Centralize the sizing decisions before removing overrides.
5. **Sidebar variables have incompatible formats.** The top-level roots use full hex colors; later `@layer base` roots reuse several names with bare HSL channels. Normal unlayered declarations outrank layered declarations, so source order alone will not fix this. Choose one complete-color format and update all consumers consistently. Audit generation of `bg-sidebar` and related classes, too.
6. **Dark theme selectors disagree.** `theme-store.ts` toggles `.dark` on `<html>`. The stepper warning override uses `html[data-theme="dark"]`, which that store does not set. Standardize the selector and verify warning contrast. The legacy styled-JSX music player also uses `.dark` inside scoped CSS; verify that it targets the global ancestor correctly.
7. **Global rules compete with utilities.** Unlayered `h1`/`p`, `.text-sm`, `.rounded-lg`, and `.transition` declarations can beat Tailwind's layered utilities. Put defaults in `@layer base`; avoid manually redefining stock utility names with different meanings. Moving rules into layers changes precedence and requires visual checking.
8. **Repeated styling has multiple owners.** `.client-logo` is duplicated in globals, blog emphasis rules repeat, body colors are set in globals and inline in the layout, and button/form styles are split between shared components and coastal overrides. Consolidate each responsibility after checking consumers.
9. **Font weights should match available faces.** The loader supplies TT Interphases Pro at 400, 600, and 700. CSS also requests 500 and defines 900. Those requests do not add real font files; prefer the supplied weights unless another face is deliberately added.
10. **Preserve accessible states during cleanup.** `.image-overlay-text` suppresses focus outlines with `!important`, including `:focus-visible`. If used on interactive elements, provide a visible replacement. Reduced-motion rules scoped beneath `.coastalPage` do not cover portaled content or other routes. The global marquee and legacy player need their own coverage.

## Ownership: what goes where

| Concern | Canonical owner |
| --- | --- |
| Font files and registered weights | `src/app/layout.tsx`, using the existing local font loader |
| Shared colors, typography, spacing, radii, focus, motion and layout tokens | Token sections in `src/app/globals.css` |
| Theme value overrides | One clearly identified section in that same global stylesheet |
| Tailwind mappings | CSS-first theme declarations in globals, referencing canonical values |
| Document defaults | `@layer base` in globals |
| Shared control behavior and variants | Existing shared UI components and their agreed styling owner |
| Component composition, grid, positioning, unique art | The owning CSS module |
| Runtime state, coordinates, progress | Inline custom properties or the existing rendering code |

SSOT means one authoritative definition per shared decision. It does not mean putting every selector or every illustration color into `globals.css`. A later extraction into `tokens.css` is fine if imported once; do not maintain a copied second token file.

Recommended global file order:

1. Required imports and Tailwind plugin directives.
2. Canonical tokens, grouped by color, typography, spacing, geometry, motion and stacking.
3. Light/dark and explicitly scoped theme overrides.
4. Tailwind theme mappings and class-based dark variant configuration if used.
5. `@layer base`: body, inherited controls, heading defaults, links and focus behavior.
6. Small shared component rules where global scope is justified.
7. Deliberate utilities and accessibility overrides, with ownership documented.

## Three primary type sizes, fluid and centralized

Use **body**, **heading**, and **display** as the default public-site roles. The following is a proposed starting scale, not a claim that these values reproduce the current screenshots:

```css
:root {
  --type-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --type-heading: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
  --type-display: clamp(2.5rem, 1.5rem + 5vw, 6rem);

  --leading-body: 1.6;
  --leading-heading: 1.2;
  --leading-display: 1.05;
  --weight-regular: 400;
  --weight-semibold: 600;
  --weight-bold: 700;
  --measure-prose: 70ch;
}
```

| Role | Typical use |
| --- | --- |
| Body | Paragraphs, navigation, buttons, inputs, labels, metadata; use weight and spacing for hierarchy. |
| Heading | Section and card titles; use context, weight and spacing to distinguish depth. |
| Display | Hero and major page title. |

Keep heading HTML semantic. An `h3` can share a visual size with an `h2`; do not change heading levels to get a particular appearance. Blog prose may need a documented hierarchy exception, and the radio artwork may need component-specific lettering. If a true caption size becomes necessary, name and document it centrally as an explicit fourth role. Do not claim three sizes while quietly adding more in modules.

`clamp(minimum, preferred, maximum)` bounds a fluid value. Use `rem` bounds and a preferred expression mixing `rem` and viewport units; avoid viewport-only sizing for readable text. This does not by itself guarantee zoom accessibility. Test enlarged text, browser zoom and narrow screens. See [MDN clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp).

Apply body size to the body and make form controls inherit the font. Avoid setting every global `p` to its own size when a container's role should flow into its children. Define display/heading roles once; CSS modules should reference the tokens rather than repeat clamp formulas. Layout breakpoints remain legitimate, but should not recreate independent type scales.

Do not blindly alias all six legacy `--step-*` names onto three new values: that changes existing routes. Inventory consumers, migrate one surface at a time, then remove old tokens after the final consumer is gone.

## Tailwind v4 integration

The manifest uses Tailwind 4.3.3 and globals imports `tailwindcss`. The legacy `tailwind.config.ts` is present, but globals has no `@config` reference. Do not assume that file's plugin declaration is active. Tailwind v4 requires explicit loading of legacy JavaScript configuration; verify configuration before migrating or deleting it. See [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

For the proposed type tokens, map the utilities to the existing values:

```css
@theme inline {
  --font-sans: var(--font-interphases), ui-sans-serif, system-ui, sans-serif;
  --text-body: var(--type-body);
  --text-heading: var(--type-heading);
  --text-display: var(--type-display);
}
```

This exposes `font-sans`, `text-body`, `text-heading`, and `text-display`. Add corresponding line-height mappings if these utilities should own line height. Ordinary `:root` declarations alone do not generate custom Tailwind utilities; use the appropriate theme namespace. Avoid self-referential mappings such as `--color-base: var(--color-base)`. See [Tailwind theme variables](https://tailwindcss.com/docs/theme).

Do not remove the entire default type namespace immediately: existing admin/UI components use `text-sm`, `text-base`, and other stock sizes. First migrate the public coastal surfaces; audit other routes before enforcing a repository-wide restriction. Verify Tailwind `dark:` variants follow the same `.dark` mechanism as custom CSS.

## Color, dimensions and exceptions

Prefer existing semantic names such as `--color-base`, `--color-panel`, `--color-ink`, `--color-muted`, `--color-accent`, `--color-on-accent`, and `--color-border`. Centralize the coastal theme values and migrate `--coast-*` consumers consistently. If admin and public pages intentionally use different themes, define those named scopes in the global token section and ensure portals receive the correct scope. Do not change admin appearance accidentally by replacing all root values.

Use shared tokens for recurring 20px media radii, 12px control/menu radii, pill geometry, content widths, gutters, section spacing and focus offsets. Give values semantic names such as `--radius-media` and `--radius-control`; do not create one token for every isolated pixel value. Border thickness, art geometry and one-off positioning can remain local.

Keep sky, sand, dolphin, radio hardware and canopy illustration palettes local to their artwork. Repeated artwork colors can become local variables. Do not replace meaningful image/illustration colors with the site's generic accent just to improve a token count. The `.music` component currently overrides shared coastal names for its own surface; prefer clearly owned radio tokens or a deliberate local semantic theme. Shared UI colors should not drift accidentally with art changes.

The legacy player's dynamic volume percentage is legitimate runtime state. Its repeated muted-track colors, green-tinted shadow values, radius and timing are candidates for tokens. The inline `min(var(--step--1), 3vw)` in `icon-block.tsx` can shrink text substantially on small screens; replace it with the agreed bounded role after checking the actual component.

## Safe migration and acceptance

1. Re-read current files and Git status. Coordinate with current edits by working in small, reviewable changes; do not reset another agent's work.
2. Capture representative current screens before changing the cascade: homepage, interior page, article/stepper, conference archive/detail, contact form, mobile menu, drawer, and admin/sidebar.
3. Fix undefined token names and selector mismatches. Consolidate duplicate declarations without changing intended values.
4. Establish canonical theme ownership, including portals. Add typography roles and Tailwind mappings without removing existing consumers prematurely.
5. Migrate public typography, shared control styles and recurring geometry. Consolidate the global/component boundary. Preserve unique art and runtime styling.
6. Remove dead aliases only after a source search confirms there are no remaining consumers. Search TSX class strings and inline styles as well as CSS.
7. Run `pnpm run lint` and `pnpm exec tsc --noEmit`. Use an isolated checkout for a production build if the active development server would conflict with build artifacts; run `pnpm run build` there with the required environment. Report pre-existing failures separately.
8. Check light/dark modes, open portals, keyboard focus, reduced motion, 320/375px phones, tablet, desktop, 200% text/zoom, long titles, form errors and article code/table overflow. Confirm focus styles remain visible and text remains readable.

Useful inventory searches:

```sh
rg --files src -g '*.css' -g '*.scss' -g '*.sass' -g '*.less'
rg -n 'font-size:|font-family:|font-weight:|clamp\(' src --glob '*.css'
rg -n -- '--step-|--type-|--coast-|--color-|--weight-' src
rg -n 'fontSize:|fontFamily:|<style|text-\[' src --glob '*.{ts,tsx}'
rg -n 'text-(xs|sm|base|lg|xl|[2-9]xl)|dark:' src --glob '*.{ts,tsx}'
rg -n '@theme|@config|@layer|!important|data-theme|prefers-reduced-motion' src
```

Done means a change to one shared token reaches its intended consumers, including overlays; typography roles have one definition; exceptions are explicit; theme selectors agree; and representative pages pass visual and interaction checks. This handoff adds documentation only. No application CSS was changed and no runtime verification was performed for this audit.

## Follow-up: CSS inside TSX and TS

Chris requested a further review of styling in TypeScript and animation ownership. A search across `src/**/*.{ts,tsx}` found 37 lines containing `style=` or `<style`, across 21 files. These are search hits, not 37 defects. The review also checked direct DOM style writes, CVA/Tailwind class strings, Motion props and the existing animation module. A search of `convex` and `scripts` found a historical inline-widget migration comment; stored database HTML was not inspected.

**Move static styling to the component's CSS module or an existing token-backed utility. Keep actual runtime values in React. Shared values belong in global tokens; component-specific rules do not automatically belong in globals.**

### Concrete extraction candidates

Paths and line numbers below describe the inspected snapshot and may shift with concurrent edits.

| Source | Finding | Recommended destination/action |
| --- | --- | --- |
| `src/components/main/music-player-content.tsx:161` | A full styled-JSX stylesheet for slider tracks, thumbs, hover/focus and dark styling; it interpolates the volume percentage into a gradient. | Extract into a colocated CSS module. Pass only `--volume-progress` from React; keep gradient, pseudo-elements and theme rules in CSS. Use global `.dark` correctly from the module. Replace the static accent color inline at line 110 with a token utility. |
| `src/components/ui/badge.tsx:12` and `:103` | CVA variants repeat neutral hex colors and hardcode border/focus colors. An inline base background/text color overrides the variant's normal CSS colors. | Remove competing ownership. Use common semantic tokens plus explicit status/category tokens; keep the CVA variant API. Remove the default inline color object once the intended variant behavior is represented in CSS/utilities. Preserve caller-provided style support. |
| `src/components/ui/dropdown-menu.tsx:68` | Shared menu hardcodes white, gray and dark hex surfaces while coastal modules override menu colors again. | Use shared surface, ink and border tokens in the existing class list. Solve portal theme scope first. Moving all menu utilities into a stylesheet is unnecessary. |
| `src/components/layout/Footer.tsx:37`, `:55`, `:87` | Repeated static font-size and weight objects. | Replace with the agreed text-role classes or a footer module consuming global typography tokens. |
| `src/components/main/hero-content.tsx:41`, `:55`, `:60` | Static type roles inline; SVG transition string selected by a boolean. | Put type roles in classes. Use a data attribute or class for replay state and define the stroke transition in a local module. Keep replay state/timers in React. |
| `src/app/link-page/LinkGrid.tsx:139`, `:143` | Inline heading sizes point to legacy step tokens. | Adopt the new role classes when migrating this page's typography. |
| `src/components/page/icon-block.tsx:35` | Inline `min(var(--step--1), 3vw)` can shrink labels below the intended readable minimum. | Replace with the centrally bounded body/caption role; verify narrow layouts. |
| `src/app/layout.tsx:101` | Static body background and color repeat globals. | Let global body rules own these once computed styles confirm equivalent behavior. |
| `src/components/coastal/page-loading.tsx:13` and `src/app/browser-tabs/BrowserTabs.tsx:87` | Inline static skeleton minimum heights of 280 and 220. | Use named loading-panel classes/variants in the owning module. A global token is warranted only if the dimension is a shared design decision. |
| `src/components/page/gallery-drawer.tsx:245`, `:256`, `:326`, `:339` | Fixed mobile dimensions and anchor offsets mixed with calculated sizes and z-index. | Move fixed geometry to a gallery module; leave measured/calculated dimensions and selected-photo stacking dynamic. Handle transforms carefully because Motion also writes them. |
| `src/components/page/wireframe-terrain.tsx:32` | Two static mask-gradient strings selected by `variant`. | Define left/right mask classes or a data-variant selector in a local module. Keep canvas measurements and drawing calculations in TS. |
| `src/components/coastal/coast-scene.tsx:310`, `beach-umbrella-scene.tsx:105`, `beach-castle-scene.tsx:268`, `sandcastle-scene.tsx:277` | Static `pointerEvents` or `touchAction` inline on canvas wrappers. | Use a local wrapper class or existing utility, preserving the distinction between decorative scenes and interactive sandcastle controls. |
| `src/components/page/card.tsx:85` and `two-column-card.tsx:74` | Both force permanent `willChange: "transform, opacity"`. | Reassess whether the hint is needed. Remove it absent a measured benefit; if needed, own it in CSS or apply it only during relevant motion. Retain the caller's dynamic style prop. |
| `src/components/ui/sidebar.tsx:9` and `:118` | Static default widths live in TS constants and are assigned as CSS variables. | Move defaults to the sidebar CSS/theme scope if no JS calculation needs them; preserve the inline override API. This is lower priority than the conflicting sidebar color formats. |

The `Button` CVA definition is already a legitimate shared styling owner. Keep that API, but reconcile `accent` using `text-black` with `solid` using `--color-on-accent`; test actual backgrounds before changing behavior. Similar Tailwind/CVA class lists in TSX do not need wholesale conversion to CSS modules. Repeated values and conflicting owners are the issue, not the `.tsx` extension.

Some components under `main/` and the old layout may be legacy. Check route reachability before spending time migrating them. Conversely, `gallery-drawer.tsx` has a runtime import from the career page, `Card` is used on contact/link/blog paths, and `Badge` is used by blog content: these cannot all be dismissed as unused old-homepage code. Type-only `GalleryPhoto` imports do not establish a rendered gallery dependency.

### Styling that should remain dynamic

- `beach-banner.tsx:105` already uses the useful pattern: React supplies surfer position, distance and duration; the CSS module owns keyframes and presentation. Dolphin position at line 127 is also runtime data.
- `project-preview.tsx:37` supplies an image-specific aspect ratio, and line 45 selects image fit/position. The aspect ratio may stay inline. The finite fit choices could become data-attribute styles, but this is optional cleanup, not an SSOT defect.
- `EngagementTabEnhanced.tsx:448` computes progress width from actual likes. Keep that calculation in React, optionally passing a custom property to CSS.
- Gallery positions, rotation targets, computed dimensions and active z-index depend on component state. Do not hardcode them into a global stylesheet.
- Canvas backing resolution, measured canvas height, shader uniforms, Three.js material colors and per-frame scene updates are rendering logic. They cannot be replaced by DOM CSS rules. Extract repeated scene configuration to local TS modules if useful.
- `stepper-configs.ts` uses `style: "accent" | "warn" | ...` as semantic data mapped to existing CSS classes. It is not embedded CSS and should remain data.

For the music slider, the intended boundary looks like this (illustrative migration, not applied code):

```tsx
style={{ "--volume-progress": `${volume * 100}%` } as React.CSSProperties}
```

```css
.volumeSlider {
  background: linear-gradient(
    to right,
    var(--color-accent) 0%,
    var(--color-accent) var(--volume-progress),
    var(--slider-track) var(--volume-progress),
    var(--slider-track) 100%
  );
}
```

Define `--slider-track` once in the component's light/dark theme scope. Retain separate WebKit/Firefox track and thumb rules and test both; moving the stylesheet alone does not guarantee equivalent native-range rendering.

## Should animations live in an animations file?

**Yes for shared JavaScript animation presets. This repository already has `src/lib/animations.ts`; extend that file where reuse is real. CSS keyframes belong in CSS, and specialized scene choreography belongs near the scene.**

The existing file exports `springSwift`, `springGentle`, `cardVariants`, `fadeUpVariants`, `sliderTransition`, and `viewport`. Current consumers found:

- `page/card.tsx` imports `cardVariants`.
- `page/two-column-card.tsx` imports `cardVariants` and `viewport`.
- `main/projects-content.tsx` imports `sliderTransition`.
- `springSwift` is used internally by `cardVariants`. No source consumers outside their declarations were found for `springGentle` or `fadeUpVariants`; confirm before removing or reusing them.

| Animation concern | Recommended owner |
| --- | --- |
| Reusable Motion transitions, springs, variants and viewport presets | Existing `src/lib/animations.ts`, as pure typed exports |
| Shared rendered reveal behavior and reduced-motion handling | Existing `src/components/coastal/reveal.tsx` wrapper |
| One component's large Motion choreography | Colocated file such as `gallery-drawer.motion.ts`, if extraction improves readability |
| Hover/focus transitions and component keyframes | Owning CSS module |
| Genuinely shared CSS animation definitions | A small shared CSS file imported once, only when multiple consumers justify it |
| Shared CSS durations and easing curves | Global CSS tokens |
| Three.js frame updates, object movement and shader behavior | Scene TS/TSX files or their local helpers |

Specific recommendations:

1. Keep `Reveal` as the reusable entrance component. Its 0.65-second ease and 12% viewport threshold differ from the older presets. Name a coastal reveal preset if consolidating them; do not substitute the old spring blindly and change the design. Keep the `delay` prop dynamic.
2. `page/contact-form.tsx:169` defines its own fade-up timing and repeats feedback entrance props around lines 314/324. Reuse a suitable shared preset, or define a form-specific one if the behavior intentionally differs. Feedback must remain immediately available with reduced motion.
3. `CardMedia` in `page/card.tsx:144` and `:154` duplicates the same scale/opacity entrance and 0.6-second transition in both image branches. Extract one local preset; promote it to `lib/animations.ts` only if another component uses it.
4. `gallery-drawer.tsx` defines `containerVariants` and `photoVariants` inside the component. These can be module-level typed constants or a colocated motion module; pass runtime positions through `custom`. Review the combined parent stagger and per-photo delay before changing timing. Keep drag handlers, selected state and layout calculations with the component.
5. Keep `drift`, `swash`, `ride`, `bob`, and `leap` in `beach-banner.module.css`; keep `bucketFill` in the sandcastle builder's module. These are component-specific, already correctly located. Do not copy them into `animations.ts`.
6. Treat the older header fades and icon-slider transitions as consolidation candidates only when their intended timing matches a shared preset. Centralization should not erase deliberate differences.

### Reduced motion and avoiding two competing animation systems

`Reveal` uses `useReducedMotion`, but no `MotionConfig` was found in the searched source. CSS `animation: none` and `transition: none` do not reliably stop Motion's JavaScript-driven updates or Three.js frame loops. Provide a common Motion policy in an appropriate client provider and retain component-specific reduced-motion behavior. `MotionConfig reducedMotion="user"` suppresses transform/layout animation while allowing opacity/color animation; it is not an all-animation kill switch. See [MotionConfig documentation](https://motion.dev/docs/react-motion-config).

Use `useReducedMotion` where a component needs a different static or simplified state, as `Reveal` already does. See [Motion reduced-motion hook](https://motion.dev/docs/react-use-reduced-motion). Preserve the project's installed `framer-motion` imports unless doing a separately planned package migration; current documentation examples may use `motion/react`.

The coastal scene wrappers already contain some reduced-motion/visibility checks. Preserve those and verify each actual scene; a Motion provider will not govern WebGL animation. Ensure content is visible when motion is disabled, including elements whose normal initial state is hidden.

Assign one owner to each animated property on a DOM element. Avoid a CSS hover transform fighting Motion's `scale`/`x`/`rotate`; use a nested wrapper when layout positioning and animated transforms need separate ownership.

CSS duration variables and Motion's numeric durations have different consumers. Do not pass a CSS `var(...)` string as a numeric Motion duration. Initially keep CSS-only timing tokens in CSS and Motion-only presets in TS. If a timing must truly be identical across both, use a deliberately generated shared token source or a small client-side conversion layer with explicit units and SSR-safe defaults. Do not add that machinery merely to deduplicate one number.

Recommended order: resolve the badge/menu color ownership, extract the embedded slider stylesheet if still reachable, migrate static inline type and loading styles, then consolidate genuinely repeated Motion presets. Recheck portal themes, focus states, sliders, gallery drag and reduced motion after implementation. This follow-up changes only this guide; none of these proposed refactors have been applied.


## Color direction: keep the blue, apply 60–30–10 deliberately

Chris likes the existing blue/teal. Retain it. The remembered “60–90–30” rule is **60–30–10**: an approximate dominant/secondary/accent balance, adding to 100%. It is a visual-composition heuristic, not a WCAG criterion, a requirement for exactly three hex codes, or a promise that every screenshot contains precisely those pixel percentages. AI can apply this rule by assigning color roles and reviewing rendered screens.

### Recommended public-site balance

| Share | Role | Existing light-mode direction | Intended use |
| --- | --- | --- | --- |
| About 60% | Dominant canvas | `--coast-base`, warm cream `#f6f5f0` | Page background and breathing room. |
| About 30% | Secondary surfaces | `--coast-panel` `#eeeee6` and `--coast-soft` `#e8eff0` | Media surrounds, selected regions, quiet grouping. |
| About 10% | Accent | `--coast-accent`, blue/teal `#235967` | Primary actions, active indicators, links and focus. |

Text ink is a readability role within this composition, not a demand to paint 10% of the page with words. Photographs, illustrations, logos, sandcastle materials and status colors are legitimate additional colors. Do not recolor every image to satisfy an artificial percentage. Use the proportions to judge UI surfaces and emphasis, then inspect representative viewports.

Dark mode keeps the same semantic roles, with deep blue canvas `#12282e`, lifted surfaces `#1a343b` / `#203e46`, and pale blue accent `#a7d3d7`. Do not put the pale accent behind large amounts of dark-mode content merely to reach a quota. The goal is calm surfaces and unmistakable actions.

### Measured opaque color pairs

Calculated using the WCAG sRGB relative-luminance formula. Values shown are rounded for display; decisions use the unrounded ratio.

| Foreground / background | Ratio | Finding |
| --- | ---: | --- |
| Ink `#173f4a` / cream `#f6f5f0` | 10.42:1 | Strong normal-text contrast. |
| Muted ink `#53676a` / cream | 5.47:1 | Passes AA for normal text. |
| Muted ink / panel `#eeeee6` | 5.12:1 | Passes AA for normal text. |
| Muted ink / sea mist `#e8eff0` | 5.13:1 | Passes AA for normal text. |
| Button label `#f8fbfa` / blue `#235967` | 7.48:1 | Strong action-label pairing. |
| Black `#000000` / blue `#235967` | 2.70:1 | Fails normal and large-text thresholds; fixed in shared accent Button. |
| Light ink `#e6efec` / dark canvas `#12282e` | 13.09:1 | Strong normal-text contrast. |
| Muted light ink `#b0c3c5` / dark panel `#1a343b` | 7.17:1 | Strong supporting-text contrast. |
| Dark label `#163b45` / pale-blue action `#a7d3d7` | 7.41:1 | Strong dark-mode action pairing. |
| Quiet border `#d4ddda` / cream | 1.27:1 | Fine for decoration; insufficient if this line alone identifies a control. |
| Dark quiet border `#365159` / dark canvas | 1.81:1 | Same distinction: divider versus necessary control boundary. |
| Coral `#d99b81` / cream | 2.15:1 | Keep for artwork; unsuitable for normal text on cream. |

For AA, normal text generally needs 4.5:1; large text needs 3:1. Large text is at least 24 CSS pixels, or about 18.67 pixels when bold. Hover, selected, error and placeholder text also need review. See [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Meaningful control boundaries and state indicators generally need 3:1 against adjacent colors when necessary to identify the control/state. Decorative separators do not automatically need that threshold. The new `--coast-control-line` provides a stronger control outline separately from `--coast-line`. See [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Opaque token checks do not prove contrast over photos, gradients, opacity effects, translucent surfaces or every state. Sample rendered pairings separately. This is not a site-wide accessibility certification.

### No new font library required

Keep TT Interphases Pro and its existing local 400/600/700 files. Fix role consistency, minimum sizes, wrapping, spacing and actual supplied weights first. Adding another font package would not solve the current problems. Three primary roles are enough for the public guide and menu; dense admin metadata can have one explicitly documented supporting size if needed. Do not shrink every admin control to match a decorative label.

## Mobile layout and navigation

Use a single primary reading column on small screens. Preserve the story: introduction and primary action, selected projects, writing/personal content, then contact. Use 16–24px side gutters, and avoid nesting multiple padded cards until the usable width disappears. Let labels wrap naturally; do not compensate for crowding with 10px text.

On the homepage, retain a visible introduction and main action without requiring a full screen of decorative art first. Projects should stack as image/title/summary/actions. On long prose pages, keep figures responsive and let only genuinely wide code/tables scroll horizontally. Forms should put labels above controls and stack fields that become cramped. Input text should be comfortably readable; aim for 16px or more on phones.

The implemented menu now:

- Uses the existing Radix `Sheet`, preserving dialog semantics, focus trapping, Escape and focus return.
- Has a 44px close control and at least 44px header controls.
- Separates direct links from expandable About/Work groups.
- Opens the group containing the current route; marks the current link with a check and underline as well as color.
- Keeps the Contact action outside the scrolling link area so it remains reachable.
- Allows groups to scroll inside the dialog on short screens.
- Gets its palette from the same global theme scope as the page, including when portaled.
- Uses the compact navigation below 1024px to avoid crowding tablet headers.
- Adapts to safe-area insets and reduced-motion preferences.

The 44–48px control size here is a comfortable project target. WCAG 2.2 AA target-size minimum is generally 24×24 CSS pixels or qualifying spacing/exceptions, not universally 44px. See [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Reusable UI: apply the Image Horse lesson

The reference project is `/home/clj/repo/rust-wasm-photo-tool` (its README identifies it as Image Horse). It was inspected read-only. Relevant examples:

- `app/src/components/ui/button.tsx`: one CVA Button with separate size and visual-variant axes, including compound variants. Its comments explain why extra button files were consolidated.
- `app/src/components/ui/icon-button.tsx`: a dedicated meaningful icon action, with shared interaction styling and hint support.
- `app/src/components/ui/panel-close-button.tsx`: consistent close behavior rather than copying a tiny X into each panel.
- `marketing/src/tokens.css`: named colors, type and state tokens, with comments describing intended exceptions.

Apply the ownership principle, not a copy of Image Horse's orange palette or editor density. Chris's portfolio stays blue/coastal. The public site and admin should share primitives and semantics while using density appropriate to each task.

### Component ownership map

| Reusable element | Starting point / intended owner | Rule |
| --- | --- | --- |
| Text actions | Existing `components/ui/button.tsx` | One Button; variant expresses emphasis, size expresses dimensions. |
| Icon actions | Small wrapper around Button, if needed | Require an accessible name; consistent focus, disabled behavior and touch sizing. |
| Form inputs | Existing Input, Textarea, Label, Switch | Reuse primitive styling. Do not independently style the same text field in every tab. |
| Selects | One shared native select primitive or existing accessible equivalent | Common height, border, label association, disabled/error styles. Choose native select for simple options. |
| Field wrapper | Proposed `FormField` | Label, optional help, required indicator and error IDs in one place. |
| Save controls | Proposed `EditorActionBar` | Same location, status language and enabled/disabled rules across editors. |
| Inline feedback | Consolidate SuccessDisplay/ErrorDisplay/ValidationFeedback thoughtfully | Same spacing, live-region behavior, dismissal control and actionable copy. |
| Media selection | Existing MediaDrawer | One reusable selection/upload flow; consumers supply the purpose and accept result metadata. |
| Empty/loading/error views | Shared state components | Loading is not an empty result. Errors offer the correct recovery action. |
| Dialog/sheet/drawer | Existing Radix/Vaul wrappers | Reuse focus, titles, descriptions and close behavior. |
| Admin page shell | Proposed `AdminPageLayout` + `AdminPageHeader` | Title, explanation, primary action, toolbar and body follow one rhythm. |
| Repeated collection tools | Proposed `CollectionToolbar` | Search, filters, result count and optional view toggle use one arrangement. |

Do not create a universal component with 40 boolean props. A shared shell with named slots is enough. Keep page-specific behavior in the page: project ordering, SEO preview, media cropping, message reading and content editing legitimately differ. Share the control vocabulary and state model.

## Admin UX/UI audit and redesign plan

This is based on source review, not an authenticated production-admin walkthrough. No admin records were changed. The request is to make the admin feel like one product instead of unrelated screens stitched together.

### Specific evidence from the current code

| Area | Current observation | Proposed improvement |
| --- | --- | --- |
| Admin sidebar | Active tabs use shared Button, but collapsing removed visible text without supplying a label. | Accessible names and pressed state were added. Next, use one selected-row treatment and consistent tooltips for collapsed items. |
| Shared Button | `accent` used black text on a dark blue background. | Fixed to the shared on-accent color. Keep appearance consistent in public and admin contexts. |
| Shared Badge | Repeated hex colors, competing inline styles, and an unused `className` prop. | Consolidated palette ownership, removed the competing inline defaults, and restored caller className merging. |
| Media Library | Hand-built grid/list toggles and repeated icon actions in `MediaTabEnhanced.tsx`. | Reuse a labeled view-mode control and shared icon buttons; expose selected state to assistive technology. |
| MediaDrawer | Fixed horizontal layout with a `w-1/4` sidebar; search, upload, metadata and deletion share a constrained surface. | Desktop split view; mobile single-column selection and details, with a stable action area and visible close control. |
| MediaDrawer failures | Upload/metadata errors are mostly logged to the console; optimistic local values can look saved after a failure. | Show an inline failure state and retry; clearly mark unsaved edits and restore/reconcile failed optimistic changes. |
| Media deletion | Uses native `confirm("Delete permanently?")` inside the picker. | Reuse a consistent destructive confirmation surface showing the filename and usage impact. Do not remove confirmation for irreversible deletion. |
| Projects / Blog editors | Each owns selected record, edit/create mode, save status and pending state separately. | Reuse the editor shell and save-state presentation while preserving resource-specific mutations and validation. |
| Messages | Custom search/input/buttons separate from other collection tabs. | Same toolbar geometry and selection pattern; retain its inbox-specific reading workflow. |
| SuccessDisplay / ErrorDisplay | Separate markup and small custom dismiss buttons; success variant uses a raw multiplication-sign button. | A shared status surface and named dismiss button, with appropriate status/alert behavior. |
| Pages & Menu | Navigation management uses HTML drag-and-drop and custom small controls. | Rename to Navigation and add keyboard/touch Move up/down controls as alternatives to drag. |
| SEO | Edits both metadata and visible page headers, but not the page body. | Separate the concepts visually and route users to an actual content editor. |

### Consistent admin layout

Use the following default arrangement for collection editors:

1. Page title plus a short task description.
2. One obvious primary action, such as “New project”.
3. Toolbar with search, a small set of relevant filters and a result count.
4. Collection list/table and a selected-record editor on wide screens.
5. On phones, show the list first; selecting a record opens a full-width editor with a clear Back action.
6. A stable editor action bar with Save changes, Cancel and a text status. Destructive actions are separated from Save.

Make selection and editing modes explicit. Keep one chosen item visible, retain search/filter state when returning from the editor, and preserve URL tab/subsection behavior already present in the dashboard. Avoid three simultaneous scrolling columns on mobile.

Tables should be reserved for records people compare by columns. Media benefits from a grid; messages from a list/detail arrangement; SEO from field editing plus a search preview. These differences are useful. Different button shapes, error placement, field heights and saving vocabulary on every page are not.

### Field and save-state contract

Every field should have a visible label and a programmatic association. Help and errors connect through `aria-describedby`; invalid fields get `aria-invalid`. Placeholder text supplements labels. Required/optional meaning must be consistent. Retain user input after a failed save and place a validation summary near the action bar when several fields fail.

Use one editor state vocabulary: **Loading → Ready → Unsaved changes → Saving → Saved / Could not save**. Disable duplicate submission while saving, keep feedback visible long enough to understand, and distinguish a successful local update from an actually persisted record. Handle query refreshes without silently replacing a dirty form.

When changing record, tab or route with unsaved edits, offer Save / Discard / Keep editing. Do not introduce this confirmation for every harmless click. For successful non-destructive operations, use concise inline status instead of a blocking modal.

### Admin colors and 60–30–10

Use the same semantic system but a denser composition: roughly 60% workspace canvas, 30% navigation/editor surfaces and 10% active/action emphasis. These are approximate areas, not instructions to turn every active row into a saturated block. Status colors supplement the blue accent and must include a label/icon, not just red/green.

Keep control borders strong enough where boundaries matter. Keep inactive text readable rather than lowering opacity across whole panels. Focus rings must remain visible beside both blue buttons and pale backgrounds. Do not carry ornamental sand textures behind admin fields or data tables.

## Plan: a real Pages editor for About, History and Maintenance

**Recommendation: add a structured Pages editor, reuse the current public templates, and keep Navigation and SEO as distinct tasks.** Start with the four requested pages. Do not build a freeform drag-and-drop website builder or make admins edit raw TSX/HTML.

### Why the current admin cannot do this

- `/about` uses `src/data/about-data.ts` through `AboutPage.tsx`.
- `/site-history` uses `src/data/site-history-data.ts` through `SiteHistoryPage.tsx`.
- React and WordPress Maintenance define services and feature lists in their `*MaintenanceContent.tsx` files and pass them to the already shared `MaintenancePage` component.
- `pageHeaders` stores visible heading/breadcrumb/description. `seoMetadata` stores search/social metadata. Neither represents full page body content.
- `PagesMenuTabEnhanced.tsx` builds navigation; its page list comes from SEO records. Adding an SEO record does not create an editable content page or a working route.

### Proposed admin organization

- **Pages:** page content, visible page introduction, section order, media and publication state.
- **Navigation:** header/footer menus and external links. Reuse the existing menu editor here.
- **SEO:** metadata, canonical URL and social preview, with an “Edit page content” link when supported.
- **Media:** the existing shared library and assignments, available inside every editor through MediaDrawer.

From Pages, each row shows name, route, template, draft/published status and last saved time. Actions: Edit, Preview and View live. Filter by published status and search by title/path. Initially treat the four existing routes as fixed; route creation, renaming, redirects and deletion are separate future work.

### Editor structure

Use the same editor shell for all four pages. Tabs or sections are **Content**, **Media**, and **SEO**; publication controls stay in the common action bar. SEO fields operate on the existing SEO owner rather than copying metadata into page-body records.

| Template | Editable content | Reused public renderer |
| --- | --- | --- |
| About | Visible intro; story title, paragraph content, image, alt text, image fit and optional CTA; order and featured story. | Existing About story layout, evolved to accept typed data. |
| Site History | Visible intro; dated/history sections, title, paragraphs, screenshot, alt text and links; ordering. | Existing History section layout, evolved to accept typed data. |
| Maintenance | Visible intro; hero image/title/body; services; plan labels, prices and feature lists; contact CTA. | One existing MaintenancePage renderer for both React and WordPress. |

The current About layout infers featured/image behavior from array indexes. Replace that inference with explicit supported fields when content becomes reorderable. Otherwise moving a story could unexpectedly change its design. Use stable section IDs, not titles or array positions, for editor identity.

Use a modest content field supporting paragraphs, lists, emphasis and safe links. A single plain-text or constrained rich-text editor is preferable to different homemade parsing rules on each page. Whitelist supported block types and URL schemes; render through known React components. Do not accept scripts, arbitrary CSS or executable markup as page content.

### Convex SSOT ownership

Proposed schema, not created yet:

| Owner | Responsibility |
| --- | --- |
| Shared pure page registry | Supported routes, display names and template kinds. Used by Pages, navigation choices, SEO linking and initial seeds. |
| `sitePages` | One identity per supported path: template kind, schema version, draft revision pointer, published revision pointer and update metadata. |
| `pageRevisions` | Immutable saved content snapshots, including visible page introduction, stable section IDs and audit metadata. |
| Existing `seoMetadata` | SEO title, description, canonical and OG image, keyed by the same path. |
| Existing `media` | Asset identity, URL/file metadata and library relationships. Page content references the asset ID plus page-specific alt/crop overrides where appropriate. |
| Existing navigation tables | Menu structure/order only, referencing the canonical route registry or explicit external links. |

A saved draft and published revision are intentional versions, not two competing live content stores. Public pages read only the published pointer. The admin reads the draft and its revision. Publishing validates the selected revision and atomically changes the published pointer. A failed publish must leave the old published version working.

Use one shared discriminated content validator for supported template types; derive TypeScript shapes from validators/schema-generated types instead of repeating interfaces in every tab and mutation. Pure registry/validator modules must not import React, browser APIs or secret-bearing configuration.

Convex indexes are lookup tools, not automatically SQL-style uniqueness constraints. Normalize paths and enforce one page per supported path transactionally in the creation/seed mutation. Use the existing admin authorization pattern for all draft reads and writes; public queries must return published data only. Do not change authentication providers or permissions as part of a visual redesign.

Saving should include the revision the editor started from. If another session has saved a newer revision, return a conflict the UI can resolve instead of silently overwriting the other person's work. Revision restore creates a new draft from an older snapshot; it does not mutate the historical record. Paginate/cap revision listings and establish retention rather than returning unlimited history in every query.

### Migration without a second permanent source of truth

1. Inventory the current four pages, their headings, images, links, service plans and public SEO. Capture screenshots/content snapshots.
2. Build shared registry/validators and reusable admin fields/action bar first.
3. Add the page/revision tables and validated queries/mutations using `convex/_generated/ai/guidelines.md`. Preserve existing authorization rules.
4. Seed existing content idempotently into an initial revision for each page. Set draft and published pointers to that same revision so the public pages initially look unchanged. Never rerun a seed that overwrites admin-authored revisions.
5. Move visible page-intro ownership into page content for these migrated routes. Update CoastalPageIntro and SEO UI access consistently; stop writing a parallel `pageHeaders` value for those routes. Leave unmigrated routes on pageHeaders until deliberately migrated.
6. Convert public renderers to accept published typed data. Use server-side reads where appropriate so useful content is present in initial HTML. Plan cache invalidation/revalidation explicitly; “Publish succeeded” should not leave the visible page unexpectedly stale.
7. Use existing static content only as a documented migration fallback when a page has not been seeded. Do not treat an authorization/network/backend error as an empty database record and silently replace content with old defaults.
8. Add authenticated draft preview using the SAME renderer and styles as the public route, with a draft banner and no indexing. Draft content must not be exposed by an unauthenticated URL parameter.
9. After parity and fallback tests pass, retire the migrated static source as an active content owner. Keep an archival seed fixture if useful, clearly distinguished from live data.
10. Connect Pages, Navigation, SEO and Media entry points so an admin can move between tasks without guessing where a field lives.

### Media behavior must be unambiguous

Claude encountered a blog cover that did not visually change because an assigned media image took precedence over the cover field. Treat that as evidence for a shared MediaField that shows the actual effective image and its source, not two unrelated controls that both appear authoritative. Define precedence once in the data/selection layer. Offer Replace and Unassign with clear wording; unassigning must not delete the library asset. Show “Used by” before permanent deletion and define what happens to content referencing that asset.

### Delivery slices and acceptance criteria

**Slice 1: shared admin foundation.** Standardize Button/field/status/action-bar/layout primitives and add a small component reference surface. Migrate two contrasting screens first, such as Projects and Media, before applying the pattern everywhere. Preserve existing queries/mutations.

**Slice 2: About pilot.** Implement registry/schema/revisions plus one structured content editor and public renderer. Verify editing content, images, section order, save failures, unsaved navigation, preview, publish and rollback.

**Slice 3: remaining templates.** Add History and the two Maintenance routes using the same field/repeater/media/action components. Both Maintenance pages must share the same template and schema branch, with content differences expressed as data.

**Slice 4: unify entry points.** Rename Pages & Menu to Navigation, expose Pages distinctly, link from SEO to content, and remove obsolete duplicate header controls for migrated routes.

**Slice 5: migrate the rest of admin deliberately.** Use the evidence table above to standardize toolbars and feedback across Blog, Messages, Links, Conferences, Clients and Settings. Do not force a media grid into a spreadsheet merely to make screens identical.

Acceptance requires: existing live content preserved after seeding; one authoritative owner per field; typed/validated mutations; server-side authorization; draft isolation; conflict handling; visible save/error states; accessible fields and keyboard ordering; consistent mobile controls; no loss of existing menu or SEO settings; and actual published pages updating after publish. Test with long text, missing images, empty collections, slow requests and failed saves. Do not call this complete after adding four buttons that open the SEO form.

## Implemented foundation and verification

The following changes were actually made in this working tree after the audit:

- Moved coastal palette/semantic aliases into the global `[data-coastal-theme]` scope, applied to public page roots, body on coastal routes, and the menu/dropdown portals. Added shared public type roles, geometry and motion tokens. Existing legacy type consumers remain for staged migration.
- Defined `--weight-semibold`, removed conflicting unused HSL sidebar declarations, mapped sidebar tokens for Tailwind v4 and aligned `dark:` variants with the existing `.dark` theme store.
- Removed repeated client-logo rules, duplicate prose emphasis declarations and redundant inline body colors.
- Fixed the stepper dark selector and restored a visible focus outline for interactive image overlays.
- Fixed shared accent Button label contrast; consolidated Badge color ownership, honored its `className` prop, and removed conflicting inline badge defaults.
- Added accessible labels/pressed state to collapsed admin sidebar tab buttons.
- Extracted mobile navigation into a reusable component using existing Sheet and Button primitives, a dedicated CSS module, shared theme tokens and grouped links. Removed the superseded mobile-menu rules.
- Added `/color-guide`: live CSS-token swatches, light/dark switching, copy/export actions, an interactive WCAG contrast checker, 60–30–10 explanation, type specimens and mobile guidance. No new font package was installed.

Verification so far: targeted ESLint passes for the new guide and modified public/shared UI files; the admin file retains a pre-existing unused `onSignOut` warning. The contrast function passed six assertions including black/white = 21, identical colors = 1, invalid input, symmetry and the correct/incorrect button pairings. Browser checks confirmed no page overflow at 320, 375, 768 and 1440px, correct light/dark ratios, failed identical-color checks, palette download, grouped menu navigation, current-route marking, Escape close and focus return. Additional final checks may be recorded below.

The repository-wide TypeScript check currently fails in `src/app/career-and-resume/download/[kind]/route.ts` because `api.resume.getDownload` is not present in the generated API type. That area already had concurrent resume changes; it was not rewritten for this UI task. The live development server also showed a CSS-chunk hot-reload error during edits; a full navigation recovered and subsequent page checks ran without that error. A production build has not been claimed as passing.

The admin content-editor proposal above is documentation only. No new Convex tables, draft system, content records, admin publication flow or production deployment were performed by this work.

## Follow-up: TypeScript and functional review, October 13

Chris asked whether TypeScript looks good and whether anything else needs changing. A fresh full check of the working tree found **one TypeScript error**, plus **one ESLint error and 75 warnings across 228 linted files**. These are separate checks. Strict TypeScript is enabled, and the searched authored TS/TSX did not contain explicit `any` types, `@ts-ignore` or `@ts-nocheck`; that is a useful foundation, but it does not make the current checkout build-ready or prove runtime behavior correct.

Commands used:

```sh
pnpm exec tsc --noEmit --incremental false
pnpm exec eslint src convex
```

This is a snapshot of concurrent work: HEAD was `615d695` during the follow-up and the resume module and sandcastle builder had uncommitted edits. Recheck the actual source before applying these recommendations. The issues below were documented rather than rewriting Claude's active implementation.

### 1. Resolve the resume API migration completely — build blocker

`src/app/career-and-resume/download/[kind]/route.ts:23` calls `api.resume.getDownload({ kind })`, while the current `convex/resume.ts` exports `getCurrent({})`. The old return shape was `{ url, filename }`; the new shape is `{ pdf, docx }`, with nullable URL values. Renaming the function at the call site alone is not a correct fix. This is a real source/API mismatch, not merely a stale generated declaration to silence with a cast.

Choose and finish the intended resume ownership model. If the media-backed `getCurrent` design is final, adapt or deliberately retire the compatibility download route, preserve useful old URLs, and update its obsolete storage comment. If retaining the proxy route, select the requested format from the new result and account for both relative asset paths and absolute URLs. Preserve correct content type, download filename, missing-file behavior and upstream errors.

The legacy `scripts/upload-resume.sh` also calls the removed `resume:generateUploadUrl` and `resume:setFile` functions. Its commands use `npx`, contrary to Chris's pnpm-only rule. Reconcile the script and the storage-model documentation with the chosen design; do not delete the old `resumeFiles` table or stored data simply to make TypeScript pass. The current direct PDF and DOCX asset URLs both returned HTTP 200 locally, so this finding does **not** mean every resume download is broken.

Acceptance: TypeScript passes; PDF and Word links work; any retained old download routes work; the documented upload/replacement workflow targets functions that actually exist. Do not run a production migration as part of a typecheck.

### 2. Fix the sandcastle loader's cancelled timer — reproduced behavior

In `src/components/coastal/sandcastle-builder.tsx:84`, the effect sets `pouring` to true and starts the 2.2-second completion timer. `pouring` is also a dependency. Changing it reruns the effect, invokes cleanup and cancels the timer; the next effect returns early because `pouring` is already true. `filled` can consequently remain false indefinitely.

The lint error is `react-hooks/set-state-in-effect` at line 86. The behavior was also reproduced in the local browser: after scrolling the game into view and waiting six seconds, a canvas existed, the error fallback was absent, and “Getting the beach ready…” was still visible.

Keep the one-time start condition separate from the completion timer. For example, latch “has been visible” from the IntersectionObserver callback, derive the pouring state, and have an effect keyed to that stable start condition schedule completion. Scrolling away should not accidentally destroy the only completion path. Preserve normal cleanup on unmount, support reduced motion and show a recoverable state if the dynamic scene import fails. Do not fix this by disabling the lint rule.

Acceptance: the loader clears after both the scene and minimum fill duration are ready; revisiting the section works; quick scroll-in/scroll-out, cached imports, development Strict Mode and a failed import do not leave an endless overlay.

### 3. Make the build command report a failed build correctly

`package.json` currently pipes `next build` into `grep -v`. Without pipeline failure handling, the shell reports the last command's status, so an actual Next build failure can look successful when grep emits other output. A successful package-script exit is therefore not reliable proof of a successful build.

Prefer a plain `"build": "next build"`. If suppressing a noisy dependency message is truly necessary, use a wrapper that explicitly preserves the build process's exit status. Add a normal `typecheck` script and run typecheck, lint and the build as separate checks. Do not enable `ignoreBuildErrors`, cast the resume API to `any`, or remove strictness to turn the checks green.

### 4. Repair the Media tab's actual interactions before visual polish

`src/app/admin/AdminDashboard/MediaTabEnhanced.tsx:249` calculates `filteredImages`, but the rendered content at line 507 always maps the six home-gallery slots. The library selection, search and grid/list controls update state without switching to a corresponding library result view. This is functional unfinished work, not merely inconsistent styling.

Render the gallery slots only for the home-gallery view. Render the selected, filtered library assets for All Images, Unassigned, page and post views. Use one shared media item component for both grid and list presentations, with distinct empty-library and no-search-results messages. Either connect the metadata edit controls or remove unreachable UI until they are implemented.

The occupied gallery tile also nests a Remove button inside the outer Replace button at lines 518–550. Make Replace and Remove sibling controls in a non-interactive tile wrapper, give both clear accessible names, and reveal controls on keyboard focus as well as hover. Do not rely on `stopPropagation` to make nested buttons valid. Keep the edit drawer and the user's input open when a save fails; the current metadata handler closes it after either success or failure.

Acceptance: library selection changes results, search filters them, grid/list changes layout, metadata is editable, actions are separately keyboard reachable, and failed saves remain recoverable. These admin findings came from source inspection; an authenticated end-to-end admin session was not used to claim verification.

### 5. Store selected record IDs instead of stale copies

`src/app/admin/AdminDashboard/EngagementTabEnhanced.tsx:60` stores the entire selected comment object in component state. Approval updates Convex, but the selected object is not refreshed from the subscription. The details pane reads `selectedComment.approved`, so it can continue showing Pending and the Approve action after approval has succeeded.

Store `Id<"blogComments"> | null` and derive the selected record from the current query result. Handle deletion and empty results explicitly. Apply this pattern wherever an admin detail view copies a live Convex record into selection state; keep editable draft form state separate when an actual unsaved draft is intended.

Prefer query-result inference or `FunctionReturnType` for enriched query results, and `Doc`/`Id` for schema documents and IDs. Replace repeated string state plus `as Id<...>` casts with correctly typed state at creation. Validate genuinely external input at the boundary instead of treating a TypeScript assertion as validation.

### 6. Clean up warnings with behavior in mind

Most of the 75 warnings concern unused imports, variables and handlers in admin code. Some expose real missing behavior, such as the unused media filter above; do not blindly delete everything the linter marks unused. Review hook dependencies in the HTML editor and terrain component for stale data, and remove obsolete parallel implementations after confirming their callers.

One specific obsolete candidate is `src/app/admin/hooks/useEngagementEffect.ts`: its approve/reject functions wait 200ms and report success without any mutation. No callers were found in the source search; the current Engagement tab uses real Convex mutations directly. Remove or replace this unused stub so a future refactor cannot accidentally wire fake success into the UI. This review did not find the active moderation UI using that stub.

Prioritize the build blocker, stuck loader, truthful build exit status and broken Media controls before cosmetic warning cleanup. The new color guide and earlier shared/public UI changes passed their targeted lint checks; the repository-wide checks are not yet clean.

## New blog-cover artwork in Downloads

Chris subsequently requested a complete redo of the blog covers, keeping the beach theme and saving the work in Downloads. All **seven** covers visible on the live blog were regenerated, including the sandcastle/site-redesign post. The direction is dimensional coastal illustration with ocean blue, sea-glass, sunlit sand and restrained coral, with a separate visual metaphor for each article.

- Windows: `C:\Users\chrislanejones\Downloads\Chris-Lane-Jones-Blog-Covers-2026-10-13-v2`
- Linux: `/home/clj/Downloads/Chris-Lane-Jones-Blog-Covers-2026-10-13-v2`
- Open `index.html` for an offline New set / Before / Side by side comparison. `contact-sheet.jpg` shows the new collection together.
- `web/` contains seven 1600 × 900 WebP exports, approximately 161–321 KiB each, with matching existing asset filenames.
- `originals/` contains the generated PNG masters. `manifest.json` maps articles and suggested alt text; `prompts.json` preserves the exact prompts.
- `README.md` includes the later integration instructions, including assigned-media precedence. Keep this preview and the PNG masters outside the deployed public/blog bundle.

These are saved review assets. This image task did not replace the repository covers, change Convex media assignments or deploy the set. The preview was checked with all seven images loaded, working comparison modes and no horizontal overflow at 390px. Review the new sandcastle image as a conceptual illustration, not an exact screenshot of the game.


## React SSOT follow-up: fewer independent UI implementations

Requested by Chris in the next session: simplify the React component system, especially buttons. This section is an implementation handoff for Claude. The recommendations below have not been implemented by this audit. Recheck the checkout before editing because work is happening in other terminals.

### The actual duplication

The current source has one canonical `src/components/ui/button.tsx`. Do not create another admin button, coastal button, save button, or page-specific button implementation. The problem is callers bypassing that component and independently defining padding, colors, focus, disabled states, and icon sizing.

At this inspection, `src/app/admin` contained 75 literal `<button` occurrences across 18 TSX files; `src/components` contained 24 across 7 files. These are source occurrences, not rendered counts or a count of defects. Some belong to legitimate specialized primitives. Use the inventory to review ownership, not to mechanically replace every native button.

**Desired result:** changing the shared button implementation should update ordinary actions across public pages and admin. Changing shared input or feedback styles should have the same effect. Keep a small component API and fewer independent styling decisions.

### Canonical ownership

| Concern | Owner and migration direction |
| --- | --- |
| Ordinary action buttons | Existing `src/components/ui/button.tsx`; one variant recipe, consistent sizes and states. |
| Navigation styled as an action | Existing `Button asChild` with a link, or the exported `buttonVariants` where a library owns the element. Preserve link semantics. |
| Text inputs and textareas | Existing `src/components/ui/input.tsx` and `textarea.tsx`; remove equivalent copied styling at call sites. |
| Labels and field messages | Existing label primitive; add one shared field composition only when repeated label/help/error wiring warrants it. |
| Status presentation | A small shared feedback presentation used by success/error/validation adapters; keep their different data handling outside the presentation. |
| Loading indicator | One shared spinner visual. Page and inline wrappers may retain different layout and loading text. |
| Tabs, menus, sidebar and calendar controls | Their owning specialized components; reuse shared recipes where appropriate while preserving keyboard and selection behavior. |
| Brand colors, spacing and typography | Canonical CSS tokens, consumed by primitives. Do not duplicate token values in TS objects. |
| Feature state and mutations | Feature components/hooks. The generic Button must not know about Convex, blog posts, media, or save APIs. |

### Button cleanup, first priority

1. Keep the existing import path `@/components/ui/button`. Inventory current imports and variants before changing its API.
2. Review `accent` and `solid`: both currently use the accent background and on-accent text, with different hover opacity. If they have no intentional distinct role, migrate callers to one name and remove the duplicate recipe. Likewise, establish whether `neutral` and `base` represent real, documented roles before retaining both.
3. Disabled is behavior, not a color variant. The current `variant="disabled"` recipe only supplies CSS. Migrate callers to the actual native `disabled` prop and remove that variant after its usages are gone. Disabled links need explicit handling because an anchor does not support native `disabled`.
4. Keep one `size="icon"` option for ordinary icon actions. Require a meaningful accessible name. Do not create individual EditButton/DeleteButton/CloseButton components that only repeat icon and color choices.
5. Review the focus-managed `showExternalIcon` code. Prefer a stable icon with CSS focus styling when possible, preserving existing child handlers and avoiding layout movement. Remove state and cloning only after confirming current consumers still work. A visual external-link marker must not silently change navigation behavior.
6. If pending actions repeat, add one small shared pending convention: visible progress, stable label/width, disabled repeat submission and appropriate busy state. Keep the async operation and error handling in the caller. Do not add parallel `loading`, `saving`, and `submitting` flags to the primitive.
7. Make button type intentional. Audit form callers before choosing a shared `type="button"` default; retain explicit `type="submit"` on submission actions. Do not break forms during consolidation.
8. Use `className` for placement and necessary feature layout. Repeated overrides of background, radius, font size or focus styling indicate a missing shared decision that belongs in the primitive or its tokens.

### Concrete migration candidates

- `src/app/admin/components/SuccessDisplay.tsx`: the dismiss action uses a native button with a literal multiplication sign and local colors. Use the canonical icon-size action and give it a clear dismiss label. Preserve the compact mode behavior.
- `src/app/admin/components/ErrorDisplay.tsx`, `ToastContainer.tsx`, and `src/app/admin/EffectErrorDisplay.tsx`: review retry and dismiss actions for the same shared treatment. Preserve error-specific recovery logic.
- `src/app/admin/AdminDashboard/ProjectsTabEnhanced.tsx`: already uses Button for New, but implements category filters, selectable project rows, and Featured Order independently. Migrate ordinary actions first; keep selection semantics distinct. Extract filters or selectable rows only when another screen actually shares the behavior.
- `src/app/admin/AdminDashboard/MediaTabEnhanced.tsx`: audit the repeated native actions alongside media selection controls. Preserve selection state, accessible names and grid/list behavior during migration.
- `src/app/admin/components/HtmlEditorEnhanced.tsx`: repeated toolbar buttons are a candidate for one local toolbar-item composition backed by the shared button. Preserve editor selection, focus behavior, pressed state and keyboard interactions. This does not justify a second general button system.
- `src/app/blog/BlogPage.tsx` and `src/app/browser-tabs/BrowserTabs.tsx`: both have native clear-search actions using local `styles.action`. Align ordinary clear actions with the shared button contract.
- `src/app/conferences/error.tsx`: Try again uses `coastal.primaryButton`; migrate it to the shared action component while preserving `reset`.
- `src/components/ui/sidebar.tsx`, `calendar.tsx`, and `navigation-menu.tsx`: keep library-owned interaction contracts. Calendar and navigation menu already consume `buttonVariants`; this is useful reuse, not a reason to nest buttons inside their triggers.

### Consolidate the next repeated families

`src/app/admin/components/LoadingSpinner.tsx` draws a Lucide spinner while `src/components/ui/page-spinner.tsx` draws a CSS border spinner. Choose one shared visual and let page/inline containers own their layout. Use readable loading text and avoid duplicate announcements when nesting these components.

`SuccessDisplay.tsx` and `ValidationFeedback.tsx` repeat the same green success treatment; validation also repeats closely related red and yellow message structures. Consolidate their presentation around semantic status tokens and a small status-kind API. Keep error parsing, lists of validation results, retry callbacks and toast lifecycle in their existing owners. Routine success can use polite status announcements; reserve alerts for errors needing immediate attention.

Use the existing Input, Textarea and Label primitives before introducing a new form library or copying more controls. Where field groups repeat, centralize label/control association and help/error IDs. Preserve input types, browser autocomplete, validation messages and focus on failed submission.

### Keep the component system small

- Do not count success by having the fewest TSX files. Count independent implementations of the same visual and behavioral contract.
- Reuse an existing component before adding a new one. A new reusable abstraction should have concrete repeated consumers or a clear accessibility/behavior responsibility.
- Avoid a universal UI component with dozens of flags and feature-specific branches. Prefer a small primitive API plus feature composition.
- Keep feature-specific rows, media tiles, editor tools and game controls local when their interaction differs. Sharing tokens does not require making all of them the same button shape.
- Do not move every component into one giant file or mark whole page trees `use client` for shared imports. Keep client boundaries as narrow as the interaction requires.
- Keep state in one appropriate owner and derive display values from it. Do not mirror props or Convex results into extra state unless that state is an intentional editable draft with a defined reset policy.
- After migrating consumers, remove unused implementations, old variants and orphaned CSS. Check dynamic class usage and third-party integration before deleting styles.

### Suggested sequence and acceptance checks

1. Capture the current callers and choose the surviving button roles. Migrate the simple clear, retry, dismiss and ordinary admin actions first.
2. Verify the existing button contract, then migrate one admin screen and one public screen before repeating across the app.
3. Consolidate loading and status presentation. Reuse input primitives and extract repeated field wiring only where proven useful.
4. Remove dead styling and aliases once imports and callers are migrated. Record any native controls retained intentionally.
5. Run project lint and TypeScript checks with pnpm. Compare new failures against the current baseline instead of relying on earlier-session results.
6. Exercise keyboard activation, visible focus, accessible icon labels, form submission, disabled/pending actions, retries and error messages. Check mobile and both themes. For `asChild`, check links remain links and do not produce nested interactive elements.
7. Add focused behavior tests if the shared component contract changes, especially form types, handler composition or pending submission. Do not add tests that merely duplicate class strings.

Done means common UI changes flow from their canonical owner, callers stop rebuilding the same styling, specialized interactions still work, and the migration removes superseded code. This handoff itself changes documentation only.


## Simple color guide

For the concise light/dark palette, checked contrast pairs and everyday design rules, use [Simple coastal design guide](../SIMPLE-DESIGN-GUIDE.md). This is the short reference Chris requested; keep the detailed audit here for implementation work.


## Homepage ocean motion update

Replaced the homepage hero’s Three.js water overlay with a small inline SVG using the same optimized photograph. A feathered shoreline mask limits gentle displacement and tidal movement to the water; the beach and buildings stay fixed. Removed the whole-photo arrival zoom, raised image quality from 60 to the already-supported 75, and shifted the mobile crop toward the ocean.

At Chris’s request there is no motion button. SVG animation pauses offscreen and in hidden tabs; `prefers-reduced-motion: reduce` displays the still photo and removes the animation layer, including when the preference changes while the page is open. The SVG crop reads the photo’s CSS object-position so responsive changes stay aligned. No video, new dependency, or generated replacement photograph was added.

Changed `hero-photo.tsx`, `hero-sea.tsx`, and their hero rules in `coastal.module.css`. Focused ESLint and full TypeScript checks passed. Chromium browser checks passed for motion, pause/resume, offscreen pause, reduced-motion fallback, mobile overflow and absence of a hero canvas; light and dark screenshots were inspected. Installed the existing frozen pnpm lockfile to bring missing local dependencies up to date. No deployment was performed.

Motion tuning after preview feedback: settled between the original nearly invisible effect and the stronger revision, using an 8-source-pixel sweep over 10 seconds. The final timing follows Chris's request for a tiny bit slower motion. The water mask starts slightly inland to include the existing foam. Reduced motion displays a static image without a manual override. The button and its unused styles/imports were removed.
