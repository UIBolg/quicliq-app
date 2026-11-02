/**
 * Icon Badge — Figma 280:6935. Circle (radius/full) with a centred icon.
 * Sizes 20/32/40/44/56/72 → icon 12/16/20/20/28/32.
 * Tones: White (Neutral/White, Ink icon), Red tint (Alpha/Red 10%, red icon),
 * Success (Status/Success/Default, white icon), Grey (Neutral/Fog, Slate icon).
 */
import { View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { useTheme, type ColorToken, type IconBadgeSize } from '../theme';

export type IconBadgeTone = 'white' | 'redTint' | 'success' | 'grey';

const tones: Record<IconBadgeTone, { bg: ColorToken; fg: ColorToken }> = {
  white: { bg: 'Neutral/White', fg: 'Neutral/Ink' },
  redTint: { bg: 'Alpha/Red 10%', fg: 'Primary/Red' },
  success: { bg: 'Status/Success/Default', fg: 'Neutral/White' },
  grey: { bg: 'Neutral/Fog', fg: 'Neutral/Slate' },
};

export type IconBadgeProps = {
  icon: IconName;
  size?: IconBadgeSize;
  tone?: IconBadgeTone;
  /** Decorative by default; pass a label when the badge conveys meaning on its own. */
  accessibilityLabel?: string;
};

export function IconBadge({ icon, size = 40, tone = 'white', accessibilityLabel }: IconBadgeProps) {
  const t = useTheme();
  const c = tones[tone];
  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={{
        width: size,
        height: size,
        borderRadius: t.radius['radius/full'],
        backgroundColor: t.colors[c.bg],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Icon name={icon} size={t.sizes.iconBadge[size]} color={c.fg} />
    </View>
  );
}
