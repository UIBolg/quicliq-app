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
} as const;
