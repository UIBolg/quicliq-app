/**
 * Spot illustration — Figma "Icons & Illustrations" 79:389 (160 artboards), exported per node as SVG
 * (assets/illustrations). Never mirrored. Decorative: screens carry the meaning in their heading.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { illustrationXml } from '../assets/illustrations.generated';
import { useTheme } from '../theme';

export type IllustrationName = 'offline' | 'idCard';

export function Illustration({ name, size }: { name: IllustrationName; size?: number }) {
  const t = useTheme();
  const d = size ?? t.sizes.illustration.default;
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: d, height: d, direction: 'ltr' }}>
      <SvgXml xml={illustrationXml[name]} width={d} height={d} />
    </View>
  );
}
