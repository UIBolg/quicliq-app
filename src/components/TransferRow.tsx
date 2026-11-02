/**
 * Transfer row — code addition (Home proposal), modelled on List Item (Icon Badge + text):
 * Icon Badge 44 White (bank / cash) · name (Body Medium) + method · date (Caption Slate) · amount (Body Medium, EN digits,
 * LTR) + status (Caption; Delivered = Status/Success/Default, otherwise Slate) at the end. Padding spacing/16 vertical,
 * gap spacing/12; rows after the first get a Neutral/Silver hairline (stroke/xs). Pressed = Alpha/Ink 6% overlay.
 * Read as one element: "Layla Haddad, Bank deposit, 28 Oct, £250.00, Delivered".
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { IconBadge } from './IconBadge';
import { useTheme, getTextStyle } from '../theme';

export type TransferRowProps = {
  name: string;
  method: 'bank' | 'cash';
  methodLabel: string;
  date: string;
  amount: string;
  status: 'delivered' | 'processing';
  statusLabel: string;
  divider?: boolean;
  onPress: () => void;
};

export function TransferRow({ name, method, methodLabel, date, amount, status, statusLabel, divider, onPress }: TransferRowProps) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[name, methodLabel, date, amount, statusLabel].join(', ')}
      style={{ borderTopWidth: divider ? t.stroke['stroke/xs'] : 0, borderTopColor: t.colors['Neutral/Silver'] }}
    >
      {({ pressed }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], paddingVertical: t.spacing['spacing/16'] }}>
          {pressed ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.colors['Alpha/Ink 6%'] }]} /> : null}
          <IconBadge icon={method === 'cash' ? 'cash' : 'bank'} size={44} tone="white" />
          <View style={styles.flex}>
            <AppText variant="Body Medium" numberOfLines={1}>{name}</AppText>
            <AppText variant="Caption" color="Neutral/Slate" numberOfLines={1}>{methodLabel} · {date}</AppText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText variant="Body Medium" style={getTextStyle('Body Medium', 'en')}>{amount}</AppText>
            <AppText variant="Caption" color={status === 'delivered' ? 'Status/Success/Default' : 'Neutral/Slate'}>{statusLabel}</AppText>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
