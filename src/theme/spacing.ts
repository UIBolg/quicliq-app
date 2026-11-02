/**
 * Spacing tokens (Figma collection "Spacing", exact names spacing/N).
 * Rule: "8px rhythm, 4px details" — layouts use multiples of 8; 2, 4, 6, 12 only inside components.
 */
export const spacing = {
  'spacing/0': 0,
  'spacing/2': 2,
  'spacing/4': 4,
  'spacing/6': 6,
  'spacing/8': 8,
  'spacing/12': 12,
  'spacing/16': 16,
  'spacing/24': 24,
  'spacing/32': 32,
  'spacing/40': 40,
  'spacing/48': 48,
  'spacing/56': 56,
  'spacing/64': 64,
  'spacing/72': 72,
  'spacing/80': 80,
  'spacing/96': 96,
  /** Canvas only — gaps between frames in Figma, not used inside the app. */
  'spacing/120': 120,
} as const;

export type SpacingToken = keyof typeof spacing;
