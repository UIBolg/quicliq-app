/**
 * Quicliq colour tokens — generated from Figma library "Quicliq [Main]", collection "Colour".
 * Keys are the exact Figma variable names. This is the ONLY file allowed to contain hex values.
 * Source of truth: design/figma/tokens.json
 */
export const colors = {
  'Primary/Red': '#E01018',
  'Secondary/Grey': '#838383',

  'Neutral/Ink': '#171717',
  'Neutral/Slate': '#595959',
  'Neutral/Silver': '#BFBFBF',
  /** Quicliq [Kitchen] library update (read from New Designs 32:721): Fog lightened #F3F3F3 → #F5F7FA, Dark Fog added. */
  'Neutral/Fog': '#F5F7FA',
  'Neutral/Dark Fog': '#EBEFF5',
  'Neutral/White': '#FFFFFF',

  'Status/Success/Default': '#067647',
  'Status/Success/Dark': '#054F31',
  'Status/Success/Light': '#ECFDF3',
  'Status/Failure/Default': '#B42318',
  'Status/Failure/Dark': '#7A1A12',
  'Status/Failure/Light': '#FEF3F2',

  // Info set — code addition on the owner's request (Home verify banner); not in the Figma library yet,
  // docs/figma-issues.md #49. Designer to add or replace.
  'Status/Info/Default': '#1D5BBF',
  'Status/Info/Dark': '#123A7A',
  'Status/Info/Light': '#EAF2FD',
  'Status/Warning/Default': '#B54708',
  'Status/Warning/Dark': '#7A2E0E',
  'Status/Warning/Light': '#FFFAEB',

  'Brand/Logo Red': '#EA2328',
  'System/Keyboard': '#D6D7DC',
  'Flag/UK Blue': '#012169',
  'Flag/UK Red': '#C8102E',

  'Illustration/Skin Light': '#F2C9A5',
  'Illustration/Skin Light Shade': '#E0B089',
  'Illustration/Skin Medium': '#C68B5E',
  'Illustration/Skin Medium Shade': '#AD7449',
  'Illustration/Skin Deep': '#8A5A3B',
  'Illustration/Red Shade': '#B80D14',

  'Alpha/Red 4%': '#E010180A',
  'Alpha/Red 6%': '#E010180F',
  'Alpha/Red 7%': '#E0101812',
  'Alpha/Red 8%': '#E0101814',
  'Alpha/Red 10%': '#E010181A',
  'Alpha/Red 12%': '#E010181F',
  'Alpha/Red 25%': '#E0101840',
  'Alpha/Ink 6%': '#1717170F',
  'Alpha/Ink 10%': '#1717171A',
  'Alpha/Ink 25%': '#17171740',
  'Alpha/Ink 50%': '#17171780',
  'Alpha/White 0%': '#FFFFFF00',
  'Alpha/White 14%': '#FFFFFF24',
  'Alpha/White 16%': '#FFFFFF29',
  'Alpha/White 18%': '#FFFFFF2E',
  'Alpha/White 20%': '#FFFFFF33',
  'Alpha/White 25%': '#FFFFFF40',
  'Alpha/White 30%': '#FFFFFF4D',
  'Alpha/White 35%': '#FFFFFF59',
  'Alpha/White 40%': '#FFFFFF66',
  'Alpha/White 45%': '#FFFFFF73',
  'Alpha/White 50%': '#FFFFFF80',
  'Alpha/White 60%': '#FFFFFF99',
  'Alpha/White 70%': '#FFFFFFB2',
  'Alpha/White 75%': '#FFFFFFBF',
  'Alpha/White 80%': '#FFFFFFCC',
  'Alpha/White 85%': '#FFFFFFD9',
  'Alpha/Dark 35%': '#7A1A1259',

  // Reserved for a future dark theme — not used in the current flows.
  'Dark/Background': '#0C0B0E',
  'Dark/Surface': '#17161B',
  'Dark/Elevated': '#211F26',
  'Dark/Border': '#322F38',
  'Dark/Text Primary': '#F6F5F7',
  'Dark/Text Secondary': '#A7A4AE',
  'Dark/Text Tertiary': '#6F6C78',
  'Dark/Red Glow': '#FF4D55',
  'Dark/Success': '#3DD68C',
  'Dark/Success Surface': '#0F2A1D',
  'Dark/Error': '#FF6B66',
  'Dark/Error Surface': '#2C1315',
} as const;

export type ColorToken = keyof typeof colors;
