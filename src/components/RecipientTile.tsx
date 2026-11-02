/**
 * Recipient tile — code addition (Home proposal): Avatar 56 (`tone`, default tint) + short name (Caption, one line, centred).
 * Shares its row equally, up to `sizes.recipientTile` wide (5 tiles fit the 342 content width). Pressed = avatar dims to Alpha/Ink 6% overlay. Spoken as "<action>: <full name>".
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Avatar, type AvatarTone } from './Avatar';
import { useTheme } from '../theme';

export function RecipientTile({ initials, shortName, fullName, actionLabel, onPress, tone = 'tint' }: {
  initials: string;
  tone?: AvatarTone;
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
      style={{ flex: 1, maxWidth: t.sizes.recipientTile.width, alignItems: 'center', gap: t.spacing['spacing/8'] }}
    >
      {({ pressed }) => (
        <>
          <View>
            <Avatar initials={initials} size={56} tone={tone} />
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
