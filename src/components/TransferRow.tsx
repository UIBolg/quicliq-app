/**
 * Transfer card — one transfer as its own card (Home "Recent transfers" and 11.1 Activity; no Figma component yet,
 * docs/figma-issues.md #41). Neutral/Fog, radius/lg, padding spacing/16, gap spacing/12:
 *  Icon Badge 44 White (bank / cash) · name (Body Medium) over method · date (Caption, Slate) ·
 *  amount (Body Medium, EN style, LTR) over a status pill (radius/full, Caption):
 *    Delivered = Status/Success/Light + Status/Success/Default · Processing = Neutral/White + Slate.
 * Pressed = Alpha/Ink 6% overlay. Read as one element: "Layla Haddad, Bank deposit, 28 Oct, £250.00, Delivered".
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { IconBadge } from './IconBadge';
import { useTheme, getTextStyle, type ColorToken } from '../theme';

export type TransferRowProps = {
  name: string;
  method: 'bank' | 'cash';
  methodLabel: string;
  date: string;
  amount: string;
  status: 'delivered' | 'processing';
  statusLabel: string;
  onPress: () => void;
};

const statusLook: Record<TransferRowProps['status'], { bg: ColorToken; fg: ColorToken }> = {
  delivered: { bg: 'Status/Success/Light', fg: 'Status/Success/Default' },
  processing: { bg: 'Neutral/White', fg: 'Neutral/Slate' },
};

export function TransferRow({ name, method, methodLabel, date, amount, status, statusLabel, onPress }: TransferRowProps) {
  const t = useTheme();
  const s = statusLook[status];
  const r = t.radius['radius/lg'];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[name, methodLabel, date, amount, statusLabel].join(', ')}
      style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], padding: t.spacing['spacing/16'], borderRadius: r, backgroundColor: t.colors['Neutral/Fog'], overflow: 'hidden' }}
    >
      {({ pressed }) => (
        <>
          {pressed ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: t.colors['Alpha/Ink 6%'] }]} /> : null}
          <IconBadge icon={method === 'cash' ? 'cash' : 'bank'} size={44} tone="white" />
          <View style={styles.flex}>
            <AppText variant="Body Medium" numberOfLines={1}>{name}</AppText>
            <AppText variant="Caption" color="Neutral/Slate" numberOfLines={1}>{methodLabel} · {date}</AppText>
          </View>
          <View style={{ alignItems: 'flex-end', gap: t.spacing['spacing/4'] }}>
            <AppText variant="Body Medium" style={getTextStyle('Body Medium', 'en')}>{amount}</AppText>
            <View style={{ paddingHorizontal: t.spacing['spacing/8'], paddingVertical: t.spacing['spacing/2'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors[s.bg] }}>
              <AppText variant="Caption" color={s.fg}>{statusLabel}</AppText>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
