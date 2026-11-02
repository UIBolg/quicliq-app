/**
 * Action Banner — code addition (Home "Verify your ID and address", from the product owner's design; no Figma
 * component yet, docs/figma-issues.md #35). Tappable card: Neutral/White, Alpha/Ink 10% hairline (stroke/xs),
 * radius/lg, padding spacing/16, gap spacing/12. 24 icon in Primary/Red at the start · title (Body Medium, Ink) over
 * subtitle (Caption, Slate) · chevronRight at the end (mirrored in RTL). Pressed = Alpha/Ink 6% overlay.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useFocusRing } from './usePressState';
import { useTheme } from '../theme';

export type ActionBannerProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  testID?: string;
};

export function ActionBanner({ icon, title, subtitle, onPress, testID }: ActionBannerProps) {
  const t = useTheme();
  const { focused, focusProps } = useFocusRing();
  const r = t.radius['radius/lg'];
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      {...focusProps}
      style={[
        styles.row,
        {
          gap: t.spacing['spacing/12'],
          padding: t.spacing['spacing/16'],
          borderRadius: r,
          backgroundColor: t.colors['Neutral/White'],
          borderWidth: t.stroke['stroke/xs'],
          borderColor: t.colors['Alpha/Ink 10%'],
          minHeight: t.sizes.touchTarget,
        },
        focused && { outlineColor: t.colors[t.states.focusRing.color], outlineWidth: t.stroke[t.states.focusRing.width], outlineStyle: 'solid', outlineOffset: t.spacing['spacing/2'] },
      ]}
    >
      {({ pressed }) => (
        <>
          <Icon name={icon} size={t.sizes.icon.default} color="Primary/Red" />
          <View style={styles.flex}>
            <AppText variant="Body Medium" numberOfLines={2}>{title}</AppText>
            {subtitle ? <AppText variant="Caption" color="Neutral/Slate">{subtitle}</AppText> : null}
          </View>
          <Icon name="chevronRight" size={t.sizes.icon.md} color="Neutral/Ink" />
          {pressed ? (
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: t.colors['Alpha/Ink 6%'] }]} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }, flex: { flex: 1 } });
