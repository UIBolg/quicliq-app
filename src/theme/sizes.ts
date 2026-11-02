/**
 * Component dimensions read from the Figma component specs (Components page 12:2).
 * These are fixed component sizes in Figma, not variables — they live here so no component
 * contains a raw pixel number. Each entry names its Figma source.
 */
export const sizes = {
  /** Minimum tap target (build doc rule 6). */
  touchTarget: 44,

  icon: {
    /** Icons page 79:2 — 24px artboards (exported strokes are 1.5; see docs/figma-issues.md #16). */
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

  /** Text Field 21:388 — 64 high; trailing icons 20; lock 18; helper alert 14. */
  textField: { height: 64, icon: 20, lock: 18, helperIcon: 14 },

  /** Country Prefix 281:9863 — 112×64; flag 24; lock 14. */
  countryPrefix: { width: 112, flag: 24, lock: 14 },

  /** Flag/UK 81:9, Flag/JO 117:1567 — 24 circle. */
  flag: 24,

  /** Checkbox 21:460 — 24 box, 16 check. */
  checkbox: { size: 24, icon: 16 },

  /** Dev gallery only — width of one icon cell in the icon grid. */
  gallery: { iconCell: 80 },

  /** Pagination 12:57 — 8 dots, active dot 24 wide. */
  pagination: { dot: 8, active: 24 },

  /** Sheet Grabber 280:8504 — 40×4 handle. */
  sheetGrabber: { width: 40, height: 4 },

  /** Sheet Header 282:9973 — 32 close button with a 16 x icon. */
  sheetHeader: { close: 32, closeIcon: 16 },

  /** Radio Option 282:9637 — 22 radio; selected ring stroke/6xl, unselected stroke/md. */
  radioOption: { radio: 22 },

  /** Onboarding 202:6388 — illustration canvas 342×360 (scene artwork size). */
  onboarding: { sceneWidth: 342, sceneHeight: 360 },

  /** Splash AR/Splash 82:11716 — logo 200 wide, two decorative circles. */
  splash: {
    logoWidth: 200,
    decoLarge: { size: 420, top: -120, start: 150 },
    decoSmall: { size: 380, top: 560, start: -160 },
    spinner: 32,
  },

  /** Password Rule 281:7369 — 20 indicator (Met = Icon Badge 20 Success). */
  passwordRule: { indicator: 20 },
} as const;

export type IconBadgeSize = keyof typeof sizes.iconBadge;
export type AvatarSize = keyof typeof sizes.avatar;
