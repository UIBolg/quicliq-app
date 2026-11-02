/**
 * Stroke width tokens (Figma collection "Stroke", exact names stroke/*).
 * Borders/dividers = stroke/xs; focused field border = stroke/md; line icons = stroke/lg (1.75);
 * large illustration strokes = stroke/4xl and above.
 */
export const stroke = {
  'stroke/xs': 1,
  'stroke/sm': 1.25,
  'stroke/md': 1.5,
  'stroke/lg': 1.75,
  'stroke/xl': 2,
  'stroke/2xl': 2.5,
  'stroke/3xl': 3,
  'stroke/4xl': 4,
  'stroke/5xl': 5,
  'stroke/6xl': 7,
  'stroke/7xl': 8,
  'stroke/8xl': 11,
} as const;

export type StrokeToken = keyof typeof stroke;
