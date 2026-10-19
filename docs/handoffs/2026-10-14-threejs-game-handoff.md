# Claude handoff: sandcastle game and website work

Chris is assigning Claude the sandcastle game and other website work. Codex continues the procedural coastal world, its cameras, lenses, lighting and landmark models. This is a shared working checkout: preserve concurrent edits and coordinate before touching shared files.

## Project and previews

- Repository: `/home/clj/repo/future-chrislanejones-beach`.
- Website: `http://localhost:3010`; game section: `http://localhost:3010/#mountains-to-beaches`.
- About: `http://localhost:3010/about`, now an east-facing 9th Street walking view.
- Standalone coastal world: `http://localhost:3011` (`pnpm run dev:map`).
- Use **pnpm only**, read `AGENTS.md` and `CLAUDE.md`, and read the installed Next documentation for relevant changes. Convex edits require `convex/_generated/ai/guidelines.md`.
- Git commands are authorized, but no merge, deployment, authentication or billing change is requested by this handoff. Preserve unrelated changes and the running development servers.

## Sandcastle source map

| File | Responsibility |
| --- | --- |
| [sandcastle-builder.tsx](../../src/components/coastal/sandcastle-builder.tsx) | Tools, keyboard controls, state dispatch, lazy loading, bucket loader, intersection/motion/theme lifecycle, status and help text. |
| [sandcastle-model.ts](../../src/components/coastal/sandcastle-model.ts) | Pure reducer, placement rules, history, stacked levels and decoration elevation. |
| [sandcastle-scene.tsx](../../src/components/coastal/sandcastle-scene.tsx) | R3F canvas, orthographic camera fit, procedural sand/water, pieces, connected moats, hit plane and marker. |
| [sandcastle-builder.module.css](../../src/components/coastal/sandcastle-builder.module.css) | Game layout, controls, loading art and responsive styles. |
| [beach-castle-scene.tsx](../../src/components/coastal/beach-castle-scene.tsx) | Shared bucket artwork/model used by the game. |
| [shell-geometry.ts](../../src/components/coastal/shell-geometry.ts) | Shell geometry and sand texture helpers. |

## Current implemented behavior to retain

- A 7×5 grid accepts towers, molded bucket castles, walls, moats, flags and shells; erasing removes decorations first, then the top structure.
- Buckets can support a second bucket and a tower, with at most three structure levels. Flags and shells sit on the computed top elevation. Clear decorations before stacking another structure.
- Tapping an existing wall with the wall tool turns it. Explicit rotation, undo, clear, keyboard placement and arrow-key marker movement also work.
- Moats connect to orthogonal neighbors, including corners and rings. Diagonal connections are excluded because they previously created crossing channels through the middle.
- The invisible ground hit plane rounds pointer positions to cells. Pointer travel of 10px or more does not place a piece. Hover updates the marker and the aimed-spot ref; the “Place at marker” button uses that ref rather than stale render state.
- Shader sand uses soft interpolated value noise to avoid grain aliasing. The water corner follows screen coordinates across aspect ratios. A separate shadow receiver overlays the custom shader.
- The scene preloads near the viewport; the bucket begins its 2.2-second fill when the section becomes visible. Animation respects reduced motion and pauses offscreen or while the tab is hidden. Shell resources are disposed on unmount.

These statements describe the current source. The latest coastal-model increment did **not** modify the sandcastle game files, and no uncommitted game diff was present when preparing this handoff. Do not describe these as newly applied fixes from the lens/sign work.

## Previous verification and open work

The [previous design/hero handoff](2026-10-13-design-and-hero-motion.md#rounded-section-and-game) records Chromium desktop mouse/keyboard and 390px touch checks: loading, placement, bucket/bucket/tower stacking, flags, shells, erase, undo, wall rotation, adjacent moats, clear, dark mode, keyboard placement and Ctrl+Z. Those are prior checks; recheck after your edits. The beach starts with four pieces, so clear it before tests that assume an empty grid.

Bigger game terrain, more tool-specific bucket artwork, and shovel/moat animation were proposed follow-ups, not completed features or an instruction to implement every proposal. Follow Chris's next direction. Check whether the loader covers error/fallback content when the scene import or WebGL fails; no new claim of a corrected loading failure is made here.

Useful validation: `pnpm exec tsc --noEmit`, focused `pnpm exec eslint` on changed files, then browser placement/stacking/history and pointer/keyboard checks at desktop and mobile widths. Verify light/dark, live reduced motion, offscreen pause and fallback for changes to the scene lifecycle.

## Codex retains the coastal world

Please leave these generators and viewer modules with Codex unless Chris reassigns them: `hero-coast-model.ts`, `hero-coast-scene.tsx`, `coast-terrain.ts`, `coast-atmosphere.tsx`, `coast-lenses.tsx`, `castillo-real.ts`, `best-western-detail.ts`, `beach-landmark-houses.ts`, `coastal-street-life.ts`, `ninth-street-detail.ts`, `tenth-street-block.ts`, `tenth-street-west.ts`, `sign-lettering.ts`, `sign-art/`, `map-viewer/`, and `vite.map.config.ts`.

The world is Three.js/R3F using WebGL, with static geometry in seven batches and demand rendering. The tweak tool now has time, cloud cover and **Regular / Fisheye / Telephoto** lenses; fisheye uses an actual render/composite/output pipeline. Lens changes preserve the camera position/orientation. The homepage and About have separate approved cameras and text fades.

Fictional landmark branding is now **El Castillo**, **Best Eastern** and **Ethel's Filling Station**. Best Eastern's sign keeps the reference's blue/white monument composition, with an enlarged blue name panel. Ethel's is based on Obi's Fillin' Station around A1A/7th Street/Lane. A later banner using it has been mentioned but no new page destination is specified yet.

`ethel-filling-station.ts` implements the stepped flat roof, rounded DINER bay, original colorful panels, glazed entry, vintage pumps, picnic tables and rooftop pickup sculpture. That generator also remains with Codex. Claude's read-only CLI handoff was acknowledged successfully; this document is the durable context for Chris's ongoing Claude session.

The installed reference skills are `/home/clj/.codex/skills/beach-coast` and `/home/clj/.codex/skills/st-augustine-9th-street`. Keep the corrected north-side Best Eastern carport, the boulevard-side lawn, realistic low dunes, no personal/avatar/home markers, and the requested 5:30 PM purple-orange sunset.

## Claude update, 10-14-2026 (shipped to main, live)

The game files changed on `main`; this working copy is behind. Rebase before touching them.

| PR | Change |
| --- | --- |
| #36 | Bucket-and-shovel loader that fills with color (`sandcastle-builder.tsx`, `.module.css`) |
| #39 | Loader steps aside when the scene import fails (settles on error too) |
| #40 | 9×7 beach; moldable sand height field (Pile sand / Dig moat, trenches with banks, mounds raise pieces); coral shovel + rising moat water; tool-button art (`sandcastle-tool-art.tsx`); 11 model tests (`sandcastle-model.test.ts`) |

## Claude update, 10-14-2026 (later): scene controller and camera rig in the map viewer

Uncommitted, in this working copy. `pnpm run dev:map` → <http://127.0.0.1:3011>.

| File | What |
| --- | --- |
| `map-viewer/main.tsx` | Leva "Scene controller" panel replaces the `<details>` settings panel; arrow pads added |
| `map-viewer/scene-controls.tsx` | `useSceneControls()`: Scene folder (time 6 AM–8 PM, weather, exposure, lens, ocean motion), Global camera folder (live readout, editable position/target, speed), Views folder (presets in rows of three, saved views, save view, forget saved, one copy as code for the active camera), Shot camera folder (add camera, fov, aspect) |
| `map-viewer/rig-pad.tsx` + `style.css` | Move pad and Look pad, hold-to-move |
| `src/components/coastal/camera-rig.tsx` | Replaces `ExplorerCamera` in explore mode: OrbitControls plus eased keyboard/pad motion, preset flights, readout |
| `src/components/coastal/camera-rig-store.ts` | Shared store, `CAMERA_PRESETS`, `viewAsCode` |
| `src/components/coastal/hero-coast-scene.tsx` | `exposure` prop and `<Exposure>`; `ExplorerCamera` removed; `OrbitControls` import moved to the rig |
| `package.json` | `leva` dev dependency |

The home and about cameras are untouched. `map-viewer/README.md` documents the controls. The reusable version lives in the `3d-mapping` skill under `templates/camera-rig/`.

## Claude update, 10-14-2026 (later still): shot camera, pool court

| Change | Files |
| --- | --- |
| Shot camera + viewfinder: add a camera into the world, drive it with the same pads (Global · Shot · Move through switch above the pads, C and V keys), zoom keys change its fov, viewfinder in the bottom-right at window / 16:9 / hero / phone aspect with Place camera here, Go there and a close box | `src/components/coastal/shot-camera.tsx`, `map-viewer/viewfinder.tsx`, store + rig + pad + controls updated |
| Global camera near plane .1 → .5 (stops thin layers shimmering) | `camera-rig.tsx` |
| Best Eastern pool rebuilt as a fenced court (deck, coping ring, pool, spa, loungers, pergola, umbrellas, knee wall + cap + panels, hedges, palms) | `hero-coast-model.ts` |
| Dev handle `window.__cameraRig` in the viewer | `map-viewer/main.tsx` |

The `3d-mapping`, `beach-coast` and `st-augustine-9th-street` skills are now linked into both `~/.claude/skills` and `~/.codex/skills`. `beach-coast/references/best-western.md` has a "Pool court" section.
