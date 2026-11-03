/**
 * Limit Card — code addition (Home option B2 on the "Quicliq Home options" canvas; no Figma component yet,
 * docs/figma-issues.md #37). Primary/Red, radius/xl, padding spacing/16 + spacing/4 (20), fixed height
 * `sizes.limitCard.height`, content spread top/bottom:
 *   label (Body, White 80%) + optional level link pill (Caption White on Alpha/White 20%, radius/full, chevronRight 12) ·
 *   amount (Numeric L in the EN style, White) ·
 *   ProgressBar sm onBrand (`sizes.limitCard.progressWidth`) · caption (Caption, White 80%).
 * Level looks (chosen on the "Quicliq Home options" canvas, board "Limit levels · Simple"):
 *  1 Basic   — Alpha/Red 8% + Alpha/Red 12% border, Ink/Slate text, red art, Alpha/Red 12% tag, onTint bar.
 *  2 Plus    — Primary/Red, white text and art (the original card).
 *  3 Premium — Status/Failure/Dark (burgundy; no burgundy token yet, docs/figma-issues.md #48), white text and art,
 *              Alpha/Red 25% glow, solid Primary/Red tag, no progress bar.
 * `levelName` shows as a tag next to the label.
 * With `onPress` the whole card is a button (opens the sending-limit sheet); pressed = Alpha/Ink 10% overlay.
 * Artwork (src/assets/artwork/limitCard.ts) sits behind the content at the end side, clipped by the card; mirrored in RTL except the £ glyph.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';
import { limitCardArt, limitCardArtXml } from '../assets/artwork/limitCard';
import { getTextStyle, useTheme, type ColorToken } from '../theme';

export type LimitCardLevel = 1 | 2 | 3;

const looks: Record<LimitCardLevel, {
  bg: ColorToken; border?: ColorToken; text: ColorToken; sub: ColorToken; tag: ColorToken; tagText: ColorToken;
  glow: ColorToken; trail: ColorToken; coin: ColorToken; coinText: ColorToken; plane: ColorToken; shade: ColorToken; bar: 'onTint' | 'onBrand';
}> = {
  1: { bg: 'Alpha/Red 8%', border: 'Alpha/Red 12%', text: 'Neutral/Ink', sub: 'Neutral/Slate', tag: 'Alpha/Red 12%', tagText: 'Primary/Red', glow: 'Alpha/Red 8%', trail: 'Alpha/Red 25%', coin: 'Primary/Red', coinText: 'Neutral/White', plane: 'Primary/Red', shade: 'Illustration/Red Shade', bar: 'onTint' },
  2: { bg: 'Primary/Red', text: 'Neutral/White', sub: 'Alpha/White 80%', tag: 'Alpha/White 20%', tagText: 'Neutral/White', glow: 'Alpha/White 14%', trail: 'Alpha/White 50%', coin: 'Neutral/White', coinText: 'Primary/Red', plane: 'Neutral/White', shade: 'Alpha/White 70%', bar: 'onBrand' },
  3: { bg: 'Status/Failure/Dark', text: 'Neutral/White', sub: 'Alpha/White 80%', tag: 'Primary/Red', tagText: 'Neutral/White', glow: 'Alpha/Red 25%', trail: 'Alpha/White 50%', coin: 'Neutral/White', coinText: 'Status/Failure/Dark', plane: 'Neutral/White', shade: 'Alpha/White 70%', bar: 'onBrand' },
};

export type LimitCardProps = {
  label: string;
  amount: string;
  caption: string;
  value: number;
  max: number;
  /** Spoken description of the bar, e.g. "£100 of £800 used". */
  progressLabel: string;
  /** Small pill next to the label, e.g. "Level 1 of 3". */
  linkLabel?: string;
  /** Colour scheme by sending-limit level (default 2, the red card). */
  level?: LimitCardLevel;
  /** Level tag next to the label, e.g. "Basic". */
  levelName?: string;
  /** Hide the progress bar (level 3 has no cap). */
  hideProgress?: boolean;
  onPress?: () => void;
  testID?: string;
};

export function LimitCard({ label, amount, caption, value, max, progressLabel, linkLabel, level = 2, levelName, hideProgress, onPress, testID }: LimitCardProps) {
  const t = useTheme();
  const s = t.sizes.limitCard;
  const amountFace = getTextStyle('Numeric L', 'en');
  const c = looks[level];
  const xml = limitCardArtXml(
    {
      glow: t.colors[c.glow],
      trail: t.colors[c.trail],
      plane: t.colors[c.plane],
      planeShade: t.colors[c.shade],
      coin: t.colors[c.coin],
      coinText: t.colors[c.coinText],
    },
    amountFace.fontFamily ?? 'sans-serif',
    t.isRTL,
  );

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[levelName, `${label} ${amount}, ${caption}`, linkLabel].filter(Boolean).join('. ')}
      style={{
        height: s.height,
        borderRadius: t.radius['radius/xl'],
        backgroundColor: t.colors[c.bg],
        borderWidth: c.border ? t.stroke['stroke/xs'] : 0,
        borderColor: c.border ? t.colors[c.border] : undefined,
        padding: t.spacing['spacing/16'] + t.spacing['spacing/4'],
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {({ pressed }) => (
        <>
          <View
            pointerEvents="none"
            // End side from the locale (RN-web ignores `end` on absolutely positioned views).
            style={{ position: 'absolute', [t.isRTL ? 'left' : 'right']: s.artInsetEnd, top: s.artInsetTop, width: limitCardArt.width, height: limitCardArt.height, direction: 'ltr' }}
          >
            <SvgXml xml={xml} width={limitCardArt.width} height={limitCardArt.height} />
          </View>
          <View style={{ gap: t.spacing['spacing/2'] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
              <AppText variant="Body" color={c.sub}>{label}</AppText>
              {levelName ? (
                <View style={{ paddingHorizontal: t.spacing['spacing/8'], paddingVertical: t.spacing['spacing/2'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors[c.tag] }}>
                  <AppText variant="Caption" color={c.tagText}>{levelName}</AppText>
                </View>
              ) : null}
              {linkLabel ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: t.spacing['spacing/2'],
                    paddingStart: t.spacing['spacing/8'],
                    paddingEnd: t.spacing['spacing/6'],
                    paddingVertical: t.spacing['spacing/2'],
                    borderRadius: t.radius['radius/full'],
                    backgroundColor: t.colors['Alpha/White 20%'],
                  }}
                >
                  <AppText variant="Caption" color="Neutral/White">{linkLabel}</AppText>
                  <Icon name="chevronRight" size={t.sizes.icon.xxs} color="Neutral/White" />
                </View>
              ) : null}
            </View>
            <AppText variant="Numeric L" color={c.text} style={[amountFace, { color: t.colors[c.text], textAlign: t.isRTL ? 'right' : 'left' }]}>
              {amount}
            </AppText>
          </View>
          <View style={{ width: s.progressWidth, gap: t.spacing['spacing/6'] }}>
            {hideProgress ? null : <ProgressBar value={value} max={max} size="sm" tone={c.bar} accessibilityLabel={progressLabel} />}
            <AppText variant="Caption" color={c.sub}>{caption}</AppText>
          </View>
          {pressed ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.colors[t.states.pressedOverlay] }]} /> : null}
        </>
      )}
    </Pressable>
  );
}
