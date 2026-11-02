/**
 * Limit Card — code addition (Home option B2 on the "Quicliq Home options" canvas; no Figma component yet,
 * docs/figma-issues.md #37). Primary/Red, radius/xl, padding spacing/16 + spacing/4 (20), fixed height
 * `sizes.limitCard.height`, content spread top/bottom:
 *   label (Body, White 80%) · amount (Numeric L in the EN style, White) ·
 *   ProgressBar sm onBrand (`sizes.limitCard.progressWidth`) · caption (Caption, White 80%).
 * Artwork (src/assets/artwork/limitCard.ts) sits behind the content at the end side, clipped by the card; mirrored in RTL except the £ glyph.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { AppText } from './AppText';
import { ProgressBar } from './ProgressBar';
import { limitCardArt, limitCardArtXml } from '../assets/artwork/limitCard';
import { getTextStyle, useTheme } from '../theme';

export type LimitCardProps = {
  label: string;
  amount: string;
  caption: string;
  value: number;
  max: number;
  /** Spoken description of the bar, e.g. "£100 of £800 used". */
  progressLabel: string;
};

export function LimitCard({ label, amount, caption, value, max, progressLabel }: LimitCardProps) {
  const t = useTheme();
  const s = t.sizes.limitCard;
  const amountFace = getTextStyle('Numeric L', 'en');
  const xml = limitCardArtXml(
    {
      glow: t.colors['Alpha/White 14%'],
      trail: t.colors['Alpha/White 50%'],
      plane: t.colors['Neutral/White'],
      planeShade: t.colors['Alpha/White 70%'],
      coin: t.colors['Neutral/White'],
      coinText: t.colors['Primary/Red'],
    },
    amountFace.fontFamily ?? 'sans-serif',
    t.isRTL,
  );

  return (
    <View
      accessible
      accessibilityLabel={`${label} ${amount}, ${caption}`}
      style={{
        height: s.height,
        borderRadius: t.radius['radius/xl'],
        backgroundColor: t.colors['Primary/Red'],
        padding: t.spacing['spacing/16'] + t.spacing['spacing/4'],
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <View
        pointerEvents="none"
        // End side from the locale (RN-web ignores `end` on absolutely positioned views).
        style={{ position: 'absolute', [t.isRTL ? 'left' : 'right']: s.artInsetEnd, top: s.artInsetTop, width: limitCardArt.width, height: limitCardArt.height, direction: 'ltr' }}
      >
        <SvgXml xml={xml} width={limitCardArt.width} height={limitCardArt.height} />
      </View>
      <View style={{ gap: t.spacing['spacing/2'] }}>
        <AppText variant="Body" color="Alpha/White 80%">{label}</AppText>
        <AppText variant="Numeric L" color="Neutral/White" style={[amountFace, { color: t.colors['Neutral/White'], textAlign: t.isRTL ? 'right' : 'left' }]}>
          {amount}
        </AppText>
      </View>
      <View style={{ width: s.progressWidth, gap: t.spacing['spacing/6'] }}>
        <ProgressBar value={value} max={max} size="sm" tone="onBrand" accessibilityLabel={progressLabel} />
        <AppText variant="Caption" color="Alpha/White 80%">{caption}</AppText>
      </View>
    </View>
  );
}
