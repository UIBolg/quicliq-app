/**
 * Registration step 1 of 2 — About you (Figma "New registration" EN 102:9413 / AR 102:9414):
 *  1.1 Step Header · intro (Body Large Slate) · First / Middle (optional) / Last name · Date of birth (opens 1.1b wheel
 *      sheet; helper "You must be 18 or older…") · Footer Primary "Continue" (disabled until name + date are filled).
 *  1.2 errors under the fields (letters only; 18+) · 1.3 ready · 1.3a checking (Loading button + "not a credit check" note).
 *  Results as bottom sheets: 1.5 matched (summary + Matched tag → 2.1) · 1.6 couldn't confirm (things to check,
 *  "Edit my details") · 1.7 account exists (Log in → 7.1, Reset password).
 * Demo (no API): James Carter 14/03/1990 already has an account (1.7); last name "Unknown" isn't on record (1.6);
 * anything else matches (1.5).
 */
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, Button, DateWheel, IconBadge, Screen, SheetHeader, StepHeader, TextField, VerifiedTag, type DateParts } from '../../components';
import { demoIdentity } from '../../mock/account';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';
import { FooterNote, NAME_RE, SheetHeading, ThingsToCheck, longDate, monthNames } from './parts';

const k = 'registration.1_1';
const pad = (n: number) => String(n).padStart(2, '0');
const age = (d: DateParts) => {
  const now = new Date();
  let a = now.getFullYear() - d.y;
  if (now.getMonth() + 1 < d.m || (now.getMonth() + 1 === d.m && now.getDate() < d.d)) a -= 1;
  return a;
};

export function AboutYouScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '1.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const [v, setV] = useState({ first: '', middle: '', last: '' });
  const [dob, setDob] = useState<DateParts | null>(null);
  const [wheel, setWheel] = useState<DateParts>({ d: 1, m: 1, y: 1990 });
  const [picker, setPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'matched' | 'unknown' | 'exists' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const set = (f: keyof typeof v) => (text: string) => setV((p) => ({ ...p, [f]: text }));
  const nameErr = (s: string, required: boolean) => {
    if (!submitted) return undefined;
    if (!s.trim()) return required ? tr(`${k}.errors.required`) : undefined;
    return NAME_RE.test(s.trim()) ? undefined : tr(`${k}.errors.letters`);
  };
  const errs = { first: nameErr(v.first, true), middle: nameErr(v.middle, false), last: nameErr(v.last, true), dob: submitted && dob && age(dob) < 18 ? tr(`${k}.errors.age`) : undefined };
  const ready = !!(v.first.trim() && v.last.trim() && dob);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 99 + i);

  const submit = () => {
    setSubmitted(true);
    const bad = [v.first, v.last].some((s) => !NAME_RE.test(s.trim())) || (v.middle.trim() && !NAME_RE.test(v.middle.trim())) || !dob || age(dob) < 18;
    if (bad) return;
    setChecking(true);
    timer.current = setTimeout(() => {
      setChecking(false);
      const n = (s: string) => s.trim().toLowerCase();
      const dd = dob ? `${pad(dob.d)}${pad(dob.m)}${dob.y}` : '';
      if (n(v.first) === n(demoIdentity.first) && n(v.last) === n(demoIdentity.last) && dd === demoIdentity.dob) setResult('exists');
      else if (n(v.last) === 'unknown') setResult('unknown');
      else setResult('matched');
    }, t.states.motion.mockRequest * 2);
  };

  const fullName = [v.first, v.middle, v.last].map((s) => s.trim()).filter(Boolean).join(' ');
  const goStep2 = () => {
    setResult(null);
    navigation.navigate('2.1', { firstName: v.first.trim(), fullName });
  };

  return (
    <Screen>
      <StepHeader step={1} total={2} title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
        <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.intro`)}</AppText>
        <TextField label={tr(`${k}.first`)} value={v.first} onChangeText={set('first')} error={errs.first} autoComplete="given-name" testID="first-name" />
        <TextField label={tr(`${k}.middle`)} value={v.middle} onChangeText={set('middle')} error={errs.middle} autoComplete="additional-name" testID="middle-name" />
        <TextField label={tr(`${k}.last`)} value={v.last} onChangeText={set('last')} error={errs.last} autoComplete="family-name" testID="last-name" />
        <TextField
          label={tr(`${k}.dob`)}
          value={dob ? `${pad(dob.d)} / ${pad(dob.m)} / ${dob.y}` : ''}
          placeholder={tr(`${k}.dobFormat`)}
          trailing="calendar"
          ltrValue
          helper={tr(`${k}.dobHelper`)}
          error={errs.dob}
          onPress={() => { if (dob) setWheel(dob); setPicker(true); }}
          testID="dob"
        />
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'], gap: t.spacing['spacing/16'] }}>
        {checking ? <FooterNote text={tr(`${k}.creditNote`)} /> : null}
        <Button type={checking ? 'loading' : ready ? 'primary' : 'disabled'} label={tr('common.continue')} onPress={submit} testID="continue" />
      </View>

      {/* 1.1b date of birth */}
      <BottomSheet visible={picker} onClose={() => setPicker(false)}>
        <SheetHeader title={tr(`${k}.dob`)} onClose={() => setPicker(false)} />
        <DateWheel
          value={wheel}
          onChange={setWheel}
          years={years}
          monthNames={monthNames(t.locale)}
          labels={{ day: tr(`${k}.day`), month: tr(`${k}.month`), year: tr(`${k}.year`) }}
        />
        <Button label={tr('common.done')} onPress={() => { setDob(wheel); setPicker(false); }} testID="dob-done" />
      </BottomSheet>

      {/* 1.5 / 1.6 / 1.7 */}
      <BottomSheet visible={!!result} onClose={() => setResult(null)}>
        {result === 'matched' ? (
          <>
            <SheetHeading illustration="success" title={tr(`${k}.matched.title`)} body={tr(`${k}.matched.body`)} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
              <IconBadge icon="user" size={40} tone="redTint" />
              <View style={styles.flex}>
                <AppText variant="Body Medium">{fullName}</AppText>
                <AppText variant="Caption" color="Neutral/Slate">{dob ? ltr(longDate(t.locale, dob.d, dob.m, dob.y)) : ''}</AppText>
              </View>
              <VerifiedTag label={tr(`${k}.matched.tag`)} />
            </View>
            <Button label={tr('common.continue')} onPress={goStep2} testID="matched-continue" />
          </>
        ) : result === 'unknown' ? (
          <>
            <SheetHeading illustration="error" title={tr(`${k}.unknown.title`)} body={tr(`${k}.unknown.body`)} />
            <ThingsToCheck title={tr('registration.thingsToCheck')} items={tr(`${k}.unknown.checks`, { returnObjects: true }) as string[]} />
            <Button label={tr(`${k}.unknown.edit`)} onPress={() => setResult(null)} testID="edit-details" />
          </>
        ) : result === 'exists' ? (
          <>
            <SheetHeading illustration="idCard" title={tr(`${k}.exists.title`)} body={tr(`${k}.exists.body`)} />
            <Button label={tr('login.7_1.logIn')} onPress={() => navigation.reset({ index: 0, routes: [{ name: '7.1' }] })} testID="exists-login" />
            <Button type="secondary" label={tr('login.7_1.resetPassword')} onPress={() => { setResult(null); navigation.navigate('NotBuilt', { screenId: 'Forgot password' }); }} />
          </>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
