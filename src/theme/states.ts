/**
 * Interaction states. Figma defines Default/Disabled/Loading (Button), Focused (Text Field: Ink outline,
 * stroke/md) but no pressed state — the pressed overlay below is a code-side addition built only from
 * existing tokens. Listed as a gap in docs/components.md.
 */
import type { ColorToken } from './colors';
import type { StrokeToken } from './stroke';

export const states = {
  /** Overlay drawn on top of a pressed control. */
  pressedOverlay: 'Alpha/Ink 10%' as ColorToken,
  /** Overlay on a pressed control that already has a dark/red fill. */
  pressedOverlayOnDark: 'Alpha/Ink 25%' as ColorToken,
  /** Keyboard / accessibility focus ring — matches Text Field Focused (Ink outline, stroke/md). */
  focusRing: { color: 'Neutral/Ink' as ColorToken, width: 'stroke/md' as StrokeToken },
  /** Motion durations (ms). Figma has no motion spec yet (docs/figma-issues.md #24); platform-like defaults. */
  motion: { sheet: 250, splashMin: 1200, mockRequest: 1200 },
} as const;
