/**
 * Checkbox — Figma 21:460. 24 box, radius/xs. Off: Neutral/White + Neutral/Silver outline (stroke/md).
 * On: Primary/Red fill + white 16 check. Touch area extended to 44.
 */
import { Pressable } from 'react-native';
import { Icon } from './Icon';
import { useFocusRing } from './usePressState';
import { useTheme } from '../theme';

export type CheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
};

export function Checkbox({ checked, onChange, accessibilityLabel, disabled }: CheckboxProps) {
  const t = useTheme();
  const { focused, focusProps } = useFocusRing();
  const d = t.sizes.checkbox.size;
  return (
    <Pressable
      onPress={() => onChange?.(!checked)}
      disabled={disabled}
      hitSlop={(t.sizes.touchTarget - d) / 2}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked, disabled }}
      {...focusProps}
      style={({ pressed }) => [
        {
          width: d,
          height: d,
          borderRadius: t.radius['radius/xs'],
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors[checked ? 'Primary/Red' : pressed ? t.states.pressedOverlay : 'Neutral/White'],
          borderWidth: checked ? 0 : t.stroke['stroke/md'],
          borderColor: t.colors[disabled ? 'Alpha/Ink 10%' : 'Neutral/Silver'],
        },
        focused && { outlineColor: t.colors['Neutral/Ink'], outlineWidth: t.stroke['stroke/md'], outlineStyle: 'solid', outlineOffset: t.spacing['spacing/2'] },
      ]}
    >
      {checked ? <Icon name="check" size={t.sizes.checkbox.icon} color="Neutral/White" mirror={false} /> : null}
    </Pressable>
  );
}
