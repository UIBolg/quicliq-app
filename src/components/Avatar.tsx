/**
 * Avatar — Figma local component 280:8449 (Size=56): Primary/Red circle, white initials in H3.
 * Size 44 is not in Figma (added on request) — it uses Title so the initials fit.
 * Tones (code additions, Home): `tint` Alpha/Red 10% + Primary/Red initials · `success` Status/Success/Light +
 * Status/Success/Default · `ink` Neutral/Ink + White.
 * AR screens (e.g. AR/7.0 139:3922) keep Latin initials in the EN style; the avatar sits on the start side.
 */
import { View } from 'react-native';
import { Text } from 'react-native';
import { getTextStyle, useTheme, type AvatarSize, type ColorToken } from '../theme';

export type AvatarTone = 'brand' | 'tint' | 'success' | 'ink';

const tones: Record<AvatarTone, { bg: ColorToken; fg: ColorToken }> = {
  brand: { bg: 'Primary/Red', fg: 'Neutral/White' },
  tint: { bg: 'Alpha/Red 10%', fg: 'Primary/Red' },
  success: { bg: 'Status/Success/Light', fg: 'Status/Success/Default' },
  ink: { bg: 'Neutral/Ink', fg: 'Neutral/White' },
};

export type AvatarProps = {
  initials: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  /** Full name for screen readers. */
  accessibilityLabel?: string;
};

export function Avatar({ initials, size = 56, tone = 'brand', accessibilityLabel }: AvatarProps) {
  const t = useTheme();
  const d = t.sizes.avatar[size];
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? initials}
      style={{
        width: d,
        height: d,
        borderRadius: t.radius['radius/full'],
        backgroundColor: t.colors[tones[tone].bg],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Initials are Latin letters; keep their order in RTL.
        direction: 'ltr',
      }}
    >
      {/* Latin initials always use the EN text style, as in the Figma AR screens. */}
      <Text style={[getTextStyle(size === 56 ? 'H3' : 'Title', 'en'), { color: t.colors[tones[tone].fg] }]}>{initials}</Text>
    </View>
  );
}
