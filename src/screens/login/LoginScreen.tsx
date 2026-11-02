/**
 * 7.1 Login (EN 82:9641) and 7.1b Login — email (138:3251); loading state 7.2 (82:9664) / 7.2e (220:6427).
 *
 * Layout (Figma): Content pt spacing/48, gutter spacing/24, pb spacing/24, gap spacing/32 —
 * Logo (login size), Heading (H1 + Body Large Slate, gap spacing/8), Login Method,
 * Form (gap spacing/16, end-aligned: Phone row or Email field, Password field with eye, "Forgot password?"
 * Body Medium Primary/Red), Actions (Primary "Log in"). Flexible spacer. Footer pt spacing/16, pb spacing/32:
 * "Don't have an account? Sign up" centred (Body Slate + Body Medium Primary/Red link).
 *
 * No backend yet: "Log in" shows the Loading button (7.2 / 7.2e), then goes to the code-entry step
 * (7.2a by text / 7.2b by email).
 */
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, LoginMethod, Logo, PhoneField, Screen, TextField, type LoginMethodValue } from '../../components';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

export function LoginScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '7.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [method, setMethod] = useState<LoginMethodValue>(route.params?.method ?? 'mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const k = 'login.7_1';
  const g = t.layout.screenGutter;

  const logIn = () => {
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      if (method === 'mobile') navigation.navigate('7.2a', { phone: mobile || undefined });
      else navigation.navigate('7.2b', { email: email || undefined });
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
              {method === 'mobile' ? (
                <PhoneField label={tr(`${k}.mobile`)} value={mobile} onChangeText={setMobile} testID="mobile" />
              ) : (
                <TextField
                  label={tr(`${k}.email`)}
                  value={email}
                  onChangeText={setEmail}
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
                onChangeText={setPassword}
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

            <Button type={loading ? 'loading' : 'primary'} label={tr(`${k}.logIn`)} onPress={logIn} testID="log-in-submit" />
          </View>

          <View style={styles.flex} />

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
