# Coastal design, 3D town, and motion handoff

## Resume here

Chris approved the current tilted **3D camera angle** and asked to keep extending and detailing the coastal neighborhood. Preserve this angle. Latest requested style includes close-set houses, slight building rotations, varied roof shapes, apartments, porches/stairs, garages on some homes, pools, weathered flat-roof commercial buildings with AC units, varied parking surfaces, road markings, lamps, trees, dune walkways, and shadows. **No chimneys.**

- Worktree: `/home/clj/repo/future-chrislanejones-beach`
- Branch: `design/beach-homepage`
- Preview: http://localhost:3010
- Server: `pnpm run dev --port 3010`
- Work is local, uncommitted, and not deployed.
- Use pnpm; preserve unrelated/concurrent work and follow `AGENTS.md`.

## Beach Coast skill

Created and validated the reusable skill at `/home/clj/.codex/skills/beach-coast/SKILL.md`; invoke as `$beach-coast`. Its supporting references cover connected town layouts, the building/landscape kit, shadows, rendering, and verification. UI metadata is in `agents/openai.yaml`.

The user suggested “St Aug Town Creator,” then “Beach Coast,” and authorized choosing the name. **Beach Coast** is the implemented name. It was used to guide the current street extension and varied building pass. It is installed in the local user skill directory, not committed to this repository. It guides bounded scene-building work; it does not create an autonomous background process.

## Current hero implementation

The previous SVG/photo warp has been replaced by an original procedural React Three Fiber scene. `hero-sea.tsx` is removed because nothing imports it.

| File | Responsibility |
| --- | --- |
| `src/components/coastal/hero-coast-model.ts` | Seeded houses, apartments, landmark-inspired hotels, commercial buildings, roads, markings, parking, cars, vegetation, lamps, and boardwalk geometry. Static geometry is merged into seven material batches. |
| `src/components/coastal/hero-coast-scene.tsx` | Fixed camera, responsive crop, terrain/ocean shaders, sun and shadows, bounded demand rendering, theme palette, context-loss handling. |
| `src/components/coastal/hero-photo.tsx` | Lazy scene loading, original Next Image underneath, error fallback, visibility/reduced-motion/theme subscriptions. |
| `src/components/coastal/coastal.module.css` | Scene fade-in and existing text overlay; rounded Beyond the browser section. |
| `src/app/page.tsx` | Contained rounded Beyond the browser section. |

The user's screenshots and St. Augustine Beach map view informed the composition. Best Western Seaside Inn is represented by a long terracotta-roof hotel; another beachside hotel, a pale coastal home with a separate garage, and original residential/commercial blocks complete the scene. There are no map tiles, imported map-building geometry, identifying private-home labels, external model assets, or new dependencies. This is an illustrative approximation, not surveyed geography.

### Preserve the approved camera

Desktop: position `[8, 30, 48]`, target `[-1, 0, -3]`, FOV `37`.
Mobile scene width below 600: position `[13, 30, 48]`, target `[4, 0, -3]`, FOV `48`.
Near/far: `.1` / `350`. The view is roughly 57 degrees from vertical.

Camera changes are not needed to extend the town. X points toward the ocean; Z follows the boulevard. With this camera, more negative Z fills the distance near the top of the banner. The extension reaches about Z=-132; main-road intersections are explicitly listed and avoid the existing hotels. Some small access lanes connect residential driveways. Layout is compositional, not geographically exact.

### Buildings and landscape

Close-set houses use narrow footprints, varied heights, hip/gable roofs and ridge directions, pastel walls, upper porches, selected stairs/awnings/garage doors, and a few small rotations. Rotated buildings are narrowed to retain roof clearance. Apartments have more windows, floor bands, upper balconies, and flat roofs. Commercial buildings include a small storefront strip and a taller hotel with rooftop AC equipment, stains/repair patches, and pale or dark parking surfaces.

Parking includes striped stalls, wheel stops, a mixture of cars and empty spaces, and landscaped edges. Roads include paired yellow center lines, white edges, crossing gaps, crosswalks, and lamps. Palms and irregular broadleaf canopies add variation. Timber beach-access decks follow their actual 3D slopes over the dunes.

The town is static. Roofs, buildings, trees, cars, lamps, equipment, and walkways cast shadows. The terrain shadow receiver uses the same geometry and displacement as the visible terrain so shadows follow the dunes. The directional shadow map is cached after its initial render; update it if future work moves the sun or town geometry.

### Motion and fallback

Gentle shader-driven water movement uses a ten-second surf phase, small geometric swells, irregular highlights, and broken shoreline foam. Land and camera remain still. No video and no motion button.

The render loop requests at most 30 updates/sec while visible and motion is permitted; this is a cap, not a measured device frame-rate guarantee. Pixel ratio is limited to 1–1.5. Reduced motion freezes the **3D scene**, including live preference changes. Offscreen/hidden-tab motion pauses. The original `public/gallery/Florida-Coast-Aerial.webp` stays underneath and is the fallback while loading or after WebGL failure/context loss. Next Image quality is 75.

## Design documentation

[Simple coastal design guide](../SIMPLE-DESIGN-GUIDE.md) contains the existing light/dark coastal palette, computed contrast pairs, approximate 60–30–10 proportions, typography, radii, and shared-component guidance. A full design-system showcase was not requested.

[CSS and admin handoff](2026-10-13-css-and-admin-handoff.md) includes the React SSOT consolidation plan. There is one canonical `src/components/ui/button.tsx`; most duplication is independently styled native controls. The broader button/input/loading/status migration is documentation only.

## Rounded section and game

Beyond the browser is now a contained section with the existing 20px media radius, responsive inner padding, and clipped artwork. Its outer section owns the shared container; the inner content no longer adds a second container. The background fade was removed so the rounded outline reads clearly. Earlier browser measurements showed 40px desktop and 16px mobile margins with no overflow.

The existing sandcastle game was verified in Chromium with desktop mouse/keyboard and a 390px touch viewport: scene loading, placement, stacking two buckets plus tower, flags, shells, erase, undo, wall rotation, adjacent moats, clear, dark mode, keyboard placement, and Ctrl+Z. No game source changes were required. Bigger terrain, bucket-specific tool models, and shovel/moat animation remain proposed follow-ups, not implemented features.

## Verification

- Focused ESLint and full `pnpm exec tsc --noEmit --incremental false` passed after the expanded-town and terrain-shadow changes.
- Chromium rendered the expanded desktop scene without page, shader, or WebGL errors; screenshot inspected.
- Skill validator passed: `python3 /home/clj/.codex/skills/.system/skill-creator/scripts/quick_validate.py /home/clj/.codex/skills/beach-coast`.
- Final Chromium checks passed at 1440px desktop and 390px mobile emulation: 3D startup, advancing water time, live reduced-motion freeze with zero idle draw calls, motion restoration, offscreen render pause, light/dark screenshots, no horizontal overflow, game load/place/clear, and an actual `WEBGL_lose_context` transition to the loaded photo fallback. No unexpected browser errors were captured. Inspected both mobile theme screenshots.
- The first extra game check incorrectly assumed the initial beach was empty. Clearing the starter castle before placement fixed the test; no game source fix was necessary.
- Focused ESLint and full TypeScript checking also passed after the final shader-disposal cleanup. `git diff --check` passed. Hidden-tab behavior is implemented but was not separately exercised by these final browser checks.

This is browser emulation, not a physical-phone performance or full accessibility audit. Earlier `pnpm install --frozen-lockfile` aligned local modules with existing declarations; package manifests and the lockfile were not modified for this work.

## Historical SVG tuning

Before the explicit request for a 3D recreation, Chris approved a photo-based SVG effect with translation `2 0; -6 0.75; 2 0`, a 10s cycle, displacement 5, and 12s/17s noise travel. That implementation has been superseded. Preserve the intent of modest, slow movement and OS-controlled reduced motion rather than restoring the obsolete SVG file.

## Shared checkout

`SESSION-HANDOFF-2026-10-13.md` and `docs/.SIMPLE-DESIGN-GUIDE.md.swp` predate this task; leave both intact, especially the other terminal's editor swap file. No commit, push, or deployment was performed. The detailed SSOT refactor and proposed game expansion are separate future work.
