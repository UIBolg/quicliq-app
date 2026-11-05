/**
 * Layout rules from the Figma flows. All values reference tokens; nothing new is invented here.
 */
import { spacing } from './spacing';

export const layout = {
  /** Base design frame (iPhone 14). Used for reference/scaling only; screens are fluid. */
  frame: { width: 390, height: 844 },
  /** Left/right screen padding. */
  screenGutter: spacing['spacing/16'],
  /** Footer bottom padding above the home indicator. */
  footerBottom: spacing['spacing/32'],
  /** Minimum tappable size (44×44). */
  minTouchTarget: 44,
} as const;
