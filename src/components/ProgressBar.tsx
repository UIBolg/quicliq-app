/**
 * Progress bar — code addition (Home proposal; Step Header 21:455 has its own segmented bar).
 * Track + fill, radius/full. Sizes from `sizes.progress`: sm 4, md 8. At 0 the fill shows an 8-wide stub so the bar
 * reads as "not started" rather than empty. Fill grows from the reading start (right in Arabic).
 *  tone default — Neutral/White track (on Fog surfaces), Primary/Red fill
 *  tone onBrand — Alpha/White 25% track (on Primary/Red surfaces), Neutral/White fill
 */
import { View } from 'react-native';
import { useTheme, type ColorToken } from '../theme';

const tones: Record<'default' | 'onBrand', { track: ColorToken; fill: ColorToken }> = {
  default: { track: 'Neutral/White', fill: 'Primary/Red' },
  onBrand: { track: 'Alpha/White 25%', fill: 'Neutral/White' },
};

export type ProgressBarProps = {
  value: number;
  max: number;
  /** Spoken description, e.g. "£100 of £800 used". */
  accessibilityLabel: string;
  size?: 'sm' | 'md';
  tone?: keyof typeof tones;
};

export function ProgressBar({ value, max, accessibilityLabel, size = 'md', tone = 'default' }: ProgressBarProps) {
  const t = useTheme();
  const c = tones[tone];
  const fraction = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max, now: value }}
      style={{ height: t.sizes.progress[size], borderRadius: t.radius['radius/full'], backgroundColor: t.colors[c.track], overflow: 'hidden' }}
    >
      <View
        style={{
          height: '100%',
          width: fraction > 0 ? `${fraction * 100}%` : t.sizes.progress.minFill,
          borderRadius: t.radius['radius/full'],
          backgroundColor: t.colors[c.fill],
        }}
      />
    </View>
  );
}
