/**
 * Component dimensions read from the Figma component specs (Components page 12:2).
 * These are fixed component sizes in Figma, not variables — they live here so no component
 * contains a raw pixel number. Each entry names its Figma source.
 */
export const sizes = {
  /** Minimum tap target (build doc rule 6). */
  touchTarget: 44,

  icon: {
    /** Icons page 79:2 — 24px artboards, 1.75 stroke. */
    default: 24,
    md: 20,
    sm: 16,
    xs: 14,
    xxs: 12,
  },

  /** Button 12:16 */
  button: {
    largeHeight: 56,
    smallHeight: 32,
    largeIcon: 20,
    smallIcon: 16,
    spinner: 24,
  },

  /** Icon Button 217:7015 */
  iconButton: { size: 40, icon: 24 },

  /** Icon Badge 280:6935 — badge diameter → icon size */
  iconBadge: {
    20: 12,
    32: 16,
    40: 20,
    44: 20,
    56: 28,
    72: 32,
  },

  /** Avatar 280:8449 (Figma has 56 only; 44 added on request) */
  avatar: { 56: 56, 44: 44 },

  /** Logo 32:256 — artwork 326×108; used at 72.44×24 (onboarding top bar) and 144×47.7 (login). */
  logo: { aspectRatio: 326 / 108, header: 24, login: 47.7, full: 108 },

  /** Verified Tag 282:9835 — 14px check in an 18 (EN) / 20 (AR) line box. */
  verifiedTag: { icon: 14 },
} as const;

export type IconBadgeSize = keyof typeof sizes.iconBadge;
export type AvatarSize = keyof typeof sizes.avatar;
