/**
 * 7.8 Verify it's you — details (New Designs 57:28253), with 7.8b details don't match (error state).
 * Back · Heading (H2 + Body Large Slate) · 4 Text Fields (First, Middle, Last name, Date of birth with calendar) ·
 * Info banner (where the code goes) — or, after a mismatch, all fields in error + Error banner with attempts left ·
 * Footer Primary "Continue" (disabled until first/last name and date are filled).
 * Demo (no API): James / Robert / Carter / 14 03 1990 match. 3 wrong tries → 7.8c. Match → 7.8d (email is verified).
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BackButton, Banner, Button, Screen, TextField } from '../../components';
import { demoAccount, demoIdentity } from '../../mock/account';
import { maskPhone } from '../../utils/mask';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'login.7_8';
const norm = (s: string) => s.trim().toLowerCase();
const digits = (s: string) => s.replace(/\D/g, '');

export function VerifyDetailsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '7.8'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const [v, setV] = useState({ first: '', middle: '', last: '', dob: '' });
  const [attemptsLeft, setAttemptsLeft] = useState<number>(demoIdentity.attempts);
  const [mismatch, setMismatch] = useState(false);
  const set = (f: keyof typeof v) => (text: string) => { setMismatch(false); setV((p) => ({ ...p, [f]: text })); };
  const ready = !!(v.first.trim() && v.last.trim() && digits(v.dob).length === 8);

  const submit = () => {
    const ok = norm(v.first) === norm(demoIdentity.first) && norm(v.last) === norm(demoIdentity.last)
      && (!v.middle.trim() || norm(v.middle) === norm(demoIdentity.middle)) && digits(v.dob) === demoIdentity.dob;
    if (ok) return navigation.navigate('7.8d');
    const left = attemptsLeft - 1;
    if (left <= 0) return navigation.reset({ index: 1, routes: [{ name: '7.1' }, { name: '7.8c' }] });
    setAttemptsLeft(left);
    setMismatch(true);
  };

  const phone = maskPhone(demoAccount.phone);
  return (
    <Screen>
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g, alignItems: 'flex-start' }}>
        <BackButton onPress={() => navigation.goBack()} testID="back" />
      </View>
      <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/24'] }}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.body`)}</AppText>
        </View>
        <View style={{ gap: t.spacing['spacing/16'] }}>
          <TextField label={tr(`${k}.first`)} value={v.first} onChangeText={set('first')} invalid={mismatch} autoComplete="given-name" testID="first-name" />
          <TextField label={tr(`${k}.middle`)} value={v.middle} onChangeText={set('middle')} invalid={mismatch} autoComplete="additional-name" testID="middle-name" />
          <TextField label={tr(`${k}.last`)} value={v.last} onChangeText={set('last')} invalid={mismatch} autoComplete="family-name" testID="last-name" />
          <TextField label={tr(`${k}.dob`)} placeholder={tr(`${k}.dobFormat`)} value={v.dob} onChangeText={set('dob')} invalid={mismatch} trailing="calendar" ltrValue keyboardType="number-pad" maxLength={14} testID="dob" />
        </View>
        {mismatch
          ? <Banner type="error" text={tr(`${k}.mismatch`, { count: attemptsLeft })} testID="mismatch" />
          : <Banner type="info" text={tr(`${k}.note`, { maskedPhone: ltr(phone), last4: ltr(demoAccount.phone.slice(-4)) })} />}
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'] }}>
        <Button type={ready ? 'primary' : 'disabled'} label={tr('common.continue')} onPress={submit} testID="continue" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
