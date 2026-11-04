/**
 * 7.0 Welcome back — returning customer linked to this phone (Figma "Login — returning customer" 139:3333 / AR 139:3887;
 * New Designs "Created previously"). One screen, states:
 *  7.0  Logo · Greeting (Avatar 56 + H2 "Welcome back, {name}" + smartphone icon and masked number) · Password field ·
 *       "Forgot password?" · Primary "Log in" · Or · Secondary biometric button · Footer Switch Account (→ 7.1).
 *  7.0a Face ID scanning — system prompt over the screen (Face ID illustration + "Face ID").
 *  7.0b / 7.0g not recognised — Error banner with attempts left (+ "Try Face ID again" / sheet message for fingerprint).
 *  7.0f / 7.0h 3 biometric failures — Error banner, password fallback (biometric button hidden).
 *  7.0c fingerprint — Bottom Sheet "Log in with fingerprint" / "Touch the fingerprint sensor" / "Use password".
 *  7.0d wrong password — Error banner with attempts left (5 total); 7.0e after 5 — Security banner, 15-min countdown,
 *       "Reset password".  7.0i shows both biometric buttons.
 * Demo (no API): password 123456 → Home; biometric scans are not recognised (so 7.0b → 7.0f can be reviewed).
 * With the API: react-native-biometrics + session token in react-native-keychain; never store the password.
 */
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, Avatar, Banner, BottomSheet, Button, DividerOr, Icon, Logo, Screen, SwitchAccount, TextField, formatMSS, useCountdown,
} from '../../components';
import { demoAccount } from '../../mock/account';
import { maskPhone } from '../../utils/mask';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

type Bio = 'faceId' | 'fingerprint';
const k = 'login.7_0';
const BIO_TRIES = 3;

export function WelcomeBackScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '7.0'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const bios: Bio[] = route.params?.biometric === 'both' ? ['faceId', 'fingerprint'] : [route.params?.biometric ?? 'faceId'];

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwFailed, setPwFailed] = useState(0);
  const [lockRound, setLockRound] = useState(0);
  const lockLeft = useCountdown(lockRound ? demoAccount.lockSeconds : 0, lockRound);
  const locked = lockRound > 0 && lockLeft > 0;
  const [bioFailed, setBioFailed] = useState<Record<Bio, number>>({ faceId: 0, fingerprint: 0 });
  const [scanning, setScanning] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [last, setLast] = useState<'password' | Bio | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (lockRound > 0 && lockLeft === 0) { setLockRound(0); setPwFailed(0); } }, [lockRound, lockLeft]);

  const home = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  const forgot = () => navigation.navigate('NotBuilt', { screenId: 'Forgot password' });

  const logIn = () => {
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      if (password === demoAccount.password) return home();
      const n = pwFailed + 1;
      setPwFailed(n);
      setLast('password');
      if (n >= demoAccount.loginAttempts) { setLockRound((r) => r + 1); setPassword(''); }
    }, t.states.motion.mockRequest);
  };

  const failBio = (b: Bio) => {
    setBioFailed((f) => ({ ...f, [b]: f[b] + 1 }));
    setLast(b);
    if (b === 'fingerprint' && bioFailed.fingerprint + 1 >= BIO_TRIES) setSheet(false);
  };
  const startBio = (b: Bio) => {
    if (b === 'fingerprint') { setSheet(true); return; }
    setScanning(true);
    timer.current = setTimeout(() => { setScanning(false); failBio('faceId'); }, t.states.motion.mockRequest * 2);
  };

  const pwLeft = demoAccount.loginAttempts - pwFailed;
  const bioOut = (b: Bio) => bioFailed[b] >= BIO_TRIES;
  const shownBios = bios.filter((b) => !bioOut(b));

  let banner: { type: 'error' | 'security'; text: string } | null = null;
  if (locked) banner = { type: 'security', text: tr('login.7_1.tooMany') };
  else if (last === 'password' && pwFailed > 0) banner = { type: 'error', text: tr(`${k}.wrongPassword`, { count: pwLeft }) };
  else if (last === 'faceId' && bioFailed.faceId > 0) {
    banner = { type: 'error', text: bioOut('faceId') ? tr(`${k}.faceIdOut`) : tr(`${k}.faceIdFail`, { count: BIO_TRIES - bioFailed.faceId }) };
  } else if (last === 'fingerprint' && bioOut('fingerprint')) banner = { type: 'error', text: tr(`${k}.fingerprintOut`) };

  const bioLabel = (b: Bio) => (b === 'faceId'
    ? tr(last === 'faceId' && bioFailed.faceId > 0 ? `${k}.faceIdAgain` : `${k}.faceId`)
    : tr(`${k}.fingerprint`));

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.grow} keyboardShouldPersistTaps="handled">
        <View style={{ paddingTop: t.spacing['spacing/48'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/32'] }}>
          <View style={{ alignSelf: 'flex-start' }}>
            <Logo height={t.sizes.logo.login} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'] }}>
            <Avatar initials={demoAccount.initials} />
            <View style={[styles.flex, { gap: t.spacing['spacing/4'] }]}>
              <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`, { name: demoAccount.firstName })}</AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/6'] }}>
                <Icon name="smartphone" size={t.sizes.icon.sm} color="Neutral/Slate" />
                <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.number`, { number: ltr(maskPhone(demoAccount.phone)), last4: ltr(demoAccount.phone.slice(-4)) })}</AppText>
              </View>
            </View>
          </View>

          <View style={{ gap: t.spacing['spacing/16'] }}>
            {banner ? <Banner type={banner.type} icon={banner.type === 'security' ? 'clock' : undefined} text={banner.text} testID="banner" /> : null}
            <TextField
              label={tr('login.7_1.password')}
              value={password}
              onChangeText={(v) => { setPassword(v); if (last === 'password') setLast(null); }}
              invalid={last === 'password' && pwFailed > 0 && !locked}
              locked={locked}
              trailing="eye"
              autoComplete="current-password"
              textContentType="password"
              testID="password"
            />
            {locked ? null : (
              <Pressable style={{ alignSelf: 'flex-end' }} onPress={forgot} accessibilityRole="link" hitSlop={t.spacing['spacing/12']}>
                {({ pressed }) => (
                  <AppText variant="Body Medium" color="Primary/Red" style={pressed ? styles.underline : undefined}>{tr('login.7_1.forgot')}</AppText>
                )}
              </Pressable>
            )}
          </View>

          {locked ? (
            <View style={{ gap: t.spacing['spacing/16'] }}>
              <Button type="disabled" label={tr('login.7_1.tryAgainIn', { time: ltr(formatMSS(lockLeft)) })} testID="log-in-submit" />
              <Button type="ghost" label={tr('login.7_1.resetPassword')} onPress={forgot} />
            </View>
          ) : (
            <View style={{ gap: t.spacing['spacing/16'] }}>
              <Button type={loading ? 'loading' : password ? 'primary' : 'disabled'} label={tr('login.7_1.logIn')} onPress={logIn} testID="log-in-submit" />
              {shownBios.length ? <DividerOr /> : null}
              {shownBios.map((b) => (
                <Button key={b} type="secondary" icon={b} label={bioLabel(b)} onPress={() => startBio(b)} testID={`bio-${b}`} />
              ))}
            </View>
          )}
        </View>
        <View style={styles.flex} />
        <View style={{ paddingHorizontal: g, paddingBottom: t.spacing['spacing/32'], alignItems: 'center' }}>
          <SwitchAccount onPress={() => navigation.reset({ index: 0, routes: [{ name: '7.1' }] })} />
        </View>
      </ScrollView>

      {/* 7.0a Face ID system prompt (mock; the OS draws it on a phone). */}
      {scanning ? (
        <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: t.colors['Alpha/Ink 25%'] }]} accessibilityLiveRegion="polite">
          <View style={[styles.center, { padding: t.spacing['spacing/24'], gap: t.spacing['spacing/8'], borderRadius: t.radius['radius/xl'], backgroundColor: t.colors['Neutral/White'] }]}>
            <BioMark icon="faceId" />
            <AppText variant="Body Medium">{tr(`${k}.faceIdPrompt`)}</AppText>
          </View>
        </View>
      ) : null}

      {/* 7.0c / 7.0g fingerprint sheet: tap the sensor to scan (demo: not recognised). */}
      <BottomSheet visible={sheet} onClose={() => setSheet(false)}>
        <View style={[styles.center, { gap: t.spacing['spacing/8'] }]}>
          <AppText variant="H3" accessibilityRole="header">{tr(`${k}.fingerprintTitle`)}</AppText>
          <AppText variant="Body" color={bioFailed.fingerprint ? 'Status/Failure/Default' : 'Neutral/Slate'} accessibilityLiveRegion="polite" style={styles.centerText}>
            {bioFailed.fingerprint ? tr(`${k}.fingerprintFail`, { count: BIO_TRIES - bioFailed.fingerprint }) : tr(`${k}.touchSensor`)}
          </AppText>
          <Pressable onPress={() => failBio('fingerprint')} accessibilityRole="button" accessibilityLabel={tr(`${k}.touchSensor`)} testID="fingerprint-sensor">
            <BioMark icon="fingerprint" error={bioFailed.fingerprint > 0} />
          </Pressable>
        </View>
        <Button type="secondary" label={tr(`${k}.usePassword`)} onPress={() => setSheet(false)} testID="use-password" />
      </BottomSheet>
    </Screen>
  );
}

/** Biometric mark: Fog circle (Status/Failure/Light after a miss) with a Primary/Red icon. */
function BioMark({ icon, error }: { icon: Bio; error?: boolean }) {
  const t = useTheme();
  const c = t.sizes.biometric;
  return (
    <View style={[styles.center, { width: c.circle, height: c.circle, borderRadius: t.radius['radius/full'], backgroundColor: t.colors[error ? 'Status/Failure/Light' : 'Neutral/Fog'] }]}>
      <Icon name={icon} size={c.icon} color={error ? 'Status/Failure/Default' : 'Primary/Red'} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  centerText: { textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
});
