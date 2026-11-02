/**
 * Font faces used by the Figma text styles.
 * English = Avenir, Arabic = Frutiger LT Arabic (licensed fonts — drop the files into assets/fonts).
 *
 * Each Figma font style maps to one registered face name (React Native needs one family per file
 * on Android, so we never rely on fontWeight to pick a cut).
 * `scripts/register-fonts.js` scans assets/fonts and generates fontFiles.generated.ts.
 * Any face whose file is missing falls back to the system font at the matching weight.
 */
import { fontFiles } from './fontFiles.generated';

export const fontFamilies = {
  en: 'Avenir',
  ar: 'Frutiger LT Arabic',
} as const;

export const fontFaces = {
  // Avenir
  'Avenir-Roman': { family: 'en', figmaStyle: 'Roman', weight: '400' },
  'Avenir-Medium': { family: 'en', figmaStyle: 'Medium', weight: '500' },
  'Avenir-Heavy': { family: 'en', figmaStyle: 'Heavy', weight: '900' },
  'Avenir-Black': { family: 'en', figmaStyle: 'Black', weight: '800' },
  // Frutiger LT Arabic
  'FrutigerLTArabic-45Light': { family: 'ar', figmaStyle: '45 Light', weight: '300' },
  'FrutigerLTArabic-55Roman': { family: 'ar', figmaStyle: '55 Roman', weight: '400' },
  'FrutigerLTArabic-65Bold': { family: 'ar', figmaStyle: '65 Bold', weight: '700' },
  'FrutigerLTArabic-75Black': { family: 'ar', figmaStyle: '75 Black', weight: '800' },
} as const;

export type FontFace = keyof typeof fontFaces;

/** Font files to pass to expo-font's useFonts(). Only contains faces whose file exists. */
export const fontAssets = fontFiles;

export function isFaceBundled(face: FontFace): boolean {
  return face in fontFiles;
}
