/**
 * Action Banner — code addition (Home "Verify your ID and address" alert, option B2 on the "Quicliq Home options"
 * canvas; no Figma component yet, docs/figma-issues.md #35). A tappable alert in the Info colours (blue, owner's request; Banner 157:626 shape):
 * Status/Info/Light fill, radius/md, padding spacing/12, gap spacing/12, ≥44 high.
 * 20 icon in Status/Info/Default at the start · one Body text in Status/Info/Dark with the `title` part in
 * Body Medium · 16 chevronRight at the end (mirrored in RTL). Pressed = Alpha/Ink 6% overlay.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useFocusRing } from './usePressState';
import { useTheme } from '../theme';

export type ActionBannerProps = {
  icon: IconName;
  /** Bold lead-in, e.g. "Verify your ID and address". */
  title: string;
  /** Rest of the sentence, e.g. "to send up to £12,000". */
  message?: string;
  onPress: () => void;
  testID?: string;
};

export function ActionBanner({ icon, title, message, onPress, testID }: ActionBannerProps) {
  const t = useTheme();
  const { focused, focusProps } = useFocusRing();
  const r = t.radius['radius/md'];
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={message ? `${title} ${message}` : title}
      {...focusProps}
      style={[
        styles.row,
        {
          gap: t.spacing['spacing/12'],
          padding: t.spacing['spacing/12'],
          borderRadius: r,
          backgroundColor: t.colors['Status/Info/Light'],
          minHeight: t.sizes.touchTarget,
        },
        focused && { outlineColor: t.colors[t.states.focusRing.color], outlineWidth: t.stroke[t.states.focusRing.width], outlineStyle: 'solid', outlineOffset: t.spacing['spacing/2'] },
      ]}
    >
      {({ pressed }) => (
        <>
          <Icon name={icon} size={t.sizes.icon.md} color="Status/Info/Default" />
          <AppText variant="Body" color="Status/Info/Dark" style={styles.flex}>
            <AppText variant="Body Medium" color="Status/Info/Dark">{title}</AppText>
            {message ? ` ${message}` : ''}
          </AppText>
          <Icon name="chevronRight" size={t.sizes.icon.sm} color="Status/Info/Dark" />
          {pressed ? (
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: t.colors['Alpha/Ink 6%'] }]} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }, flex: { flex: 1 } });
