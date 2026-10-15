# Page banner scenes

The home hero and 13 page banners now show stills from the St. Augustine Beach 3D world (`~/repo/3d-world`, captured at `2bb3fc8`). `src/components/coastal/scene-banner.tsx` maps each page path to its image. Any page not listed there keeps the drawn `BeachBanner`.

## Home

`src/components/coastal/hero-photo.tsx` shows `public/hero/coast-light.webp` and `coast-dark.webp`. The camera is the hero's own: position [8, 30, 48], target [-1, 0, -3], FOV 37. Each still was shot at FOV 48 and center-cropped to 75% of its height, which is the same field of view.

| Theme | Time | Wind |
| --- | --- | --- |
| Light | 15.5 | 8 mph E |
| Dark | 19.25 (dusk, windows on) | 5 mph E |

The home page no longer loads the site's live 3D copy or the moving-sea layer. That copy is an older town with no boat and older trees, so fading into it would have replaced the new still with an older scene. The files are still in the tree; see PARKING_LOT.

## Pages

| Page | Shot | Position | Target | Time |
| --- | --- | --- | --- | --- |
| /about | El Castillo, pier, boat | [-16.5, 8, 8.5] | [5.94, 4.6, -15.56] | 17.5 |
| /browser-tabs | Ethel's Filling Station | [-8.8, 1.3, 29.3] | [0.88, 0.4, 28.28] | 17.5 |
| /contact | 2nd Ave at sunrise | [-35.3, 1.6, 3.7] | [-33.42, 1.5, 3.02] | 6.75 |
| /blog | Behind the fishing boat | [45, 2.6, -10] | boat, turned 16° left | 17.5 |
| /conferences | Pier from above | [44, 16, -62] | [16, 1, -94], turned 12° left | 17.5 |
| /career-and-resume | From the boat toward shore | [36.4, 1.9, -7.9] | [8, 3.2, -3] | 17.5 |
| /projects | Town aerial | [-12, 65, 87] | [-23, 0, -30], turned 10° left | 15.5 |
| /site-history | Town at night | [-12, 40, 50] | [-15, 0, -20], turned 12° left | 20.75 |
| /site-map | Top down | [-38, 170, -29.9] | [-38, 0, -30] | 12 |
| /react-maintenance | Boat at sunrise | [19, 1.7, 6] | boat, turned 16° left | 6.75 |
| /wordpress-maintenance | 9th Street toward the beach | [-7.1, 0.9, 3.6] | [12, 3, 3.4], turned 5° left | 17.5 |
| /logo-page | Along the beach | [34, 9, 12] | [18, 0, -8], turned 18° left | 17.5 |
| /admin-showcase | El Castillo at night | [-16.5, 8, 8.5] | [5.94, 4.6, -15.56] | 20.75 |

All shots use scattered clouds, exposure 1.00 and the Regular lens, with wind from the east at 5-12 mph. Files are 2000 px wide WebP at quality 78.

The page title and its cream fade cover the left half of every banner, so each camera is turned left until its subject sits right of center. The first three shots started from Chris's own framing, with targets [12, 4.6, -8], [0.9, 0.4, 30.1] and [-33.3, 1.5, 3.8].

## Loading

The stills load like the old home poster: `loading="eager"`, `fetchPriority="high"` and quality 75. Page banners also get an inline 16×9 blur placeholder. No three.js loads on any of these pages.

## Recapturing

1. Run the 3d-world viewer from a clean checkout on a spare port. Codex often works live on 3011.
2. In the console, import `camera-rig-store.ts` and leva's `levaStore` from the Vite module URLs.
3. `cameraRig.jumpTo({ position, target })`, then set `Scene.time`, `Scene.windSpeed` and `Scene.windFrom` with `levaStore.setValueAtPath`.
4. Hide everything but the canvas with CSS, wait about 8 seconds for streamed detail to arrive, then call `canvas.toDataURL()` inside `requestAnimationFrame`.
5. Resize to 2000 px wide and save as WebP. For a page banner, regenerate its 16×9 blur placeholder too. The dev server caches optimized images by URL, so move `.next/dev/cache/images` aside before checking a replaced file locally.

Street-level cameras can end up inside a building when turned. Check every capture before using it.
