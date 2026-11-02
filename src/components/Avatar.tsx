/**
 * Avatar — Figma local component 280:8449 (Size=56): Primary/Red circle, white initials in H3.
 * Size 44 is not in Figma (added on request) — it uses Title so the initials fit.
 */
import { View } from 'react-native';
import { AppText } from './AppText';
import { useTheme, type AvatarSize } from '../theme';

export type AvatarProps = {
  initials: string;
  size?: AvatarSize;
  /** Full name for screen readers. */
  accessibilityLabel?: string;
};

export function Avatar({ initials, size = 56, accessibilityLabel }: AvatarProps) {
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
        backgroundColor: t.colors['Primary/Red'],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Initials are Latin letters; keep their order in RTL.
        direction: 'ltr',
      }}
    >
      <AppText variant={size === 56 ? 'H3' : 'Title'} color="Neutral/White">
        {initials}
      </AppText>
    </View>
  );
}
