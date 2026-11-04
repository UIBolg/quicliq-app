/**
 * Registration step 2 of 2 — Account details (Figma "New registration" EN 102:9413 / AR 102:9414):
 *  2.1 Step Header · intro · +44 Phone field (helper "Must be a UK mobile…") · Email · Password (2.1a: 5 live Password
 *      Rules while focused) · Confirm password ("Passwords match") · Agreements (Privacy Policy, Fraud Warning → 12.7a;
 *      opening a document doesn't tick it) · Footer Primary "Create account" (disabled until all valid + both ticked).
 *  2.2 errors under fields after leaving them · 2.3 ready note "Next, we'll text a 6-digit code to …" ·
 *  2.3a checking (Loading + note) → 2.3d "Your number checks out" sheet (Send code → 2.4) or 2.3b "We couldn't confirm
 *  your number" sheet (Enter a different number → 2.3c focuses the mobile field; Continue with this number → 2.4g).
 * Demo (no API): 7700 900123 is registered in your name; any other UK mobile isn't.
 */
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Agreement, AppText, Banner, BottomSheet, Button, IconBadge, PasswordRule, PhoneField, Screen, StepHeader, TextField, VerifiedTag } from '../../components';
import { demoRegistration } from '../../mock/account';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';
import { FooterNote, SheetHeading, ThingsToCheck } from './parts';

const k = 'registration.2_1';
const RULES = {
  length: (p: string) => p.length >= 8,
  upper: (p: string) => /[A-Z]/.test(p),
  lower: (p: string) => /[a-z]/.test(p),
  number: (p: string) => /\d/.test(p),
  special: (p: string) => /[^A-Za-z0-9]/.test(p),
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ukDisplay = (digits: string) => `+44 ${digits.slice(0, 4)} ${digits.slice(4)}`;

export function AccountDetailsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '2.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const [f, setF] = useState({ mobile: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [pwFocus, setPwFocus] = useState(false);
  const [agreed, setAgreed] = useState({ privacy: false, fraud: false });
  const [checking, setChecking] = useState(false);
  const [sheet, setSheet] = useState<'ok' | 'no' | null>(null);
  const [mobileKey, setMobileKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const digits = f.mobile.replace(/\D/g, '').replace(/^0/, '');
  const ok = {
    mobile: /^7\d{9}$/.test(digits),
    email: EMAIL_RE.test(f.email.trim()),
    password: Object.values(RULES).every((r) => r(f.password)),
    confirm: !!f.confirm && f.confirm === f.password,
  };
  const err = (key: keyof typeof ok, msg: string) => (touched[key] && f[key] && !ok[key] ? msg : undefined);
  const ready = Object.values(ok).every(Boolean) && agreed.privacy && agreed.fraud;
  const set = (key: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [key]: v }));
  const blur = (key: string) => () => setTouched((p) => ({ ...p, [key]: true }));

  const create = () => {
    setChecking(true);
    timer.current = setTimeout(() => { setChecking(false); setSheet(digits === demoRegistration.ownedMobile ? 'ok' : 'no'); }, t.states.motion.mockRequest * 2);
  };
  const phone = ltr(ukDisplay(digits));

  return (
    <Screen>
      <StepHeader step={2} total={2} title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
        <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.intro`)}</AppText>
        <PhoneField
          key={mobileKey}
          autoFocus={mobileKey > 0}
          label={tr(`${k}.mobile`)}
          value={f.mobile}
          onChangeText={set('mobile')}
          onBlur={blur('mobile')}
          helper={tr(`${k}.mobileHelper`)}
          error={err('mobile', tr(`${k}.errors.mobile`))}
          testID="mobile"
        />
        <TextField label={tr(`${k}.email`)} value={f.email} onChangeText={set('email')} onBlur={blur('email')} error={err('email', tr(`${k}.errors.email`))} keyboardType="email-address" autoCapitalize="none" autoComplete="email" testID="email" />
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <TextField
            label={tr(`${k}.password`)}
            placeholder={tr(`${k}.passwordPlaceholder`)}
            value={f.password}
            onChangeText={set('password')}
            onFocus={() => setPwFocus(true)}
            onBlur={() => { setPwFocus(false); blur('password')(); }}
            invalid={touched.password && !!f.password && !ok.password}
            trailing="eye"
            autoComplete="new-password"
            textContentType="newPassword"
            testID="password"
          />
          {pwFocus || (f.password && !ok.password) ? (
            <View style={{ gap: t.spacing['spacing/4'] }}>
              {(Object.keys(RULES) as (keyof typeof RULES)[]).map((r) => <PasswordRule key={r} label={tr(`${k}.rules.${r}`)} met={RULES[r](f.password)} />)}
            </View>
          ) : null}
        </View>
        <TextField
          label={tr(`${k}.confirmPassword`)}
          placeholder={tr(`${k}.confirmPlaceholder`)}
          value={f.confirm}
          onChangeText={set('confirm')}
          onBlur={blur('confirm')}
          error={err('confirm', tr(`${k}.errors.match`))}
          helper={ok.confirm ? tr(`${k}.match`) : undefined}
          trailing="eye"
          autoComplete="new-password"
          testID="confirm"
        />
        <View style={{ gap: t.spacing['spacing/12'] }}>
          {(['privacy', 'fraud'] as const).map((d) => (
            <Agreement key={d} document={d} checked={agreed[d]} onChange={(c) => setAgreed((p) => ({ ...p, [d]: c }))} onOpenDocument={(doc) => navigation.navigate('12.7a', { doc })} />
          ))}
        </View>
        {ready && !checking ? <Banner type="info" text={tr(`${k}.nextCode`, { phone })} /> : null}
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'], gap: t.spacing['spacing/16'] }}>
        {checking ? <FooterNote text={tr(`${k}.checking`)} /> : null}
        <Button type={checking ? 'loading' : ready ? 'primary' : 'disabled'} label={tr(`${k}.create`)} onPress={create} testID="create-account" />
      </View>

      <BottomSheet visible={!!sheet} onClose={() => setSheet(null)}>
        {sheet === 'ok' ? (
          <>
            <SheetHeading illustration="success" title={tr(`${k}.ok.title`)} body={tr(`${k}.ok.body`)} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
              <IconBadge icon="smartphone" size={40} tone="redTint" />
              <AppText variant="Body Medium" style={styles.flex}>{phone}</AppText>
              <VerifiedTag label={tr(`${k}.ok.tag`)} />
            </View>
            <Button label={tr(`${k}.ok.send`)} onPress={() => { setSheet(null); navigation.navigate('NotBuilt', { screenId: '2.4' }); }} testID="send-code" />
          </>
        ) : sheet === 'no' ? (
          <>
            <SheetHeading illustration="error" title={tr(`${k}.no.title`)} body={tr(`${k}.no.body`)} />
            <ThingsToCheck title={tr('registration.thingsToCheck')} items={tr(`${k}.no.checks`, { returnObjects: true }) as string[]} />
            <Button label={tr(`${k}.no.different`)} onPress={() => { setSheet(null); setMobileKey((n) => n + 1); }} testID="different-number" />
            <AppText variant="Caption" color="Neutral/Slate" style={{ textAlign: 'center' }}>{tr(`${k}.no.note`)}</AppText>
            <Button type="secondary" label={tr(`${k}.no.continue`)} onPress={() => { setSheet(null); navigation.navigate('NotBuilt', { screenId: '2.4g' }); }} testID="continue-number" />
          </>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
