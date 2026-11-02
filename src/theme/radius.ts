/**
 * Corner radius tokens (Figma collection "Radius", exact names radius/*).
 * Usage: large buttons, banners, OTP boxes = radius/md; option cards + country prefix = radius/lg;
 * small buttons, chips, tags, avatars, icon badges = radius/full; checkbox = radius/xs.
 */
export const radius = {
  'radius/none': 0,
  'radius/2xs': 2,
  'radius/xs': 4,
  'radius/sm': 8,
  'radius/md': 12,
  'radius/lg': 16,
  'radius/xl': 24,
  'radius/2xl': 32,
  'radius/3xl': 40,
  'radius/full': 999,
} as const;

export type RadiusToken = keyof typeof radius;
