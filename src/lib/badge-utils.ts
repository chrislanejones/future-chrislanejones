// lib/badge-utils.ts
/**
 * Badge color utilities for consistent color cycling across components
 */

export const BADGE_COLORS = [
  "blue",
  "green",
  "purple",
  "yellow",
  "pink",
  "cyan",
  "orange",
  "red",
] as const;

export type BadgeColor = (typeof BADGE_COLORS)[number];

/**
 * Get a badge color variant based on an index
 * Colors cycle through the BADGE_COLORS array
 *
 * @param index - The index to use for color selection
 * @returns A badge color variant
 *
 * @example
 * getBadgeColor(0) // "blue"
 * getBadgeColor(8) // "blue" (cycles back)
 * getBadgeColor(3) // "yellow"
 */
export function getBadgeColor(index: number): BadgeColor {
  return BADGE_COLORS[index % BADGE_COLORS.length];
}
