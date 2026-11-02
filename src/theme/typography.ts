/**
 * Typography tokens — Figma text styles EN/* (Avenir) and AR/* (Frutiger LT Arabic).
 * Screens ask for a style name ("H1", "Body"…); the EN or AR variant is picked from the locale.
 * Never reuse an EN style for Arabic text: AR line-heights are taller and letter-spacing is 0.
 */
import type { TextStyle } from 'react-native';
import { fontFaces, isFaceBundled, type FontFace } from './fonts';

export type Locale = 'en' | 'ar';

type StyleSpec = {
  /** Exact Figma text-style name */
  figma: string;
  face: FontFace;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

const s = (figma: string, face: FontFace, fontSize: number, lineHeight: number, letterSpacing = 0): StyleSpec => ({
  figma,
  face,
  fontSize,
  lineHeight,
  letterSpacing,
});

export const textStyles = {
  Display: {
    en: s('EN/Display', 'Avenir-Black', 32, 40, -0.16),
    ar: s('AR/Display', 'FrutigerLTArabic-75Black', 32, 44),
  },
  H1: {
    en: s('EN/H1', 'Avenir-Heavy', 28, 36, -0.14),
    ar: s('AR/H1', 'FrutigerLTArabic-65Bold', 28, 40),
  },
  H2: {
    en: s('EN/H2', 'Avenir-Heavy', 24, 32),
    ar: s('AR/H2', 'FrutigerLTArabic-65Bold', 24, 36),
  },
  H3: {
    en: s('EN/H3', 'Avenir-Heavy', 20, 28),
    ar: s('AR/H3', 'FrutigerLTArabic-65Bold', 20, 32),
  },
  Title: {
    en: s('EN/Title', 'Avenir-Medium', 18, 26),
    ar: s('AR/Title', 'FrutigerLTArabic-65Bold', 18, 28),
  },
  'Body Large': {
    en: s('EN/Body Large', 'Avenir-Roman', 16, 24),
    ar: s('AR/Body Large', 'FrutigerLTArabic-55Roman', 16, 28),
  },
  Body: {
    en: s('EN/Body', 'Avenir-Roman', 14, 22),
    ar: s('AR/Body', 'FrutigerLTArabic-55Roman', 14, 24),
  },
  'Body Medium': {
    en: s('EN/Body Medium', 'Avenir-Medium', 14, 22),
    ar: s('AR/Body Medium', 'FrutigerLTArabic-65Bold', 14, 24),
  },
  Caption: {
    en: s('EN/Caption', 'Avenir-Roman', 12, 18),
    ar: s('AR/Caption', 'FrutigerLTArabic-45Light', 12, 20),
  },
  Overline: {
    en: s('EN/Overline', 'Avenir-Medium', 10, 14, 0.4),
    ar: s('AR/Overline', 'FrutigerLTArabic-55Roman', 10, 16),
  },
  'Numeric L': {
    en: s('EN/Numeric L', 'Avenir-Black', 44, 48, -0.88),
    ar: s('AR/Numeric L', 'FrutigerLTArabic-75Black', 44, 60),
  },
  'Numeric XL': {
    en: s('EN/Numeric XL', 'Avenir-Black', 96, 100, -1.92),
    ar: s('AR/Numeric XL', 'FrutigerLTArabic-75Black', 96, 120),
  },
  /** Status-bar mock only — Avenir in both languages. */
  'System/Status Bar': {
    en: s('System/Status Bar', 'Avenir-Heavy', 16, 20),
    ar: s('System/Status Bar', 'Avenir-Heavy', 16, 20),
  },
} as const;

export type TextStyleName = keyof typeof textStyles;

/** Resolve a text style for the active locale into a React Native TextStyle. */
export function getTextStyle(name: TextStyleName, locale: Locale): TextStyle {
  const spec = textStyles[name][locale];
  const bundled = isFaceBundled(spec.face);
  return {
    // When the licensed font file is missing we fall back to the system font at the same weight.
    fontFamily: bundled ? spec.face : undefined,
    fontWeight: bundled ? undefined : fontFaces[spec.face].weight,
    fontSize: spec.fontSize,
    lineHeight: spec.lineHeight,
    letterSpacing: spec.letterSpacing,
    writingDirection: locale === 'ar' ? 'rtl' : 'ltr',
  };
}
