/**
 * Back button — the "Back" of Step Header 21:455 and the "Top" bars (7.2a–d, 7.7–7.8d): 40 Neutral/Fog circle,
 * 20 arrowLeft (mirrored in RTL). Touch area extended to 44.
 */
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon } from './Icon';
import { useTheme } from '../theme';

export function BackButton({ onPress, testID }: { onPress: () => void; testID?: string }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const d = t.sizes.backButton.size;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tr('common.back')}
      hitSlop={(t.sizes.touchTarget - d) / 2}
      style={({ pressed }) => ({
        width: d,
        height: d,
        borderRadius: t.radius['radius/full'],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.colors[pressed ? 'Neutral/Silver' : 'Neutral/Fog'],
      })}
    >
      <Icon name="arrowLeft" size={t.sizes.backButton.icon} />
    </Pressable>
  );
}
