/**
 * 7.2a Verify login — code by text (EN 220:6506) and 7.2b — code by email (220:6600), including the wrong-code
 * state 7.2d (220:6739). One screen, `method` picks the copy and the masked destination.
 *
 * Layout (Figma): Step Header (back only) pt spacing/8, gutter spacing/24, pb spacing/16 ·
 * Content pt spacing/8, pb spacing/24, gap spacing/24: Text (H2 title, Body Large Slate intro, Number row gap spacing/16:
 * masked number/email in Title + Small Tonal "Edit"), Code input, [Error box 7.2d], Help row (Resend Countdown at start,
 * "Try another way" Body Medium Primary/Red at end) · Keypad (mock; device-frame preview only — phones use the
 * native number pad with SMS autofill).
 * 7.9 / 7.9b / 7.10 (New Designs 57:28130) reuse it for a new device: "Enter your code", correct → 7.11, "Didn’t get a code?" → 7.8d.
 * Correct code → Home. Wrong code → 7.2d with attempts left (3 total). Edit → back to 7.1.
 */
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, BackButton, Button, CodeError, CodeInput, Keypad, ResendCountdown, Screen, useCountdown,
} from '../../components';
import { demoAccount } from '../../mock/account';
import { inDeviceFrame } from '../../platform/deviceFrame';
import { maskEmail, maskPhone } from '../../utils/mask';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

type Props = NativeStackScreenProps<RootStackParamList, '7.2a' | '7.2b' | '7.9' | '7.9b'>;

export function VerifyLoginScreen({ navigation, route }: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const method = route.name === '7.2b' || route.name === '7.9b' ? 'email' : 'sms';
  // 7.9 / 7.9b (New Designs, new-device flow): same screen, "Enter your code", correct code → 7.11, help link → 7.8d.
  const newDevice = route.name === '7.9' || route.name === '7.9b';
  const phone = route.params?.phone || demoAccount.phone;
  const email = route.params?.email || demoAccount.email;

  const wrongPreview = route.params?.previewState === 'wrongCode';
  const [code, setCode] = useState(wrongPreview ? '482916' : '');
  const [status, setStatus] = useState<'error' | 'success' | undefined>(wrongPreview ? 'error' : undefined);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(demoAccount.codeAttempts - (wrongPreview ? 1 : 0));
  const [round, setRound] = useState(0);
  const secondsLeft = useCountdown(demoAccount.resendSeconds, round);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const locked = attemptsLeft === 0;
  const k = newDevice ? 'login.7_9' : 'login.7_2';

  const submit = (value: string) => {
    if (value === demoAccount.code) {
      setStatus('success');
      timer.current = setTimeout(
        () => (newDevice ? navigation.reset({ index: 0, routes: [{ name: '7.11' }] }) : navigation.reset({ index: 0, routes: [{ name: 'Home' }] })),
        t.states.motion.mockRequest,
      );
    } else {
      setStatus('error');
      setAttemptsLeft((a) => Math.max(0, a - 1));
    }
  };

  const change = (value: string) => {
    if (status === 'success' || locked) return;
    // Typing after a wrong code starts a fresh entry.
    if (status === 'error') {
      setStatus(undefined);
      setCode(value.length > code.length ? value.slice(-1) : '');
      return;
    }
    setCode(value);
  };

  const press = (digit: string) => {
    if (status === 'error') return change(code + digit);
    const next = (code + digit).slice(0, 6);
    change(next);
    if (next.length === 6 && next !== code) submit(next);
  };

  const resend = () => {
    setRound((r) => r + 1);
    setCode('');
    setStatus(undefined);
    setAttemptsLeft(demoAccount.codeAttempts);
  };

  const g = t.layout.screenGutter;

  return (
    <Screen edges={inDeviceFrame ? ['top'] : ['top', 'bottom']}>
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/16'], alignItems: 'flex-start' }}>
        <BackButton onPress={() => navigation.goBack()} testID="back" />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/24'] }} keyboardShouldPersistTaps="handled">
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.${method === 'sms' ? 'textedTo' : 'emailedTo'}`)}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'] }}>
            <AppText variant="Title">{ltr(method === 'sms' ? maskPhone(phone) : maskEmail(email))}</AppText>
            <Button size="small" type="tonal" icon="edit" label={tr('common.edit')} onPress={() => navigation.goBack()} />
          </View>
        </View>

        <CodeInput
          value={code}
          onChangeText={change}
          onComplete={submit}
          status={status}
          editable={!locked && status !== 'success'}
          autoFocus={!inDeviceFrame}
          forceFocus={inDeviceFrame}
          testID="code-input"
        />

        {status === 'error' ? (
          <CodeError message={tr('components.codeError.wrongCode')} attemptsLeft={attemptsLeft} attemptsTotal={demoAccount.codeAttempts} />
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: t.spacing['spacing/8'] }}>
          <ResendCountdown secondsLeft={secondsLeft} total={demoAccount.resendSeconds} onResend={resend} />
          <Pressable
            onPress={() => (newDevice ? navigation.popTo('7.8d') : navigation.navigate('7.2c', { phone, email, method }))}
            accessibilityRole="link"
            hitSlop={t.spacing['spacing/12']}
            testID="try-another-way"
          >
            {({ pressed }) => (
              <AppText variant="Body Medium" color="Primary/Red" style={pressed ? styles.underline : undefined}>
                {newDevice ? tr(`${k}.noCode`) : tr('components.tryAnotherWay')}
              </AppText>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {inDeviceFrame ? (
        <Keypad
          onDigit={press}
          onDelete={() => change(code.slice(0, -1))}
          // Figma: 7.2a keypad has Autofill=On; 7.2b (email) and 7.2d (wrong code) have Autofill=Off.
          suggestion={method === 'sms' && !status ? demoAccount.code : undefined}
          onSuggestion={(c) => { setCode(c); submit(c); }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, underline: { textDecorationLine: 'underline' } });
