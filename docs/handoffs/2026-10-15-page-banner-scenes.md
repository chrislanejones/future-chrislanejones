# Page banner scenes

The home hero and 13 page banners now show the St. Augustine Beach 3D world (`~/repo/3d-world`, recorded at `2bb3fc8`). Each one is a still followed by a seamless video loop: day in light mode, night (21:00) in dark mode. `src/components/coastal/scene-banner.tsx` maps each page path to its image. Any page not listed there keeps the drawn `BeachBanner`.

## Home

`src/components/coastal/hero-photo.tsx` plays `public/hero/coast-day.*` in light mode and `coast-night.*` in dark mode. The camera is the hero's own: position [8, 30, 48], target [-1, 0, -3], FOV 37. It was recorded at FOV 48 and center-cropped to 75% of the height, which gives the same field of view. Day is 15.5 with 8 mph wind. Night uses the shared night settings below.

The site's older live copy of the town (`hero-coast-scene.tsx`, `hero-ocean-lite.tsx` and friends) is no longer loaded. See PARKING_LOT and ADR 009.

## Pages

| Page | Shot | Position | Target | Day time |
| --- | --- | --- | --- | --- |
| /about | Pier from straight above, Fisheye (10-20-2026) | [34.5, 44, -62.9] | [33.7, 31.4, -63] | 7.0 |
| /browser-tabs | Ethel's Filling Station | [-8.8, 1.3, 29.3] | [0.88, 0.4, 28.28] | 17.5 |
| /contact | 2nd Ave at sunrise | [-35.3, 1.6, 3.7] | [-33.42, 1.5, 3.02] | 6.75 |
| /blog | Behind the fishing boat | [45, 2.6, -10] | boat, turned 16° left | 17.5 |
| /conferences | Pier from above | [44, 16, -62] | [16, 1, -94], turned 12° left | 17.5 |
| /career-and-resume | From the boat toward shore | [36.4, 1.9, -7.9] | [8, 3.2, -3] | 17.5 |
| /projects | Town aerial, tilted down so no world edge shows | [4, 36, 24] | [-8, 0, -20], turned 10° left | 15.5 |
| /site-history | Town and pier from the air, Fisheye, **stills only** (10-20-2026) | [23.3, 13.3, -26.4] | [15.1, 10.6, -35.6] | 7.0 |
| /site-map | Top down | [-38, 170, -29.9] | [-38, 0, -30] | 12 |
| /react-maintenance | Boat at sunrise | [19, 1.7, 6] | boat, turned 16° left | 6.75 |
| /wordpress-maintenance | 9th Street toward the beach | [-7.1, 0.9, 3.6] | [12, 3, 3.4], turned 5° left | 17.5 |
| /logo-page | Along the beach | [34, 9, 12] | [18, 0, -8], turned 18° left | 17.5 |
| /admin-showcase | El Castillo | [-16.5, 8, 8.5] | [5.94, 4.6, -15.56] | 17.5 |

Every page also has a night version from the same camera: 21.0, clear sky (full moonlight), exposure 1.35, ocean motion "Some motion" and 14 mph wind, so trees and flags visibly move in the dark. Medium waves were tried first and made the boat look storm-tossed. Days use scattered clouds, exposure 1.00, "Some motion" and 6-12 mph wind. Blog and React maintenance were recorded for 20 s to give the boat's seam more candidates. Files: 720p (1280 px) WebP stills at quality 80 and H.264 loops, 16.3 MB of video and 1.6 MB of stills in total.

The page title and its cream fade cover the left half of every banner, so each camera is turned left until its subject sits right of center. The first three shots started from Chris's own framing, with targets [12, 4.6, -8], [0.9, 0.4, 30.1] and [-33.3, 1.5, 3.8].

### 10-20-2026 re-shoots

Chris framed both shots in the viewer himself. Both use the **Fisheye** lens, clear sky, wind 10 mph from E, and people and cars on. Night uses the shared settings with the same lens. They were shot on 3d-world `f27bb1b` (main), not the `2bb3fc8` checkout the other banners used, so the newer streets show.

| Page | Day | Night | Video |
| --- | --- | --- | --- |
| /about | 7.0 | 21.0 | Yes. 20 s recorded, loops of 9.7 s (day) and 9.9 s (night) |
| /site-history | 7.0 | 21.0 | **No.** Chris wants stills only, so the page keeps the still and plays nothing |

`recorder.js` now sets `Scene.lens` when a job gives `lens`. The /about jobs are `about3-day` and `about3-night` in `jobs.json`. The site-history stills come from `site-history-stills.cjs` in `~/ai-repo/banner-capture`.

## Loading

`src/components/coastal/scene-loop.tsx` handles both the home hero and the page banners.

| Stage | What shows | When |
| --- | --- | --- |
| 1 | Day or night still (CSS picks by theme), blur placeholder on banners | With the page |
| 2 | That theme's MP4 loop, faded in over 1.2 s | After the load event and an idle moment |

The still is the loop's first frame, so the fade shows no jump. The loop pauses offscreen and in hidden tabs. Phones under 632 px, Data Saver and reduced motion keep the still.

## How the loops are made

1. In the viewer, freeze `performance.now` and `requestAnimationFrame`, then step 1/30 s per frame through react-three-fiber's `advance()`. Recording is then deterministic even when Chrome throttles a background tab.
2. Clouds are held still (cloud motion 0); waves, the boat, flags and wind in the trees all move.
3. Record 13 s (390 frames; 20 s for boat shots) at 1280 px wide as JPEG frames. The most reliable recorder is Chromium in WSLg on the RTX 4060 (`GALLIUM_DRIVER=d3d12`, `--use-angle=gl`), driven by Playwright; the viewer must also be told it is visible, or it stops animating.
4. `make_loop.py` picks a loop length from 6 to 18 s whose continuation best matches the first second, blends that second in, and encodes H.264 at CRF 27 with faststart. Its first frame is saved as the still.

The seam measures the same as an ordinary keyframe step mid-video, so the wrap shows no jump.

The scripts that do all of this (receiver, recorder, Playwright runner, the 28-job list, the loop builder and the banner writer) live on Chris's machine in `~/ai-repo/banner-capture`, with a README.

## Recapturing

1. Run the 3d-world viewer from a clean checkout on a spare port. Codex often works live on 3011.
2. In the console, import `camera-rig-store.ts` and leva's `levaStore` from the Vite module URLs.
3. `cameraRig.jumpTo({ position, target })`, then set `Scene.time`, `Scene.windSpeed` and `Scene.windFrom` with `levaStore.setValueAtPath`.
4. Hide everything but the canvas with CSS, wait about 8 seconds for streamed detail to arrive, then call `canvas.toDataURL()` inside `requestAnimationFrame`.
5. For video, follow "How the loops are made" above. For a single still, resize to 2000 px wide and save as WebP. Either way, regenerate the banner's 16×9 blur placeholders. The dev server caches optimized images by URL, so move `.next/dev/cache/images` aside before checking a replaced file locally.

Street-level cameras can end up inside a building when turned. Check every capture before using it.
