/**
 * Switch — code addition (12.5 Security, Face ID; no Figma component yet, docs/figma-issues.md #42).
 * Track `sizes.switch` (51×31), radius/full: On = Primary/Red, Off = Neutral/Silver; Neutral/White knob (27) slides to
 * the end when on (mirrored in RTL). Decorative inside a List Row (the row is the control); standalone it is its own
 * switch with ≥44 touch area.
 */
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme';

export function Switch({ value, onValueChange, accessibilityLabel }: { value: boolean; onValueChange?: (v: boolean) => void; accessibilityLabel?: string }) {
  const t = useTheme();
  const s = t.sizes.switch;
  const inset = (s.height - s.knob) / 2;
  const track = (
    <View
      style={{
        width: s.width,
        height: s.height,
        borderRadius: t.radius['radius/full'],
        backgroundColor: t.colors[value ? 'Primary/Red' : 'Neutral/Silver'],
        padding: inset,
        alignItems: value ? 'flex-end' : 'flex-start',
      }}
    >
      <View style={{ width: s.knob, height: s.knob, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Neutral/White'], ...t.elevation.tab }} />
    </View>
  );
  if (!onValueChange) return <View accessible={false} importantForAccessibility="no-hide-descendants">{track}</View>;
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={(t.sizes.touchTarget - s.height) / 2}
    >
      {track}
    </Pressable>
  );
}
