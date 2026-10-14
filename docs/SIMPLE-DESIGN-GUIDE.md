# Simple coastal design guide

Keep the site calm and readable: warm sand, ocean blue, and plenty of space. Use the same small palette for public pages and admin, with light and dark versions of each role.

## Colors

These values come from the existing coastal tokens in `src/app/globals.css`. Components should consume those tokens rather than copy the hex values below.

| Role | Light mode | Dark mode |
| --- | --- | --- |
| Page background | `#F6F5F0` warm sand | `#12282E` deep ocean |
| Panel background | `#EEEEE6` soft sand | `#1A343B` raised ocean |
| Main text | `#173F4A` dark blue | `#E6EFEC` pale sea mist |
| Secondary text | `#53676A` muted slate | `#B0C3C5` light slate |
| Links and primary buttons | `#235967` ocean blue | `#A7D3D7` light sea blue |
| Text on primary buttons | `#F8FBFA` off-white | `#163B45` dark blue |
| Input borders | `#708B90` slate | `#779298` light slate |

Think of this as **sand and blue**, with supporting shades for readability. Keep other brand accent colors out of ordinary controls. Reserve status colors for actual warnings, errors and success, accompanied by text or an icon.

## Use 60–30–10 loosely

- **60%:** the main background and open space.
- **30%:** quiet panel surfaces and supporting sections.
- **10%:** blue actions, links and selected details.

These are approximate visual proportions, not a pixel quota or a contrast test. Dark mode uses deep ocean backgrounds and light blue accents in the same roles.

## Approved contrast pairs

Calculated from the opaque colors above. For text and borders, the values below are the lowest contrast across the page, panel and existing soft surface (`#E8EFF0` light / `#203E46` dark).

| Pair | Light | Dark |
| --- | --- | --- |
| Main text on surfaces | 9.75:1 | 9.75:1 |
| Secondary text on surfaces | 5.12:1 | 6.23:1 |
| Blue links on surfaces | 6.68:1 | 7.04:1 |
| Button text on button fill | 7.48:1 | 7.41:1 |
| Input borders against surfaces | 3.11:1 | 3.45:1 |

Normal text needs at least **4.5:1** under [WCAG AA text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Necessary control boundaries and state indicators need **3:1** against adjacent colors under [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). All listed pairs clear their respective thresholds.

Keep these pairs intact. White text does not belong on the pale dark-mode button; use its dark text token. Recheck hover states, opacity, overlays and text over photos because they change the actual contrast. These pair checks do not certify the entire interface.

## A few shared rules

- Keep the existing TT Interphases font and shared body, heading and display sizes.
- Use the existing **12px control radius** and **20px media radius** consistently. Avoid choosing new corners per page.
- Reuse the shared Button, Input and Textarea. Change their tokens once to update their consumers.
- Underline inline links. Keep a visible focus outline with separation from the control; check it on the actual adjacent surface.
- Use the stronger input-border colors above for control boundaries. The faint decorative divider token is not a substitute.
- Switch semantic tokens for dark mode, including menus and dialogs rendered in portals. Preserve each color’s role.

Scope: this is a compact reference for the coastal palette, not an implementation change. The app still has other global color definitions; align consumers deliberately as shared UI is consolidated.
