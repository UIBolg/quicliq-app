/**
 * Registration — Verify your number (Figma "New registration" 2.4–2.8, 2.4g / 2.7b), step 2 of 2:
 *  2.4 Step Header · H2 "Verify your number" + "We've texted a 6-digit code to" + number (Title) with Small Tonal "Edit" ·
 *      6 OTP digits · Help row (Resend Countdown · "Didn't get a code?") · Keypad (device-frame preview only).
 *  2.4b resend unlocked · 2.4c "New code sent…" Success banner · 2.5 verifying (Loading button) · 2.6 wrong code (Code
 *  Error with attempts left; 3 wrong → locked until resend) · 2.7 / 2.7b "Number verified" + "Creating your account…" → 2.9.
 *  2.4a Edit sheet (+44 field, "Send new code") → 2.4d checking → 2.4e confirmed (Send code) / 2.4f couldn't confirm.
 *  2.8 "Didn't get a code?" sheet: Resend by text (after the timer) · Change mobile number · Cancel.
 * idCheck (2.4g / 2.7b): number not in the user's name → 2.9b. Demo code 123456 (as login).
 */
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, Banner, BottomSheet, Button, CodeError, CodeInput, IconBadge, Keypad, PhoneField, ResendCountdown, Screen, StepHeader, VerifiedTag,
  formatMSS, useCountdown, type IconName,
} from '../../components';
import { demoAccount, demoRegistration } from '../../mock/account';
import { inDeviceFrame } from '../../platform/deviceFrame';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';
import { ukDisplay } from './AccountDetailsScreen';
import { SheetHeading, ThingsToCheck } from './parts';

const k = 'registration.2_4';

function OptionRow({ icon, title, subtitle, disabled, onPress, testID }: { icon: IconName; title: string; subtitle?: string; disabled?: boolean; onPress: () => void; testID?: string }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityState={{ disabled }} testID={testID}
      style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], padding: t.spacing['spacing/16'], minHeight: t.sizes.touchTarget, borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'], opacity: disabled ? 0.5 : 1 }, pressed && { backgroundColor: t.colors['Neutral/Dark Fog'] }]}>
      <IconBadge icon={icon} size={40} tone="redTint" />
      <View style={styles.flex}>
        <AppText variant="Body Medium">{title}</AppText>
        {subtitle ? <AppText variant="Caption" color="Neutral/Slate">{subtitle}</AppText> : null}
      </View>
    </Pressable>
  );
}

export function VerifyNumberScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '2.4'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const { firstName, idCheck } = route.params;
  const [phone, setPhone] = useState(route.params.phone);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'error' | 'success' | 'verifying' | undefined>();
  const [attemptsLeft, setAttemptsLeft] = useState<number>(demoAccount.codeAttempts);
  const [round, setRound] = useState(0);
  const [sentAgain, setSentAgain] = useState(false);
  const secondsLeft = useCountdown(demoAccount.resendSeconds, round);
  const [sheet, setSheet] = useState<'help' | 'edit' | 'checking' | 'ok' | 'no' | null>(null);
  const [newMobile, setNewMobile] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const locked = attemptsLeft === 0;
  const done = status === 'success' || status === 'verifying';

  const submit = (value: string) => {
    setStatus('verifying');
    timer.current = setTimeout(() => {
      if (value === demoAccount.code) {
        setStatus('success');
        timer.current = setTimeout(() => navigation.reset({ index: 0, routes: [{ name: '2.9', params: { firstName, idCheck } }] }), t.states.motion.mockRequest * 2);
      } else {
        setStatus('error');
        setAttemptsLeft((a) => Math.max(0, a - 1));
      }
    }, t.states.motion.mockRequest);
  };
  const change = (value: string) => {
    if (done || locked) return;
    if (status === 'error') { setStatus(undefined); setCode(value.length > code.length ? value.slice(-1) : ''); return; }
    setCode(value);
  };
  const press = (digit: string) => {
    if (status === 'error') return change(code + digit);
    const next = (code + digit).slice(0, 6);
    change(next);
    if (next.length === 6 && next !== code) submit(next);
  };
  const resend = () => { setRound((r) => r + 1); setCode(''); setStatus(undefined); setAttemptsLeft(demoAccount.codeAttempts); setSentAgain(true); };

  const newDigits = newMobile.replace(/\D/g, '').replace(/^0/, '');
  const checkNew = () => {
    setSheet('checking');
    timer.current = setTimeout(() => setSheet(newDigits === demoRegistration.ownedMobile ? 'ok' : 'no'), t.states.motion.mockRequest * 2);
  };

  return (
    <Screen edges={inDeviceFrame ? ['top'] : ['top', 'bottom']}>
      <StepHeader step={2} total={2} title={tr('registration.2_1.title')} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/24'] }}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.textedTo`)}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'] }}>
            <AppText variant="Title">{ltr(ukDisplay(phone))}</AppText>
            {done ? null : <Button size="small" type="tonal" icon="edit" label={tr('common.edit')} onPress={() => { setNewMobile(''); setSheet('edit'); }} testID="edit-number" />}
          </View>
        </View>
        <CodeInput value={code} onChangeText={change} onComplete={submit} status={status === 'verifying' ? undefined : status} editable={!locked && !done} autoFocus={!inDeviceFrame} forceFocus={inDeviceFrame} testID="code-input" />
        {status === 'error' ? <CodeError message={tr('components.codeError.wrongCode')} attemptsLeft={attemptsLeft} attemptsTotal={demoAccount.codeAttempts} /> : null}
        {status === 'verifying' ? <Button type="loading" label={tr(`${k}.verifying`)} /> : null}
        {status === 'success' ? (
          <View style={{ gap: t.spacing['spacing/8'], alignItems: 'flex-start' }}>
            <VerifiedTag label={tr(`${k}.verified`)} />
            <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.creating`)}</AppText>
          </View>
        ) : null}
        {sentAgain && !status ? <Banner type="success" text={tr(`${k}.newCode`)} /> : null}
        {done ? null : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: t.spacing['spacing/8'] }}>
            <ResendCountdown secondsLeft={secondsLeft} total={demoAccount.resendSeconds} onResend={resend} />
            <Pressable onPress={() => setSheet('help')} accessibilityRole="link" hitSlop={t.spacing['spacing/12']} testID="no-code">
              {({ pressed }) => <AppText variant="Body Medium" color="Primary/Red" style={pressed ? styles.underline : undefined}>{tr(`${k}.noCode`)}</AppText>}
            </Pressable>
          </View>
        )}
      </ScrollView>
      {inDeviceFrame && !done ? (
        <Keypad onDigit={press} onDelete={() => change(code.slice(0, -1))} suggestion={!status ? demoAccount.code : undefined} onSuggestion={(c) => { setCode(c); submit(c); }} />
      ) : null}

      <BottomSheet visible={!!sheet} onClose={() => setSheet(null)}>
        {sheet === 'help' ? (
          <>
            <View style={{ gap: t.spacing['spacing/8'] }}>
              <AppText variant="H3" accessibilityRole="header">{tr(`${k}.noCode`)}</AppText>
              <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.helpBody`)}</AppText>
            </View>
            <OptionRow icon="message" title={tr(`${k}.resendText`)} subtitle={secondsLeft > 0 ? tr(`${k}.availableIn`, { time: ltr(formatMSS(secondsLeft)) }) : undefined} disabled={secondsLeft > 0} onPress={() => { resend(); setSheet(null); }} testID="resend-text" />
            <OptionRow icon="edit" title={tr(`${k}.change`)} subtitle={ltr(ukDisplay(phone))} onPress={() => { setNewMobile(''); setSheet('edit'); }} testID="change-number" />
            <Button type="ghost" label={tr(`${k}.cancel`)} onPress={() => setSheet(null)} />
          </>
        ) : sheet === 'edit' || sheet === 'checking' ? (
          <>
            <View style={{ gap: t.spacing['spacing/8'] }}>
              <AppText variant="H3" accessibilityRole="header">{tr(`${k}.change`)}</AppText>
              <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.changeBody`)}</AppText>
            </View>
            <PhoneField label={tr('registration.2_1.mobile')} value={newMobile} onChangeText={setNewMobile} testID="new-mobile" />
            <Button type={sheet === 'checking' ? 'loading' : /^7\d{9}$/.test(newDigits) ? 'primary' : 'disabled'} label={tr(`${k}.sendNew`)} onPress={checkNew} testID="send-new" />
          </>
        ) : sheet === 'ok' ? (
          <>
            <SheetHeading illustration="success" title={tr('registration.2_1.ok.title')} body={tr('registration.2_1.ok.body')} />
            <Button label={tr('registration.2_1.ok.send')} onPress={() => { setPhone(newDigits); resend(); setSheet(null); }} testID="send-code" />
          </>
        ) : sheet === 'no' ? (
          <>
            <SheetHeading illustration="error" title={tr('registration.2_1.no.title')} body={tr('registration.2_1.no.body')} />
            <ThingsToCheck title={tr('registration.thingsToCheck')} items={[...(tr('registration.2_1.no.checks', { returnObjects: true }) as string[]), tr(`${k}.check07`)]} />
            <Button label={tr('registration.2_1.no.different')} onPress={() => setSheet('edit')} testID="different-number" />
          </>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, underline: { textDecorationLine: 'underline' } });
