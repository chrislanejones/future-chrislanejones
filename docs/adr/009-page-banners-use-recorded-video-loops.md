# ADR-009: The home hero and page banners show a still, then a recorded video loop, instead of live three.js
Date: 2026-10-15   Status: draft

## Context
The home hero loaded in three stages: a WebP still, a small WebGL layer that
moved only the sea (`hero-ocean-lite.tsx`), then the site's own copy of the 3D
town (`hero-coast-scene.tsx`, about 275 KB of script plus an in-browser model
build), faded in after the load event and an idle moment. Phones and Data Saver
skipped the 3D. The private St. Augustine Beach world (`~/repo/3d-world`) has
since grown (boat, people, newer trees, streamed detail): its prebuilt town is a
22 MB gzipped base plus 61 detail tiles up to 2.3 MB each. That is too heavy to
load per page, and the site's old copy no longer matches the world.

## Decision
The home hero and 13 page banners show a still image, then a seamless looping
H.264 MP4 recorded from the 3d-world viewer: a day loop in light mode, a night
loop in dark mode. The site no longer loads live three.js on the home hero.
Recording freezes the page clock and steps it 1/30 s per frame through
react-three-fiber's `advance()`, with clouds held still, so captures are
deterministic even in a throttled background tab. About 13 s is recorded per
shot. A script picks the loop length (6 to 11 s) whose continuation best
matches the opening frames, crossfades one second at the seam, and encodes at
CRF 27 at 720p (1280 px wide, 176 KB to 1.2 MB per loop). The still is the loop's first frame, so the
image-to-video hand-off does not jump. The measured seam is the same size as an
ordinary keyframe step mid-video.
`src/components/coastal/scene-loop.tsx` renders both stills with `next/image`
(eager, high priority) and lets CSS show the one for the current theme. The
current theme's video mounts after the window load event plus
`requestIdleCallback`, fades in on its first `playing` event, and pauses
offscreen or in a hidden tab. It is skipped under 632 px wide, with Data Saver,
or with `prefers-reduced-motion`.

## Consequences
+ Banners match the current 3D world, at 0.2 to 1.2 MB of video per page (only the current theme's loop downloads) instead
  of 275 KB of script plus a model build (or 22 MB+ for the newer town).
+ No WebGL on the page: no GPU cost, no shader compile, and the first paint is
  a plain image.
- No motion on phones (under 632 px), with Data Saver, or with reduced motion.
- 28 MP4 files (16.3 MB) and 28 WebP stills (1.6 MB) are committed under `public/`. Git
  and repo size grow, and Vercel serves them as static assets.
- Loops go stale. They must be re-recorded when the world or a camera changes
  (recipe in `docs/handoffs/2026-10-15-page-banner-scenes.md`). The old hero 3D
  files (`hero-coast-scene.tsx`, `hero-ocean-lite.tsx`, `ocean-clock.ts`,
  `hero-coast-model.ts`, `coast-atmosphere.tsx`) are now unused and listed in
  `PARKING_LOT.md` for removal or a future port.

## Alternatives rejected
- Port the newer world and ship each page only the slice its camera sees. True
  live 3D, but a big port and several MB per page.
- Load the whole newer town. 22 MB+ per page.

## Revisit when
The per-page live 3D port becomes worth it, or repo size from video becomes a
problem (move media to blob storage).

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason: the
3d-world kept changing and nobody re-recorded. Each refresh is 28 files across
13 cameras and two lighting setups, run from a private repo by hand, so the
banners drifted behind the world they advertise, while every re-record added
another ~18 MB of binary history to git that can't be taken back without
rewriting pushed history.
Early warning sign to watch for: a 3d-world commit that changes a banner
camera, the town, or lighting with no matching loop refresh in this repo, or
`.git` growing past a few hundred MB.
