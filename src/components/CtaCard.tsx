/**
 * CTA card — code addition (Home "Send money", from the owner's design; no Figma component yet, docs/figma-issues.md #44).
 * Primary/Red, radius/lg, padding spacing/16 · spacing/20, gap spacing/16, ≥56 high:
 * 28 icon (Neutral/White) · title (Title, White) over subtitle (Caption, White 80%) · chevronRight 20 White (mirrored in RTL).
 * Pressed = Alpha/Ink 25% overlay.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useTheme } from '../theme';

export function CtaCard({ icon, title, subtitle, onPress, testID }: { icon: IconName; title: string; subtitle?: string; onPress: () => void; testID?: string }) {
  const t = useTheme();
  const r = t.radius['radius/lg'];
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'], paddingVertical: t.spacing['spacing/16'], paddingHorizontal: t.spacing['spacing/16'] + t.spacing['spacing/4'], borderRadius: r, backgroundColor: t.colors['Primary/Red'], minHeight: t.sizes.button.largeHeight, overflow: 'hidden' }}
    >
      {({ pressed }) => (
        <>
          <Icon name={icon} size={t.sizes.cta.icon} color="Neutral/White" />
          <View style={styles.flex}>
            <AppText variant="Title" color="Neutral/White">{title}</AppText>
            {subtitle ? <AppText variant="Caption" color="Alpha/White 80%">{subtitle}</AppText> : null}
          </View>
          <Icon name="chevronRight" size={t.sizes.icon.md} color="Neutral/White" />
          {pressed ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: t.colors[t.states.pressedOverlayOnDark] }]} /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
