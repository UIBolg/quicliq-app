/**
 * Filter chip — code addition (Transactions history filters; no Figma component yet, docs/figma-issues.md #45).
 * Pill, radius/full, `sizes.chip.height` high (touch area extended to 44), padding 0 spacing/16, Body Medium:
 * selected = Primary/Red fill + Neutral/White label · unselected = Neutral/Fog + Neutral/Ink. Pressed = Alpha/Ink 6% overlay.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme';

export function FilterChip({ label, selected, onPress, testID }: { label: string; selected: boolean; onPress: () => void; testID?: string }) {
  const t = useTheme();
  const h = t.sizes.chip.height;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      hitSlop={(t.sizes.touchTarget - h) / 2}
      style={{ height: h, justifyContent: 'center', paddingHorizontal: t.spacing['spacing/16'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors[selected ? 'Primary/Red' : 'Neutral/Fog'], overflow: 'hidden' }}
    >
      {({ pressed }) => (
        <>
          <AppText variant="Body Medium" color={selected ? 'Neutral/White' : 'Neutral/Ink'}>{label}</AppText>
          {pressed ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.colors['Alpha/Ink 6%'] }]} /> : null}
        </>
      )}
    </Pressable>
  );
}
