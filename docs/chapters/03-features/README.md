# Chapter 3: Pages and features

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../02-architecture/README.md) · [Next chapter](../04-design-and-scenes/README.md)

The beach version brings the 2026 move back to Florida into the portfolio: St. Augustine Beach scenes, warm sand, an ocean palette, music, conference memories and a small interactive sandcastle.

## Public pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, clients, selected projects, music, ramblings, photos, latest posts, technology and sandcastle |
| `/about` | Background, interests and conference slider |
| `/projects`, `/projects/[slug]` | Work index and individual project pages |
| `/blog`, `/blog/[slug]` | Writing and articles |
| `/conferences`, `/conferences/[year]`, `/conferences/[year]/[slug]` | Conference index, years and event details |
| `/career-and-resume` | Career timeline and PDF/Word download routes |
| `/browser-tabs` | Searchable, grouped developer resources |
| `/contact` | Contact form backed by Convex |
| `/link-page` | Social and portfolio links |
| `/logo-page`, `/site-history` | Brand story and previous site designs |
| `/react-maintenance`, `/wordpress-maintenance` | Maintenance service pages |
| `/site-map` | Human-readable page directory |
| `/color-guide` | Coastal palette reference |
| `/admin-showcase` | A public explanation of the CMS |
| `/admin` | Owner-only content management |

## Sandcastle

The 9 by 7 beach supports building, piling sand and digging water-filled moats. Mouse, touch and keyboard controls share a reducer-backed model, with undo and reset. Its scene is loaded near the viewport, and animation responds to visibility and reduced-motion preferences. Play state is local to the component; it is not a saved Convex document.

## Reading and interaction

Light and dark themes share semantic colors. Public controls include visible focus states and responsive layouts. Motion-sensitive visitors get still scenes or reduced animation. These implementation choices do not constitute a whole-site accessibility certification.

For component locations, see [Architecture](../02-architecture/README.md); for the rules behind the sandcastle, see [ADR-013](../../adr/013-sandcastle-state-and-rendering.md).

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../02-architecture/README.md) · [Next chapter](../04-design-and-scenes/README.md)
