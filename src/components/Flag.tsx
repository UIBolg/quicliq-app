/**
 * Flag/UK (81:9), Flag/JO (117:1567) — 24 circle with an Alpha/Ink 10% hairline (stroke/xs).
 * Never mirrored. Renders the exported SVG; shows a placeholder until it is exported.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { flagXml } from '../assets/flags.generated';
import { useTheme } from '../theme';

/** Flags whose Figma artwork already contains the Alpha/Ink 10% hairline (docs/figma-issues.md #17). */
const HAIRLINE_IN_ARTWORK: ReadonlySet<string> = new Set(['UK']);

export function Flag({ country = 'UK' }: { country?: 'UK' | 'JO' }) {
  const t = useTheme();
  const d = t.sizes.flag;
  const xml = flagXml[country];
  return (
    <View
      accessible={false}
      style={{
        width: d,
        height: d,
        borderRadius: t.radius['radius/full'],
        borderWidth: xml && HAIRLINE_IN_ARTWORK.has(country) ? 0 : t.stroke['stroke/xs'],
        borderColor: t.colors['Alpha/Ink 10%'],
        borderStyle: xml ? 'solid' : 'dashed',
        backgroundColor: xml ? undefined : t.colors['Flag/UK Blue'],
        overflow: 'hidden',
        direction: 'ltr',
      }}
    >
      {xml ? <SvgXml xml={xml} width={d} height={d} /> : null}
    </View>
  );
}
