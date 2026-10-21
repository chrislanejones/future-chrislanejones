# Chapter 4: Coastal design and scenes

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../03-features/README.md) · [Next chapter](../05-content-and-media/README.md)

## Design vocabulary

Warm sand, ocean blue, TT Interphases, and shared semantic tokens carry the beach identity across the public site and admin. CSS Modules contain coastal layouts; Tailwind and shared UI primitives support forms and controls. Theme state lives in [theme-store.ts](../../../src/lib/theme-store.ts), rather than independent toggle state on each surface.

The [simple design guide](../../SIMPLE-DESIGN-GUIDE.md) is the detailed palette and contrast reference. The [sign-art README](../../../src/components/coastal/sign-art/README.md) documents the procedural sign assets.

## Hero and banner delivery

[HeroPhoto](../../../src/components/coastal/hero-photo.tsx) and [SceneBanner](../../../src/components/coastal/scene-banner.tsx) pass day/night assets to [SceneLoop](../../../src/components/coastal/scene-loop.tsx). The initial display is a WebP still; eligible visitors subsequently receive a muted MP4 loop. CSS chooses the still for the theme. The loop waits for loading/idle scheduling, pauses offscreen or in a hidden tab, and is omitted on narrow screens, Data Saver, or reduced motion.

A scene can omit its video and stay a still. The current Site History banner does so. The site no longer loads the legacy town model as its hero, even though old model source files remain in the repository.

Recordings originate in the separate private `3d-world` project. The [capture handoff](../../handoffs/2026-10-15-page-banner-scenes.md) explains cameras and capture steps. Still images and clips must depict the same shot; a changed scene or camera needs new captures.

## Interactive 3D and motion

[CoastFloor](../../../src/components/coastal/coast-floor.tsx) and [SandcastleBuilder](../../../src/components/coastal/sandcastle-builder.tsx) dynamically import their WebGL scenes. The decorative coast avoids narrow screens and Data Saver. The sandcastle loads near the viewport and pauses ongoing motion when hidden or reduced motion is requested.

[Reveal](../../../src/components/coastal/reveal.tsx) uses IntersectionObserver and the Web Animations API, leaving content in the HTML rather than hiding it until a motion library starts. Motion remains installed for other components.

See [ADR-009](../../adr/009-page-banners-use-recorded-video-loops.md), [ADR-011](../../adr/011-coastal-tokens-and-theme.md), and [ADR-012](../../adr/012-progressive-motion-and-lazy-webgl.md).

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../03-features/README.md) · [Next chapter](../05-content-and-media/README.md)
