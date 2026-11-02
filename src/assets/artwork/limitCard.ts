/**
 * Limit card artwork (code addition, Home — approved on the "Quicliq Home options" canvas, option B2; no Figma
 * illustration yet, docs/figma-issues.md #37). A paper plane flying from a £ coin along a dashed path, over two soft
 * circles. Geometry is artwork (like the exported icon SVGs); every colour is passed in from theme tokens.
 * In RTL the shapes are mirrored (the plane flies toward the reading end, like the send icon); the £ glyph is not.
 */
export type LimitCardArtColors = { glow: string; trail: string; plane: string; planeShade: string; coin: string; coinText: string };

export const limitCardArt = { width: 190, height: 150 } as const;

export const limitCardArtXml = (c: LimitCardArtColors, fontFamily: string, mirrored = false) => `
<svg width="190" height="150" viewBox="0 0 190 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g${mirrored ? ' transform="translate(190 0) scale(-1 1)"' : ''}>
  <circle cx="140" cy="40" r="70" fill="${c.glow}"/>
  <circle cx="160" cy="120" r="34" fill="${c.glow}"/>
  <path d="M44 118 C 70 120, 92 104, 104 84 S 128 52, 150 46" stroke="${c.trail}" stroke-width="2" stroke-dasharray="4 6" stroke-linecap="round"/>
  <circle cx="40" cy="118" r="14" fill="${c.coin}"/>
  <g transform="translate(146 26) rotate(12)">
    <path d="M0 18 L36 0 L26 34 L17 24 Z" fill="${c.plane}"/>
    <path d="M17 24 L36 0 L13 21 L12 32 Z" fill="${c.planeShade}"/>
  </g>
  <circle cx="104" cy="84" r="3" fill="${c.plane}"/>
  </g>
  <text x="${mirrored ? 150 : 40}" y="123.5" text-anchor="middle" font-family="${fontFamily}" font-size="15" font-weight="900" fill="${c.coinText}">£</text>
</svg>`;
