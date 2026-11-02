/**
 * Recipient tile — code addition (Home proposal): Avatar 56 (`tone`, default tint) + short name (Caption, one line, centred).
 * Fixed `sizes.recipientTile` width (the Home row scrolls sideways). Pressed = avatar dims to Alpha/Ink 6% overlay. Spoken as "<action>: <full name>".
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Icon } from './Icon';
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
      style={{ width: t.sizes.recipientTile.width, alignItems: 'center', gap: t.spacing['spacing/8'] }}
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

/** "Add new" tile — first in the Recent recipients row: 56 circle with a dashed Neutral/Silver outline (stroke/md) and a
 * 24 plus in Primary/Red, Caption label. Pressed = Alpha/Ink 6% fill. */
export function AddRecipientTile({ label, onPress }: { label: string; onPress: () => void }) {
  const t = useTheme();
  const d = t.sizes.avatar[56];
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} testID="add-recipient" style={{ width: t.sizes.recipientTile.width, alignItems: 'center', gap: t.spacing['spacing/8'] }}>
      {({ pressed }) => (
        <>
          <View style={{ width: d, height: d, borderRadius: t.radius['radius/full'], borderWidth: t.stroke['stroke/md'], borderStyle: 'dashed', borderColor: t.colors['Neutral/Silver'], backgroundColor: pressed ? t.colors['Alpha/Ink 6%'] : undefined, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" color="Primary/Red" />
          </View>
          <AppText variant="Caption" numberOfLines={1} style={{ textAlign: 'center', alignSelf: 'stretch' }}>{label}</AppText>
        </>
      )}
    </Pressable>
  );
}
