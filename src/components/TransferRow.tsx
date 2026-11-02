/**
 * Transfer row — code addition (Home proposal; no Figma component yet, docs/figma-issues.md #41).
 * Row, padding spacing/12 vertical, gap spacing/12; rows after the first get an Alpha/Ink 10% hairline (stroke/xs):
 *  recipient Avatar 44 (tint, same as Recent recipients) ·
 *  name (Body Medium) over a 14 bank/cash icon + method · date (Caption, Slate) ·
 *  amount (Body Medium, EN style, LTR) over a status pill (radius/full, Caption + 12 icon):
 *    Delivered = Status/Success/Light + Status/Success/Default check · Processing = Neutral/Fog + Slate clock.
 * Pressed = Alpha/Ink 6% overlay. Read as one element: "Layla Haddad, Bank deposit, 28 Oct, £250.00, Delivered".
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Avatar, type AvatarTone } from './Avatar';
import { Icon } from './Icon';
import { useTheme, getTextStyle, type ColorToken } from '../theme';

export type TransferRowProps = {
  name: string;
  initials: string;
  tone?: AvatarTone;
  method: 'bank' | 'cash';
  methodLabel: string;
  date: string;
  amount: string;
  status: 'delivered' | 'processing';
  statusLabel: string;
  divider?: boolean;
  onPress: () => void;
};

const statusLook: Record<TransferRowProps['status'], { bg: ColorToken; fg: ColorToken; icon: 'check' | 'clock' }> = {
  delivered: { bg: 'Status/Success/Light', fg: 'Status/Success/Default', icon: 'check' },
  processing: { bg: 'Neutral/Fog', fg: 'Neutral/Slate', icon: 'clock' },
};

export function TransferRow({ name, initials, tone = 'tint', method, methodLabel, date, amount, status, statusLabel, divider, onPress }: TransferRowProps) {
  const t = useTheme();
  const s = statusLook[status];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[name, methodLabel, date, amount, statusLabel].join(', ')}
      style={{ borderTopWidth: divider ? t.stroke['stroke/xs'] : 0, borderTopColor: t.colors['Alpha/Ink 10%'] }}
    >
      {({ pressed }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], paddingVertical: t.spacing['spacing/12'] }}>
          {pressed ? (
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { marginHorizontal: -t.spacing['spacing/16'], backgroundColor: t.colors['Alpha/Ink 6%'] }]} />
          ) : null}
          <Avatar initials={initials} size={44} tone={tone} />
          <View style={styles.flex}>
            <AppText variant="Body Medium" numberOfLines={1}>{name}</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/4'] }}>
              <Icon name={method === 'cash' ? 'cash' : 'bank'} size={t.sizes.icon.xs} color="Neutral/Slate" />
              <AppText variant="Caption" color="Neutral/Slate" numberOfLines={1} style={styles.flex}>{methodLabel} · {date}</AppText>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: t.spacing['spacing/4'] }}>
            <AppText variant="Body Medium" style={getTextStyle('Body Medium', 'en')}>{amount}</AppText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.spacing['spacing/4'],
                paddingHorizontal: t.spacing['spacing/8'],
                paddingVertical: t.spacing['spacing/2'],
                borderRadius: t.radius['radius/full'],
                backgroundColor: t.colors[s.bg],
              }}
            >
              <Icon name={s.icon} size={t.sizes.icon.xxs} color={s.fg} />
              <AppText variant="Caption" color={s.fg}>{statusLabel}</AppText>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
