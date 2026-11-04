/**
 * 7.1 Login (EN 82:9641) and 7.1b Login — email (138:3251); loading state 7.2 (82:9664) / 7.2e (220:6427).
 *
 * Layout (Figma): Content pt spacing/48, gutter spacing/24, pb spacing/24, gap spacing/32 —
 * Logo (login size), Heading (H1 + Body Large Slate, gap spacing/8), Login Method,
 * Form (gap spacing/16, end-aligned: Phone row or Email field, Password field with eye, "Forgot password?"
 * Body Medium Primary/Red), Actions (Primary "Log in"). Flexible spacer. Footer pt spacing/16, pb spacing/32:
 * "Don't have an account? Sign up" centred (Body Slate + Body Medium Primary/Red link).
 *
 * States (same screen): 7.3 Incorrect credentials (82:9687) — Error Banner at the top of the form and both fields
 * in the error look (never says which one was wrong); 7.4 Too many attempts (82:9713) — after 5 wrong tries a Security
 * Banner (clock icon), disabled "Try again in mm:ss" (15 min countdown) and Ghost "Reset password", Actions gap spacing/16.
 * No backend yet (demo account in src/mock/account.ts): "Log in" shows the Loading button (7.2 / 7.2e); offline → 7.5;
 * demo credentials (mobile 123456789 / demo email + password 123456) → 7.2a (text) / 7.2b (email);
 * anything else → 7.3, the 5th time → 7.4.
 */
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, Banner, Button, LoginMethod, Logo, PhoneField, Screen, TextField, formatMSS, useCountdown, type LoginMethodValue,
} from '../../components';
import { demoAccount, isDemoLogin } from '../../mock/account';
import { isOffline } from '../../platform/network';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

export function LoginScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '7.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [method, setMethod] = useState<LoginMethodValue>(route.params?.method ?? 'mobile');
  const preview = route.params?.previewState;
  const [mobile, setMobile] = useState(preview ? demoAccount.phone : '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(preview ? 'wrongpass1' : '');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(preview === 'incorrect' ? 1 : 0);
  const [incorrect, setIncorrect] = useState(preview === 'incorrect');
  const [lockRound, setLockRound] = useState(preview === 'locked' ? 1 : 0);
  const lockLeft = useCountdown(lockRound ? demoAccount.lockSeconds : 0, lockRound);
  const locked = lockRound > 0 && lockLeft > 0;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  // Lock over: start counting attempts again.
  useEffect(() => {
    if (lockRound > 0 && lockLeft === 0) { setLockRound(0); setFailed(0); }
  }, [lockRound, lockLeft]);

  const edit = <T,>(set: (v: T) => void) => (v: T) => { set(v); setIncorrect(false); };

  const k = 'login.7_1';
  const g = t.layout.screenGutter;

  const logIn = () => {
    setLoading(true);
    setIncorrect(false);
    timer.current = setTimeout(async () => {
      const offline = await isOffline();
      setLoading(false);
      if (offline) return navigation.navigate('7.5');
      // Demo shortcut: Log in with both fields empty skips straight to Home (no code step). Remove with the real API.
      if (!(method === 'mobile' ? mobile : email).trim() && !password) {
        setFailed(0);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        return;
      }
      if (isDemoLogin(method, method === 'mobile' ? mobile : email, password)) {
        setFailed(0);
        if (method === 'mobile') navigation.navigate('7.2a', { phone: mobile || undefined });
        else navigation.navigate('7.2b', { email: email || undefined });
        return;
      }
      const n = failed + 1;
      setFailed(n);
      if (n >= demoAccount.loginAttempts) setLockRound((r) => r + 1);
      else setIncorrect(true);
    }, t.states.motion.mockRequest);
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.grow} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: t.spacing['spacing/48'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/32'] }}>
            <View style={{ alignSelf: 'flex-start' }}>
              <Logo height={t.sizes.logo.login} />
            </View>

            <View style={{ gap: t.spacing['spacing/8'] }}>
              <AppText variant="H1" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
              <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.subtitle`)}</AppText>
            </View>

            <LoginMethod value={method} onChange={setMethod} />

            <View style={{ gap: t.spacing['spacing/16'] }}>
              {incorrect ? <Banner type="error" text={tr(`${k}.incorrect`)} testID="banner-incorrect" /> : null}
              {locked ? <Banner type="security" icon="clock" text={tr(`${k}.tooMany`)} testID="banner-locked" /> : null}
              {method === 'mobile' ? (
                <PhoneField label={tr(`${k}.mobile`)} value={mobile} onChangeText={edit(setMobile)} invalid={incorrect} testID="mobile" />
              ) : (
                <TextField
                  label={tr(`${k}.email`)}
                  value={email}
                  onChangeText={edit(setEmail)}
                  invalid={incorrect}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="username"
                  testID="email"
                />
              )}
              <TextField
                label={tr(`${k}.password`)}
                value={password}
                onChangeText={edit(setPassword)}
                invalid={incorrect}
                trailing="eye"
                autoComplete="current-password"
                textContentType="password"
                testID="password"
              />
              <Pressable
                style={{ alignSelf: 'flex-end' }}
                onPress={() => navigation.navigate('NotBuilt', { screenId: 'Forgot password' })}
                accessibilityRole="link"
                hitSlop={t.spacing['spacing/12']}
              >
                {({ pressed }) => (
                  <AppText variant="Body Medium" color="Primary/Red" style={pressed ? styles.underline : undefined}>
                    {tr(`${k}.forgot`)}
                  </AppText>
                )}
              </Pressable>
            </View>

            {locked ? (
              <View style={{ gap: t.spacing['spacing/16'] }}>
                <Button type="disabled" label={tr(`${k}.tryAgainIn`, { time: `\u2066${formatMSS(lockLeft)}\u2069` })} testID="log-in-submit" />
                <Button type="ghost" label={tr(`${k}.resetPassword`)} onPress={() => navigation.navigate('NotBuilt', { screenId: 'Forgot password' })} />
              </View>
            ) : (
              <Button type={loading ? 'loading' : 'primary'} label={tr(`${k}.logIn`)} onPress={logIn} testID="log-in-submit" />
            )}
          </View>

          <View style={styles.flex} />

          {/* Demo entry (no API yet): open Home straight at a sending-limit level. Remove with the real login. */}
          <View style={{ paddingHorizontal: g, gap: t.spacing['spacing/8'], alignItems: 'center' }}>
            <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.demo`)}</AppText>
            <View style={{ flexDirection: 'row', gap: t.spacing['spacing/8'] }}>
              {([1, 2, 3] as const).map((lvl) => (
                <Button
                  key={lvl}
                  size="small"
                  type="tonal"
                  label={tr(`home.levels.${lvl}`)}
                  onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home', params: { level: lvl } }] })}
                  testID={`demo-level-${lvl}`}
                />
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: t.spacing['spacing/8'] }}>
              <Button size="small" type="tonal" label={tr(`${k}.demoNewDevice`)} onPress={() => navigation.navigate('7.7')} testID="demo-new-device" />
              <Button size="small" type="tonal" label={tr(`${k}.demoFaceId`)} onPress={() => navigation.navigate('7.0', { biometric: 'faceId' })} testID="demo-face-id" />
              <Button size="small" type="tonal" label={tr(`${k}.demoFingerprint`)} onPress={() => navigation.navigate('7.0', { biometric: 'fingerprint' })} testID="demo-fingerprint" />
              <Button size="small" type="tonal" label={tr('system.9_1.title')} onPress={() => navigation.navigate('9.1')} testID="demo-update" />
              <Button size="small" type="tonal" label={tr('system.9_2.title')} onPress={() => navigation.navigate('9.2')} testID="demo-maintenance" />
            </View>
          </View>

          <View style={{ paddingTop: t.spacing['spacing/16'], paddingBottom: t.spacing['spacing/32'], paddingHorizontal: g, alignItems: 'center' }}>
            <Pressable
              onPress={() => navigation.navigate('NotBuilt', { screenId: '1.1' })}
              accessibilityRole="link"
              accessibilityLabel={`${tr(`${k}.noAccount`)} ${tr(`${k}.signUp`)}`}
              hitSlop={t.spacing['spacing/12']}
            >
              {({ pressed }) => (
                <AppText variant="Body" color="Neutral/Slate" style={{ textAlign: 'center' }}>
                  {tr(`${k}.noAccount`)}{' '}
                  <AppText variant="Body Medium" color="Primary/Red" style={pressed ? styles.underline : undefined}>
                    {tr(`${k}.signUp`)}
                  </AppText>
                </AppText>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  underline: { textDecorationLine: 'underline' },
});
