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

  /** OTP Digit 280:8044 — 46×60 box; Focused caret 2×28. Code row separator 12×2 (220:6759). */
  otpDigit: { width: 46, height: 60, caretWidth: 2, caretHeight: 28 },
  codeSeparator: { width: 12, height: 2 },

  /** Resend Countdown 281:9668 — 20 countdown ring (stroke/2xl), 16 refresh icon. */
  resendCountdown: { ring: 20, icon: 16 },

  /** Error box (7.2d 220:6766 / 7.10 99:2845) — 18 alert icon; attempt bars 16×4. */
  codeError: { icon: 18, barWidth: 16, barHeight: 4 },

  /** Status Bar 12:58 / 12:69 — design mock, 47 high, 68×12 indicators. Device-frame preview only. */
  statusBar: { height: 47, indicatorsWidth: 68, indicatorsHeight: 12 },

  /** Back button in Step Header 21:455 / "Top" bars — 40 Fog circle, 20 arrowLeft. */
  backButton: { size: 40, icon: 20 },

  /** Keypad 281:8115 — iOS number pad mock (device-frame preview only): keys 46 high. */
  keypad: { keyHeight: 46 },

  /** Radio Option 282:9637 Icon=On — 40 white badge with a 20 icon. */
  radioOptionIcon: { badge: 40, icon: 20 },

  /** Banner 157:626 — 20 icon. */
  banner: { icon: 20 },

  /** Spot illustrations 79:389 — 160 artboards; 7.6 / 7.7 use them at 144. */
  illustration: { default: 160, small: 144 },

  /** Home (proposal) — setup progress bar 4 high with an 8-wide stub at 0 steps. */
  setupProgress: { height: 4, minFill: 8 },

  /** Password Rule 281:7369 — 20 indicator (Met = Icon Badge 20 Success). */
  passwordRule: { indicator: 20 },
} as const;

export type IconBadgeSize = keyof typeof sizes.iconBadge;
export type AvatarSize = keyof typeof sizes.avatar;
