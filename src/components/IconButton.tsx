/** Icon Button — Figma 217:7015. 40 circle, Neutral/Fog, radius/full, 24 icon. Touch area extended to 44. */
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { useFocusRing } from './usePressState';
import { useTheme } from '../theme';

export type IconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

export function IconButton({ icon, accessibilityLabel, onPress, disabled, testID }: IconButtonProps) {
  const t = useTheme();
  const { focused, focusProps } = useFocusRing();
  const d = t.sizes.iconButton.size;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      hitSlop={(t.sizes.touchTarget - d) / 2}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      {...focusProps}
      style={[
        styles.base,
        { width: d, height: d, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Neutral/Fog'] },
        focused && { outlineColor: t.colors['Neutral/Ink'], outlineWidth: t.stroke['stroke/md'], outlineStyle: 'solid' },
      ]}
    >
      {({ pressed }) => (
        <>
          <Icon name={icon} size={t.sizes.iconButton.icon} color={disabled ? 'Neutral/Silver' : 'Neutral/Ink'} />
          {pressed ? (
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: t.radius['radius/full'], backgroundColor: t.colors[t.states.pressedOverlay] }]} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({ base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } });
