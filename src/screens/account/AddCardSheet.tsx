/**
 * Add a card — bottom sheet from the owner's Send money design (6.5a); reused by 12.4 Saved cards.
 * Title (H3) · Card number Text Field (digits grouped in 4s, 16 digits) · Expiry (MM/YY) + CVV (3 digits, hidden) side by side,
 * gap spacing/12 · "Save this card" row with a Switch (payment context only — in Saved cards the card is always saved) ·
 * Primary button ("Use this card" in payment, "Save card" in the profile), disabled until all fields are valid.
 * Brand from the first digit (4 Visa, 5 Mastercard). With the API: Checkout.com card capture + 3DS (6.5a).
 */
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, BottomSheet, Button, Switch, TextField } from '../../components';
import { useTheme } from '../../theme';

export type NewCard = { brand: 'Visa' | 'Mastercard'; last4: string; expires: string; save: boolean };

const k = 'account.addCard';
const digits = (v: string) => v.replace(/\D/g, '');

export function AddCardSheet({ visible, context, onClose, onDone }: {
  visible: boolean;
  context: 'profile' | 'payment';
  onClose: () => void;
  onDone: (card: NewCard) => void;
}) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [save, setSave] = useState(true);

  const n = digits(number);
  const [mm, yy] = [Number(expiry.slice(0, 2)), expiry.slice(3)];
  const valid = n.length === 16 && /^[45]/.test(n) && expiry.length === 5 && mm >= 1 && mm <= 12 && yy.length === 2 && digits(cvv).length === 3;

  const reset = () => { setNumber(''); setExpiry(''); setCvv(''); setSave(true); };
  const close = () => { reset(); onClose(); };
  const submit = () => {
    onDone({ brand: n.startsWith('4') ? 'Visa' : 'Mastercard', last4: n.slice(-4), expires: expiry, save: context === 'profile' || save });
    reset();
  };

  return (
    <BottomSheet visible={visible} onClose={close}>
      <AppText variant="H3" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
      <View style={{ gap: t.spacing['spacing/12'] }}>
        <TextField
          label={tr(`${k}.number`)}
          value={number}
          onChangeText={(v) => setNumber(digits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))}
          keyboardType="number-pad"
          autoComplete="cc-number"
          testID="card-number"
        />
        <View style={{ flexDirection: 'row', gap: t.spacing['spacing/12'] }}>
          <View style={{ flex: 1 }}>
            <TextField
              label={tr(`${k}.expiry`)}
              value={expiry}
              onChangeText={(v) => { const d = digits(v).slice(0, 4); setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d); }}
              keyboardType="number-pad"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              testID="card-expiry"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label={tr(`${k}.cvv`)}
              value={cvv}
              onChangeText={(v) => setCvv(digits(v).slice(0, 3))}
              keyboardType="number-pad"
              autoComplete="cc-csc"
              secureTextEntry
              testID="card-cvv"
            />
          </View>
        </View>
      </View>
      {context === 'payment' ? (
        <Pressable
          onPress={() => setSave((s) => !s)}
          accessibilityRole="switch"
          accessibilityState={{ checked: save }}
          accessibilityLabel={tr(`${k}.save`)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: t.sizes.touchTarget }}
        >
          <AppText variant="Body">{tr(`${k}.save`)}</AppText>
          <Switch value={save} />
        </Pressable>
      ) : null}
      <Button type={valid ? 'primary' : 'disabled'} label={tr(`${k}.${context === 'payment' ? 'use' : 'saveCard'}`)} onPress={submit} testID="add-card-submit" />
    </BottomSheet>
  );
}
