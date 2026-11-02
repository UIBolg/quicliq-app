/**
 * Recipient tile — code addition (Home proposal): Avatar 56 (tint) + short name (Caption, one line, centred).
 * Fixed width from `sizes.recipientTile`. Pressed = avatar dims to Alpha/Ink 6% overlay. Spoken as "<action>: <full name>".
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Avatar } from './Avatar';
import { useTheme } from '../theme';

export function RecipientTile({ initials, shortName, fullName, actionLabel, onPress }: {
  initials: string;
  shortName: string;
  fullName: string;
  actionLabel: string;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${actionLabel}: ${fullName}`}
      style={{ width: t.sizes.recipientTile.width, alignItems: 'center', gap: t.spacing['spacing/8'] }}
    >
      {({ pressed }) => (
        <>
          <View>
            <Avatar initials={initials} size={56} tone="tint" />
            {pressed ? (
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/Ink 6%'] }]} />
            ) : null}
          </View>
          <AppText variant="Caption" numberOfLines={1} style={{ textAlign: 'center', alignSelf: 'stretch' }}>{shortName}</AppText>
        </>
      )}
    </Pressable>
  );
}
