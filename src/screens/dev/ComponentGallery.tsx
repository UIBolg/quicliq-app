/**
 * Component gallery (dev) — every Figma component and variant, with an EN/AR switch
 * that flips the whole gallery to RTL. Sections are added group by group in Phase 2.
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useState, type ReactNode } from 'react';
import {
  Agreement, AppText, Avatar, Button, Checkbox, CountryPrefix, DividerOr, Flag, Icon, IconBadge, IconButton, LoginMethod, Logo,
  iconNames, isDirectionalIcon,
  CodeError, CodeInput, ProgressBar, RecipientTile, SectionHeader, TabBar, TransferRow, OnboardingScene, OtpDigit, Pagination, ResendCountdown, useCountdown, PasswordRule, PhoneField, RadioOption, SheetGrabber, SheetHeader, SwitchAccount, TextField, VerifiedTag,
  type ButtonType, type LoginMethodValue, type TextFieldState,
} from '../../components';
import { useTheme, type IconBadgeSize } from '../../theme';

function Section({ title, node, children }: { title: string; node: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: t.spacing['spacing/12'] }}>
      <View style={{ gap: t.spacing['spacing/2'] }}>
        <AppText variant="H3">{title}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">Figma {node}</AppText>
      </View>
      {children}
    </View>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <AppText variant="Overline" color="Neutral/Slate">{children}</AppText>;
}

const BUTTON_TYPES: ButtonType[] = ['primary', 'secondary', 'ghost', 'tonal', 'disabled', 'loading'];
const BADGES: { size: IconBadgeSize; tone: 'white' | 'redTint' | 'success' | 'grey'; icon: 'user' | 'type' | 'check' | 'message' | 'edit' }[] = [
  { size: 40, tone: 'white', icon: 'user' },
  { size: 32, tone: 'white', icon: 'type' },
  { size: 72, tone: 'redTint', icon: 'user' },
  { size: 20, tone: 'success', icon: 'check' },
  { size: 56, tone: 'success', icon: 'check' },
  { size: 40, tone: 'grey', icon: 'message' },
  { size: 40, tone: 'redTint', icon: 'edit' },
  { size: 44, tone: 'white', icon: 'user' },
];

const FIELD_STATES: TextFieldState[] = ['default', 'filled', 'focused', 'error', 'locked'];

/** Short timer so reviewers see the Unlocked state; screens use 59 s (build doc 2.4). */
const RESEND_DEMO_SECONDS = 10;

/** Group 3 — Code entry. Static Figma states + a live code input (123456 = correct). */
function CodeEntryGroup() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'error' | 'success' | undefined>();
  const [attempts, setAttempts] = useState(3);
  const [round, setRound] = useState(0);
  const total = RESEND_DEMO_SECONDS;
  const left = useCountdown(total, round);
  const submit = (c: string) => {
    if (c === '123456') setStatus('success');
    else { setStatus('error'); setAttempts((a) => Math.max(0, a - 1)); }
  };
  const change = (v: string) => { setCode(v); if (status === 'error') setStatus(undefined); };
  const row = { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: t.spacing['spacing/8'] } as const;
  return (
    <>
      <AppText variant="Overline" color="Primary/Red">GROUP 3 · CODE ENTRY</AppText>

      <Section title="OTP Digit" node="280:8044">
        <Label>Empty · Focused · Filled · Error · Success</Label>
        <View style={[row, { direction: 'ltr' }]}>
          <OtpDigit state="empty" />
          <OtpDigit state="focused" />
          <OtpDigit state="filled" value="4" />
          <OtpDigit state="error" value="4" />
          <OtpDigit state="success" value="4" />
        </View>
      </Section>

      <Section title="Code input (6 × OTP Digit)" node="220:6752">
        <Label>Live — 123456 is correct · SMS autofill · native number pad</Label>
        <CodeInput value={code} onChangeText={change} onComplete={submit} status={status} autoFocus={false} testID="code-input" />
        {status === 'error' ? <CodeError message={tr('components.codeError.wrongCode')} attemptsLeft={attempts} /> : null}
      </Section>

      <Section title="Resend Countdown" node="281:9668">
        <Label>Live (short demo timer) · tap to resend when unlocked</Label>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ResendCountdown secondsLeft={left} total={total} onResend={() => setRound((r) => r + 1)} />
          <AppText variant="Body Medium" color="Primary/Red">{tr('components.tryAnotherWay')}</AppText>
        </View>
        <Label>Counting · Unlocked (static)</Label>
        <ResendCountdown secondsLeft={42} total={59} onResend={() => {}} />
        <ResendCountdown secondsLeft={0} total={59} onResend={() => {}} />
      </Section>

      <Section title="Code error box" node="220:6766">
        <CodeError message={tr('components.codeError.wrongCode')} attemptsLeft={2} />
        <CodeError message={tr('components.codeError.wrongCode')} attemptsLeft={1} />
      </Section>

      <Section title="Keypad" node="281:8115">
        <AppText variant="Body" color="Neutral/Slate">{tr('gallery.keypadNote')}</AppText>
      </Section>
    </>
  );
}

/** Group 2 — Forms. Live, interactive examples plus every static Figma state. */
function FormsGroup() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [phone, setPhone] = useState('7700 900123');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('Quicliq1');
  const [privacy, setPrivacy] = useState(false);
  const [fraud, setFraud] = useState(true);
  const [check, setCheck] = useState(true);
  const [method, setMethod] = useState<LoginMethodValue>('mobile');
  const k = 'registration.2_1';
  const rules = [
    { key: 'length', met: pw.length >= 8 },
    { key: 'upper', met: /[A-Z]/.test(pw) },
    { key: 'lower', met: /[a-z]/.test(pw) },
    { key: 'number', met: /[0-9]/.test(pw) },
    { key: 'special', met: /[^A-Za-z0-9]/.test(pw) },
  ];
  const card = { backgroundColor: t.colors['Neutral/Fog'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/md'], gap: t.spacing['spacing/8'] };
  return (
    <>
      <AppText variant="Overline" color="Primary/Red">GROUP 2 · FORMS</AppText>

      <Section title="Text Field" node="21:388">
        <Label>State (static)</Label>
        {FIELD_STATES.map((s) => (
          <TextField
            key={s}
            previewState={s}
            label={tr(`${k}.email`)}
            value={s === 'default' ? '' : 'james.carter@email.com'}
            placeholder={tr(`${k}.email`)}
            locked={s === 'locked'}
            error={s === 'error' ? tr(`${k}.mobileHelper`) : undefined}
          />
        ))}
        <Label>Trailing · eye (live — tap the eye)</Label>
        <TextField label={tr(`${k}.password`)} value={pw} onChangeText={setPw} trailing="eye" />
        <Label>Trailing · calendar / chevron (picker)</Label>
        <TextField label="Date of birth" value="14 / 03 / 1990" trailing="calendar" onPress={() => {}} />
        <TextField label="Nationality" value="" placeholder="Select" trailing="chevron" onPress={() => {}} />
        <Label>Live · empty → focused → filled</Label>
        <TextField label={tr(`${k}.email`)} value={email} onChangeText={setEmail} placeholder={tr(`${k}.email`)} keyboardType="email-address" autoCapitalize="none" />
      </Section>

      <Section title="Country Prefix + mobile" node="281:9863 · Phone 71:1158">
        <CountryPrefix />
        <PhoneField label={tr(`${k}.mobile`)} value={phone} onChangeText={setPhone} helper={tr(`${k}.mobileHelper`)} />
      </Section>

      <Section title="Checkbox" node="21:460">
        <View style={{ flexDirection: 'row', gap: t.spacing['spacing/24'] }}>
          <Checkbox checked={false} accessibilityLabel="Off" />
          <Checkbox checked={check} onChange={setCheck} accessibilityLabel="On" />
        </View>
      </Section>

      <Section title="Agreement" node="281:7794">
        <Agreement document="privacy" checked={privacy} onChange={setPrivacy} onOpenDocument={() => {}} />
        <Agreement document="fraud" checked={fraud} onChange={setFraud} onOpenDocument={() => {}} />
      </Section>

      <Section title="Password Rule" node="281:7369">
        <Label>Live — edit the password field above</Label>
        <View style={card}>
          {rules.map((r) => (
            <PasswordRule key={r.key} label={tr(`${k}.rules.${r.key}`)} met={r.met} />
          ))}
        </View>
      </Section>

      <Section title="Login Method" node="141:4399">
        <LoginMethod value={method} onChange={setMethod} />
      </Section>

      <Section title="Switch Account" node="282:9874">
        <SwitchAccount onPress={() => {}} />
      </Section>
    </>
  );
}

export function ComponentGallery({ onToggleLocale, onShowTokens }: { onToggleLocale: () => void; onShowTokens: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const row = { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: t.spacing['spacing/12'] } as const;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: t.colors['Neutral/White'], direction: t.isRTL ? 'rtl' : 'ltr' }]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.spacing['spacing/8'],
          paddingHorizontal: t.layout.screenGutter,
          paddingVertical: t.spacing['spacing/12'],
          borderBottomWidth: t.stroke['stroke/xs'],
          borderBottomColor: t.colors['Neutral/Silver'],
        }}
      >
        <AppText variant="Title" style={styles.flex}>{tr('gallery.title')}</AppText>
        <Button size="small" type="secondary" label="Tokens" onPress={onShowTokens} />
        <Button size="small" type="primary" label={tr('gallery.switchTo')} onPress={onToggleLocale} testID="locale-toggle" />
      </View>

      <ScrollView contentContainerStyle={{ padding: t.layout.screenGutter, gap: t.spacing['spacing/40'] }}>
        <AppText variant="Overline" color="Primary/Red">ASSETS · EXPORTED FROM FIGMA (SVG)</AppText>

        <Section title={`Icons · ${iconNames.length}`} node="79:2">
          <Label>Neutral/Ink · 24 · ↔ = mirrored in RTL</Label>
          <View style={[row, { gap: t.spacing['spacing/8'] }]}>
            {iconNames.map((name) => (
              <View key={name} style={{ width: t.sizes.gallery.iconCell, alignItems: 'center', gap: t.spacing['spacing/4'] }}>
                <Icon name={name} />
                <AppText variant="Caption" color="Neutral/Slate" numberOfLines={1}>
                  {isDirectionalIcon(name) ? `↔ ${name}` : name}
                </AppText>
              </View>
            ))}
          </View>
          <Label>Recolour · Primary/Red · Status/Success/Default · White on red</Label>
          <View style={row}>
            <Icon name="shield" color="Primary/Red" />
            <Icon name="check" color="Status/Success/Default" />
            <View style={{ backgroundColor: t.colors['Primary/Red'], padding: t.spacing['spacing/8'], borderRadius: t.radius['radius/full'] }}>
              <Icon name="arrowRight" color="Neutral/White" />
            </View>
          </View>
        </Section>

        <Section title="Flags" node="81:9 · 117:1567">
          <View style={row}>
            <Flag country="UK" />
            <Flag country="JO" />
          </View>
        </Section>

        <AppText variant="Overline" color="Primary/Red">GROUP 1 · BASICS</AppText>

        <Section title="Button" node="12:16">
          <Label>Size=Large</Label>
          {BUTTON_TYPES.map((type) => (
            <Button key={type} type={type} label={`${tr('gallery.button')} · ${type}`} onPress={() => {}} />
          ))}
          <Label>Size=Large · leading icon</Label>
          <Button type="secondary" icon="faceId" label={tr('gallery.continue')} onPress={() => {}} />
          <Label>Size=Small</Label>
          <View style={row}>
            {BUTTON_TYPES.map((type) => (
              <Button key={type} size="small" type={type} label={type} onPress={() => {}} />
            ))}
          </View>
          <Label>Size=Small · leading icon (“Edit”)</Label>
          <Button size="small" type="tonal" icon="edit" label={tr('common.edit')} onPress={() => {}} />
        </Section>

        <Section title="Icon Button" node="217:7015">
          <IconButton icon="globe" accessibilityLabel={tr('common.language')} onPress={() => {}} />
        </Section>

        <Section title="Logo" node="32:256">
          <Label>Tone=Brand · full / login / header</Label>
          <View style={row}>
            <Logo />
            <Logo height={t.sizes.logo.login} />
            <Logo height={t.sizes.logo.header} />
          </View>
          <Label>Tone=White</Label>
          <View style={[row, { backgroundColor: t.colors['Primary/Red'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/md'] }]}>
            <Logo tone="white" height={t.sizes.logo.login} />
          </View>
        </Section>

        <Section title="Icon Badge" node="280:6935">
          <View style={[row, { backgroundColor: t.colors['Neutral/Fog'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/md'] }]}>
            {BADGES.map((b) => (
              <View key={`${b.size}-${b.tone}`} style={{ alignItems: 'center', gap: t.spacing['spacing/4'] }}>
                <IconBadge size={b.size} tone={b.tone} icon={b.icon} />
                <AppText variant="Caption" color="Neutral/Slate">{b.size}</AppText>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Avatar" node="280:8449">
          <View style={row}>
            <Avatar initials="JC" size={56} accessibilityLabel={tr('gallery.sampleName')} />
            <Avatar initials="JC" size={44} accessibilityLabel={tr('gallery.sampleName')} />
          </View>
        </Section>

        <Section title="Divider / Or" node="280:8553">
          <DividerOr />
        </Section>

        <Section title="Verified Tag" node="282:9835">
          <VerifiedTag />
        </Section>

        <FormsGroup />

        <CodeEntryGroup />

        <AppText variant="Overline" color="Primary/Red">HOME PATTERNS · CODE ADDITIONS (NOT IN FIGMA)</AppText>

        <Section title="Progress Bar" node="code · sizes.progress">
          <Label>md · default (on Fog)</Label>
          <View style={{ backgroundColor: t.colors['Neutral/Fog'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/md'] }}>
            <ProgressBar value={100} max={800} accessibilityLabel="100 of 800" />
          </View>
          <Label>sm · onBrand (on red) · 0 and 1 of 2</Label>
          <View style={{ backgroundColor: t.colors['Primary/Red'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/md'], gap: t.spacing['spacing/12'] }}>
            <ProgressBar value={0} max={2} size="sm" tone="onBrand" accessibilityLabel="0 of 2" />
            <ProgressBar value={1} max={2} size="sm" tone="onBrand" accessibilityLabel="1 of 2" />
          </View>
        </Section>

        <Section title="Section Header" node="code">
          <SectionHeader title={tr('home.recent')} actionLabel={tr('home.seeAll')} onAction={() => {}} />
        </Section>

        <Section title="Recipient Tile" node="code">
          <View style={{ flexDirection: 'row', gap: t.spacing['spacing/8'] }}>
            <RecipientTile initials="LH" shortName={tr('home.recipientShort.r1')} fullName={tr('home.recipientNames.r1')} actionLabel={tr('home.sendMoney')} onPress={() => {}} />
            <RecipientTile initials="OK" shortName={tr('home.recipientShort.r2')} fullName={tr('home.recipientNames.r2')} actionLabel={tr('home.sendMoney')} onPress={() => {}} />
          </View>
        </Section>

        <Section title="Transfer Row" node="code">
          <View style={{ backgroundColor: t.colors['Neutral/Fog'], borderRadius: t.radius['radius/lg'], paddingHorizontal: t.spacing['spacing/16'] }}>
            <TransferRow name={tr('home.names.t1')} method="bank" methodLabel={tr('home.methods.bank')} date="28 Oct" amount="£250.00" status="delivered" statusLabel={tr('home.status.delivered')} onPress={() => {}} />
            <TransferRow divider name={tr('home.names.t3')} method="cash" methodLabel={tr('home.methods.cash')} date="02 Oct" amount="£75.50" status="processing" statusLabel={tr('home.status.processing')} onPress={() => {}} />
          </View>
        </Section>

        <Section title="Tab Bar" node="code">
          <TabBar
            active="home"
            onSelect={() => {}}
            items={[
              { key: 'home', icon: 'home', label: tr('home.tabs.home') },
              { key: 'send', icon: 'send', label: tr('home.tabs.send') },
              { key: 'history', icon: 'history', label: tr('home.tabs.history') },
              { key: 'profile', icon: 'user', label: tr('home.tabs.profile') },
            ]}
          />
        </Section>

        <AppText variant="Overline" color="Primary/Red">ONBOARDING · SHEETS</AppText>

        <Section title="Pagination" node="12:57">
          {[1, 2, 3, 4].map((step) => <Pagination key={step} step={step} />)}
        </Section>

        <Section title="Onboarding illustration" node="202:6433">
          <OnboardingScene name="sendMoney" />
        </Section>

        <Section title="Sheet Grabber + Sheet Header" node="280:8504 · 282:9973">
          <SheetGrabber />
          <SheetHeader title={tr('onboarding.language.title')} subtitle={tr('onboarding.language.subtitle')} onClose={() => {}} />
        </Section>

        <Section title="Radio Option" node="282:9637">
          <RadioOption title={tr('onboarding.language.en.title')} titleLocale="en" selected={t.locale === 'en'} onPress={() => {}} />
          <RadioOption title={tr('onboarding.language.ar.title')} titleLocale="ar" subtitle={tr('onboarding.language.ar.subtitle')} selected={t.locale === 'ar'} onPress={() => {}} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
