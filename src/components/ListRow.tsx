/**
 * List Row + List Group — code addition (Account screen; no Figma component yet, docs/figma-issues.md #40).
 * List Group: optional Overline title (Slate) above a Neutral/Fog card, radius/lg, padding 0 spacing/16, gap spacing/8.
 * List Row: ≥56 high (touch area ≥44), padding spacing/12 vertical, gap spacing/12, Alpha/Ink 10% hairline between rows:
 *   Icon Badge 40 (`iconTone`: default White + Ink · red Alpha/Red 8% + Primary/Red · green Status/Success/Light +
 *   Status/Success/Default · ink Neutral/Ink + White) · title (Body Medium) over optional subtitle (Caption, Slate) · optional value (Body, Slate) ·
 *   chevronRight 20 (mirrored in RTL), or an `accessory` in its place (e.g. a Switch).
 *   `tone="danger"` paints the title and icon Primary/Red and drops the chevron (Log out).
 * Pressed = Alpha/Ink 6% overlay across the row.
 */
import { Children, isValidElement, cloneElement, type ReactElement, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useFocusRing } from './usePressState';
import { useTheme, type ColorToken } from '../theme';

export type ListRowProps = {
  icon: IconName;
  /** Colour of the icon circle (Account groups). */
  iconTone?: 'default' | 'red' | 'green' | 'ink';
  title: string;
  subtitle?: string;
  value?: string;
  /** Replaces the chevron, e.g. a Switch. */
  accessory?: ReactNode;
  /** Extra spoken state, e.g. "On" for a switch row. */
  accessibilityState?: { checked?: boolean };
  onPress: () => void;
  tone?: 'default' | 'danger';
  /** Set by ListGroup on every row but the first. */
  divider?: boolean;
  testID?: string;
};

const badgeTones: Record<NonNullable<ListRowProps['iconTone']>, { bg: ColorToken; fg: ColorToken }> = {
  default: { bg: 'Neutral/White', fg: 'Neutral/Ink' },
  red: { bg: 'Alpha/Red 8%', fg: 'Primary/Red' },
  green: { bg: 'Status/Success/Light', fg: 'Status/Success/Default' },
  ink: { bg: 'Neutral/Ink', fg: 'Neutral/White' },
};

export function ListRow({ icon, iconTone = 'default', title, subtitle, value, accessory, accessibilityState, onPress, tone = 'default', divider, testID }: ListRowProps) {
  const t = useTheme();
  const { focused, focusProps } = useFocusRing();
  const danger = tone === 'danger';
  const badge = badgeTones[danger ? 'red' : iconTone];
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole={accessibilityState ? 'switch' : 'button'}
      accessibilityState={accessibilityState}
      accessibilityLabel={[title, subtitle, value].filter(Boolean).join(', ')}
      {...focusProps}
      style={[
        styles.row,
        {
          gap: t.spacing['spacing/12'],
          paddingVertical: t.spacing['spacing/12'],
          minHeight: t.sizes.listRow.minHeight,
          borderTopWidth: divider ? t.stroke['stroke/xs'] : 0,
          borderTopColor: t.colors['Alpha/Ink 10%'],
        },
        focused && { outlineColor: t.colors[t.states.focusRing.color], outlineWidth: t.stroke[t.states.focusRing.width], outlineStyle: 'solid' },
      ]}
    >
      {({ pressed }) => (
        <>
          {pressed ? (
            <View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { marginHorizontal: -t.spacing['spacing/16'], backgroundColor: t.colors['Alpha/Ink 6%'] }]}
            />
          ) : null}
          <View style={{ width: t.sizes.listRow.badge, height: t.sizes.listRow.badge, borderRadius: t.radius['radius/full'], backgroundColor: t.colors[badge.bg], alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={t.sizes.icon.md} color={badge.fg} />
          </View>
          <View style={styles.flex}>
            <AppText variant="Body Medium" color={danger ? 'Primary/Red' : 'Neutral/Ink'}>{title}</AppText>
            {subtitle ? <AppText variant="Caption" color="Neutral/Slate">{subtitle}</AppText> : null}
          </View>
          {value ? <AppText variant="Body" color="Neutral/Slate">{value}</AppText> : null}
          {accessory ?? (danger ? null : <Icon name="chevronRight" size={t.sizes.icon.md} color="Neutral/Slate" />)}
        </>
      )}
    </Pressable>
  );
}

export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  const t = useTheme();
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListRowProps>[];
  return (
    <View style={{ gap: t.spacing['spacing/8'] }}>
      {title ? <AppText variant="Overline" color="Neutral/Slate" accessibilityRole="header">{title}</AppText> : null}
      <View style={{ backgroundColor: t.colors['Neutral/Fog'], borderRadius: t.radius['radius/lg'], paddingHorizontal: t.spacing['spacing/16'], overflow: 'hidden' }}>
        {rows.map((row, i) => cloneElement(row, { divider: i > 0 }))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center' }, flex: { flex: 1 } });
