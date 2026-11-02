/**
 * Shadows. Figma uses raw effect values (not variables): Login Method selected tab
 * = drop shadow 0 / 2 / blur 8, #171717 at 8%. Colour comes from the Neutral/Ink token.
 * Logged in docs/figma-issues.md (effect not tokenised).
 */
import { colors } from './colors';

export const elevation = {
  /** Login Method selected tab (141:4399). */
  tab: {
    shadowColor: colors['Neutral/Ink'],
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  /** Keypad key (281:8115) — raw 0 / 1 / 0, black 25% in Figma; Neutral/Ink 25% here (docs/figma-issues.md #29). */
  keypadKey: {
    shadowColor: colors['Neutral/Ink'],
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0,
    elevation: 1,
  },
} as const;
