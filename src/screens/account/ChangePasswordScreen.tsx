/**
 * 12.3 Change password (doc p.47). Current + new password (eye toggles) and the Figma Password Rule list
 * (same rules and copy as registration 2.1). Save is enabled when the current password is filled and every rule is met.
 * Demo checks: the current password must be the demo one (else error on that field); the new one may not equal it
 * (stands in for "refuses any of the last 4 passwords"). Success → back.
 */
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, PasswordRule, Screen, TextField, TopBar } from '../../components';
import { demoAccount } from '../../mock/account';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.password';

const RULES = [
  { key: 'length', test: (p: string) => p.length >= 8 },
  { key: 'upper', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', test: (p: string) => /\d/.test(p) },
  { key: 'special', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export function ChangePasswordScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.3'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState<{ field: 'current' | 'new'; message: string } | null>(null);
  const allMet = RULES.every((r) => r.test(next));
  const ready = current.length > 0 && allMet;

  const save = () => {
    if (current !== demoAccount.password) return setError({ field: 'current', message: tr(`${k}.wrongCurrent`) });
    if (next === current) return setError({ field: 'new', message: tr(`${k}.reused`) });
    navigation.goBack();
  };

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/16'] }} keyboardShouldPersistTaps="handled">
          <TextField
            label={tr(`${k}.current`)}
            value={current}
            onChangeText={(v) => { setCurrent(v); setError(null); }}
            trailing="eye"
            autoComplete="current-password"
            error={error?.field === 'current' ? error.message : undefined}
            testID="current-password"
          />
          <TextField
            label={tr(`${k}.new`)}
            value={next}
            onChangeText={(v) => { setNext(v); setError(null); }}
            trailing="eye"
            autoComplete="new-password"
            error={error?.field === 'new' ? error.message : undefined}
            testID="new-password"
          />
          <View style={{ gap: t.spacing['spacing/8'] }}>
            {RULES.map((r) => <PasswordRule key={r.key} label={tr(`registration.2_1.rules.${r.key}`)} met={r.test(next)} />)}
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: t.layout.screenGutter, paddingTop: t.spacing['spacing/16'], paddingBottom: t.layout.footerBottom }}>
          <Button type={ready ? 'primary' : 'disabled'} label={tr(`${k}.save`)} onPress={save} testID="save" />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
