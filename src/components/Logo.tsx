/**
 * Logo — Figma 32:256 (Tone=Brand | White), artwork 326×108, scales proportionally.
 * Never mirrored in RTL. Renders the exported SVG from assets/logo/; until it is exported
 * a labelled placeholder with the same box is shown.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { logoXml } from '../assets/logo.generated';
import { useTheme } from '../theme';

export type LogoProps = {
  tone?: 'brand' | 'white';
  /** Rendered height; width follows the artwork aspect ratio. */
  height?: number;
};

export function Logo({ tone = 'brand', height }: LogoProps) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const h = height ?? t.sizes.logo.full;
  const w = h * t.sizes.logo.aspectRatio;
  const xml = logoXml[tone];
  const color = tone === 'brand' ? 'Brand/Logo Red' : 'Neutral/White';
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={tr('common.logo')}
      // The wordmark is never mirrored.
      style={{ width: w, height: h, direction: 'ltr' }}
    >
      {xml ? (
        <SvgXml xml={xml} width={w} height={h} />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: t.stroke['stroke/xs'],
            borderStyle: 'dashed',
            borderColor: t.colors[color],
            borderRadius: t.radius['radius/sm'],
          }}
        >
          <AppText variant="Caption" color={color}>Logo</AppText>
        </View>
      )}
    </View>
  );
}
