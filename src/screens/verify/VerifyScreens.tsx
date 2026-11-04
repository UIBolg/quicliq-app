/**
 * Verify ID and address (Figma page "Verify ID and address" EN 326:36305 / AR 326:36899).
 *  4.0  Raise your sending limit — sheet (transparent modal): Illustration/locked · H3 + body · 2 numbered steps ·
 *       Primary "Get started" → 4.0a · Ghost "Maybe later".
 *  4.0a Before you start — what you'll need (ID, proof of address) → 4.1.
 *  4.1  Hub (stage start / idDone 4.6 / idReview 4.6a / submitted 4.9): close · H1 + body · "x of 2" + bar · 2 HubSteps ·
 *       info note · Primary (Start step 1 → 4.1a / Continue to step 2 → 4.7 / Back to home).
 *  4.1a Choose your ID (passport / licence) → 4.3 · 4.2 camera access (shown when the camera is blocked; web shows it).
 *  4.3  Scan (dark camera mock; auto-captures → 4.4; "Having trouble?" → 4.3a) · 4.3a couldn't read (tips; scan again / manual).
 *  4.4  Review scanned details (locked fields) → hub idDone · 4.5 manual details + ID photo (4.5a–d) → hub idReview.
 *  4.7  Your address (postcode lookup → 4.7a filled; proof of address 4.8–4.8c) → hub submitted.
 * Demo (no API): any postcode looks up SW1A 1AA's address; uploads attach a sample file.
 */
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, Banner, BottomSheet, Button, Icon, IconBadge, IconButton, Illustration, ProgressBar, RadioOption, Screen, StepHeader, TextField,
} from '../../components';
import { demoAddress, demoIdScan, demoUploads, limitLevels } from '../../mock/account';
import { formatMoney } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';
import { MessageLayout } from '../common/MessageLayout';
import { DocCard, DocPreview, HubStep, RemoveSheetBody, UploadSheetBody, type UploadedFile } from './parts';

type P<R extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, R>;
export type HubStage = 'start' | 'idDone' | 'idReview' | 'submitted';
const k = 'verify';

function Footer({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/8'], borderTopWidth: t.stroke['stroke/xs'], borderTopColor: t.colors['Neutral/Fog'] }}>{children}</View>;
}

function NumberedStep({ n, title, hint }: { n: number; title: string; hint: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }}>
      <View style={[styles.center, { width: t.sizes.limitStep.badge, height: t.sizes.limitStep.badge, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/Red 10%'] }]}>
        <AppText variant="Body Medium" color="Primary/Red">{String(n)}</AppText>
      </View>
      <View style={styles.flex}>
        <AppText variant="Body Medium">{title}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">{hint}</AppText>
      </View>
    </View>
  );
}

/** 4.0 — sheet over the previous screen. */
export function RaiseLimitScreen({ navigation }: P<'4.0'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <BottomSheet visible onClose={() => navigation.goBack()}>
      <View style={{ alignItems: 'center' }}><Illustration name="locked" size={t.sizes.illustration.small} /></View>
      <View style={{ gap: t.spacing['spacing/8'] }}>
        <AppText variant="H3" accessibilityRole="header" style={styles.centerText}>{tr(`${k}.4_0.title`)}</AppText>
        <AppText variant="Body" color="Neutral/Slate" style={styles.centerText}>{tr(`${k}.4_0.body`, { amount: formatMoney(limitLevels[1].total ?? 0) })}</AppText>
      </View>
      <View style={{ gap: t.spacing['spacing/12'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
        <NumberedStep n={1} title={tr(`${k}.steps.id`)} hint={tr(`${k}.steps.idHint`)} />
        <NumberedStep n={2} title={tr(`${k}.steps.address`)} hint={tr(`${k}.steps.addressHint`)} />
      </View>
      <Button label={tr(`${k}.4_0.start`)} onPress={() => navigation.replace('4.0a')} testID="get-started" />
      <Button type="ghost" label={tr(`${k}.4_0.later`)} onPress={() => navigation.goBack()} />
    </BottomSheet>
  );
}

/** 4.0a */
export function BeforeYouStartScreen({ navigation }: P<'4.0a'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const kk = `${k}.4_0a`;
  const group = (title: string, items: string[], note: string, icon: 'idCard' | 'home') => (
    <View style={{ gap: t.spacing['spacing/8'] }}>
      <AppText variant="H3">{title}</AppText>
      <View style={{ gap: t.spacing['spacing/8'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
        {items.map((it) => (
          <View key={it} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
            <IconBadge icon={icon} size={32} tone="white" />
            <AppText variant="Body Medium">{it}</AppText>
          </View>
        ))}
      </View>
      <AppText variant="Caption" color="Neutral/Slate">{note}</AppText>
    </View>
  );
  return (
    <Screen>
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, alignItems: 'flex-start' }}>
        <IconButton icon="x" surface accessibilityLabel={tr(`${k}.4_1.close`)} onPress={() => navigation.goBack()} />
      </View>
      <ScrollView style={styles.flex} contentContainerStyle={{ padding: t.layout.screenGutter, gap: t.spacing['spacing/24'] }}>
        <IconBadge icon="file" size={56} tone="redTint" />
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H1" accessibilityRole="header">{tr(`${kk}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${kk}.body`)}</AppText>
        </View>
        {group(tr(`${kk}.id`), tr(`${kk}.idItems`, { returnObjects: true }) as string[], tr(`${kk}.idNote`), 'idCard')}
        {group(tr(`${kk}.address`), tr(`${kk}.addressItems`, { returnObjects: true }) as string[], tr(`${kk}.addressNote`), 'home')}
      </ScrollView>
      <Footer>
        <Button label={tr(`${kk}.ready`)} onPress={() => navigation.replace('4.1', { stage: 'start' })} testID="ready" />
        <Button type="ghost" label={tr(`${kk}.later`)} onPress={() => navigation.goBack()} />
      </Footer>
    </Screen>
  );
}

/** 4.1 / 4.6 / 4.6a / 4.9 */
export function VerificationHubScreen({ navigation, route }: P<'4.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const stage: HubStage = route.params?.stage ?? 'start';
  const kk = `${k}.4_1`;
  const done = { start: 0, idDone: 1, idReview: 1, submitted: 2 }[stage];
  const progress = stage === 'idReview' ? tr(`${kk}.submitted1`) : stage === 'submitted' ? tr(`${kk}.submitted2`) : tr(`${kk}.progress`, { done });
  const note = { start: 'noteStart', idDone: 'noteIdDone', idReview: 'noteIdReview', submitted: 'noteDone' }[stage];
  const home = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  return (
    <Screen>
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, alignItems: 'flex-start' }}>
        <IconButton icon="x" surface accessibilityLabel={tr(`${kk}.close`)} onPress={home} testID="close" />
      </View>
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/24'] }}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H1" accessibilityRole="header">{tr(`${kk}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${kk}.body`)}</AppText>
        </View>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="Body Medium">{progress}</AppText>
          <ProgressBar value={done} max={2} size="sm" tone="onTint" accessibilityLabel={progress} />
        </View>
        <View style={{ gap: t.spacing['spacing/16'] }}>
          <HubStep
            n={1}
            title={tr(`${k}.steps.id`)}
            hint={tr(`${k}.steps.${stage === 'idReview' ? 'idReview' : 'idHint'}`)}
            status={tr(`${k}.status.${stage === 'start' ? 'notStarted' : stage === 'idReview' ? 'inReview' : 'completed'}`)}
            state={stage === 'start' ? 'current' : 'done'}
          />
          <HubStep
            n={2}
            title={tr(`${k}.steps.address`)}
            hint={tr(`${k}.steps.${stage === 'start' ? 'addressLocked' : stage === 'submitted' ? 'addressReview' : 'addressHint'}`)}
            status={stage === 'start' ? undefined : tr(`${k}.status.${stage === 'submitted' ? 'inReview' : 'inProgress'}`)}
            state={stage === 'start' ? 'locked' : stage === 'submitted' ? 'done' : 'current'}
          />
        </View>
        <Banner type="info" text={tr(`${kk}.${note}`)} />
      </ScrollView>
      <Footer>
        {stage === 'start' ? <Button label={tr(`${kk}.start1`)} onPress={() => navigation.navigate('4.1a')} testID="start-1" />
          : stage === 'submitted' ? <Button label={tr(`${kk}.done`)} onPress={home} testID="hub-done" />
          : <Button label={tr(`${kk}.start2`)} onPress={() => navigation.navigate('4.7', { from: stage })} testID="start-2" />}
      </Footer>
    </Screen>
  );
}

/** 4.1a */
export function ChooseIdScreen({ navigation }: P<'4.1a'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [doc, setDoc] = useState<'passport' | 'licence'>('passport');
  const kk = `${k}.4_1a`;
  return (
    <Screen>
      <StepHeader step={1} total={2} title={tr(`${kk}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        <AppText variant="Body Large" color="Neutral/Slate">{tr(`${kk}.body`)}</AppText>
        <View accessibilityRole="radiogroup" style={{ gap: t.spacing['spacing/12'] }}>
          <RadioOption icon="idCard" title={tr(`${kk}.passport`)} subtitle={tr(`${kk}.passportHint`)} selected={doc === 'passport'} onPress={() => setDoc('passport')} testID="doc-passport" />
          <RadioOption icon="card" title={tr(`${kk}.licence`)} subtitle={tr(`${kk}.licenceHint`)} selected={doc === 'licence'} onPress={() => setDoc('licence')} testID="doc-licence" />
        </View>
      </ScrollView>
      <Footer>
        {/* No camera on web/preview → 4.2 first (the app asks the OS for permission on phones). */}
        <Button label={tr(`${kk}.continue`)} onPress={() => navigation.navigate(Platform.OS === 'web' ? '4.2' : '4.3', { doc })} testID="choose-continue" />
      </Footer>
    </Screen>
  );
}

/** 4.2 */
export function CameraAccessScreen({ navigation, route }: P<'4.2'>) {
  const { t: tr } = useTranslation();
  return (
    <MessageLayout
      illustration={<Illustration name="cameraOff" />}
      title={tr(`${k}.4_2.title`)}
      body={tr(`${k}.4_2.body`)}
      contentPadTop="spacing/40"
      footer={
        <>
          <Button label={tr(`${k}.4_2.settings`)} onPress={() => navigation.replace('4.3', route.params)} testID="open-settings" />
          <Button type="ghost" label={tr(`${k}.4_2.manual`)} onPress={() => navigation.replace('4.5')} />
        </>
      }
    />
  );
}

/** 4.3 — camera mock: dark screen, ID frame, auto capture. */
export function ScanIdScreen({ navigation, route }: P<'4.3'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    timer.current = setTimeout(() => navigation.replace('4.4'), t.states.motion.mockRequest * 4);
    return () => clearTimeout(timer.current);
  }, [navigation, t.states.motion.mockRequest]);
  const licence = route.params?.doc === 'licence';
  return (
    <Screen background="Neutral/Ink" statusBar="light">
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, alignItems: 'flex-start' }}>
        <IconButton icon="x" surface accessibilityLabel={tr(`${k}.4_1.close`)} onPress={() => navigation.goBack()} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', padding: t.layout.screenGutter, gap: t.spacing['spacing/24'] }}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H3" color="Neutral/White" accessibilityRole="header" style={styles.centerText}>{tr(licence ? `${k}.4_3.titleLicence` : `${k}.4_3.title`)}</AppText>
          <AppText variant="Body" color="Alpha/White 80%" style={styles.centerText}>{tr(`${k}.4_3.body`)}</AppText>
        </View>
        <View style={[styles.center, { aspectRatio: licence ? t.sizes.paymentCard.aspect : t.sizes.scanFrame.passport, borderRadius: t.radius['radius/lg'], borderWidth: t.stroke['stroke/xl'], borderColor: t.colors['Neutral/White'], borderStyle: 'dashed' }]}>
          <Icon name="scan" size={t.sizes.biometric.icon} color="Alpha/White 80%" />
        </View>
        <View style={{ alignSelf: 'center', paddingHorizontal: t.spacing['spacing/12'], paddingVertical: t.spacing['spacing/4'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 20%'] }} accessibilityLiveRegion="polite">
          <AppText variant="Body Medium" color="Neutral/White">{tr(`${k}.4_3.hold`)}</AppText>
        </View>
      </View>
      <View style={{ paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/40'], alignItems: 'center' }}>
        <Pressable onPress={() => { clearTimeout(timer.current); navigation.replace('4.3a', route.params); }} accessibilityRole="link" hitSlop={t.spacing['spacing/12']} testID="trouble">
          <AppText variant="Body Medium" color="Neutral/White" style={styles.underline}>{tr(`${k}.4_3.trouble`)}</AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

/** 4.3a */
export function ScanFailedScreen({ navigation, route }: P<'4.3a'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const icons = ['file', 'sun', 'focus', 'smartphone'] as const;
  return (
    <MessageLayout
      illustration={<Illustration name="error" />}
      title={tr(`${k}.4_3a.title`)}
      body={tr(`${k}.4_3a.body`)}
      contentPadTop="spacing/40"
      footer={
        <>
          <Button label={tr(`${k}.4_3a.again`)} onPress={() => navigation.replace('4.3', route.params)} testID="scan-again" />
          <Button type="ghost" label={tr(`${k}.4_3a.manual`)} onPress={() => navigation.replace('4.5')} testID="manual" />
        </>
      }
    >
      <View style={{ gap: t.spacing['spacing/16'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
        {(tr(`${k}.4_3a.tips`, { returnObjects: true }) as string[]).map((tip, i) => (
          <View key={tip} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
            <IconBadge icon={icons[i]} size={32} tone="white" />
            <AppText variant="Body Medium" style={styles.flex}>{tip}</AppText>
          </View>
        ))}
      </View>
    </MessageLayout>
  );
}

const ID_FIELDS = ['title', 'first', 'middle', 'last', 'birthCountry', 'birthDate', 'idType', 'idNumber', 'issuer', 'expiry'] as const;
const PICKERS = new Set(['title', 'birthCountry', 'idType', 'issuer']);
const DATES = new Set(['birthDate', 'expiry']);

/** 4.4 */
export function ReviewDetailsScreen({ navigation }: P<'4.4'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <Screen>
      <StepHeader step={1} total={2} title={tr(`${k}.stepId`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
        <Banner type="success" text={tr(`${k}.4_4.banner`)} />
        {ID_FIELDS.map((f) => <TextField key={f} label={tr(`${k}.fields.${f}`)} value={demoIdScan[f]} locked ltrValue={f === 'idNumber'} testID={`id-${f}`} />)}
      </ScrollView>
      <Footer>
        <Button label={tr(`${k}.4_4.confirm`)} onPress={() => navigation.popTo('4.1', { stage: 'idDone' })} testID="confirm-details" />
      </Footer>
    </Screen>
  );
}

/** 4.5 / 4.5a–d */
export function ManualDetailsScreen({ navigation }: P<'4.5'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [v, setV] = useState<Record<string, string>>({});
  const [file, setFile] = useState<UploadedFile>(null);
  const [sheet, setSheet] = useState<'upload' | 'remove' | null>(null);
  const [preview, setPreview] = useState(false);
  const ready = ['first', 'last', 'birthDate', 'idType', 'idNumber', 'expiry'].every((f) => v[f]?.trim()) && !!file;
  return (
    <Screen>
      <StepHeader step={1} total={2} title={tr(`${k}.stepId`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
        <Banner type="info" text={tr(`${k}.4_5.banner`)} />
        {ID_FIELDS.map((f) => (
          <TextField
            key={f}
            label={tr(`${k}.fields.${f}`)}
            value={v[f] ?? ''}
            onChangeText={(x) => setV((p) => ({ ...p, [f]: x }))}
            trailing={PICKERS.has(f) ? 'chevron' : DATES.has(f) ? 'calendar' : 'none'}
            ltrValue={f === 'idNumber' || DATES.has(f)}
            testID={`manual-${f}`}
          />
        ))}
        <DocCard
          title={tr(`${k}.4_5.photo`)}
          hint={tr(`${k}.4_5.photoHint`)}
          file={file}
          uploadLabel={tr(`${k}.4_5.upload`)}
          onUpload={() => setSheet('upload')}
          onPreview={() => setPreview(true)}
          onRemove={() => setSheet('remove')}
        />
      </ScrollView>
      <Footer>
        <Button type={ready ? 'primary' : 'disabled'} label={tr(`${k}.4_5.submit`)} onPress={() => navigation.popTo('4.1', { stage: 'idReview' })} testID="manual-submit" />
      </Footer>
      <BottomSheet visible={!!sheet} onClose={() => setSheet(null)}>
        {sheet === 'upload' ? <UploadSheetBody kind="id" onClose={() => setSheet(null)} onPick={() => { setFile(demoUploads.id); setSheet(null); }} />
          : sheet === 'remove' ? <RemoveSheetBody kind="id" onRemove={() => { setFile(null); setSheet(null); }} onKeep={() => setSheet(null)} /> : null}
      </BottomSheet>
      <DocPreview kind="id" file={file} visible={preview} onClose={() => setPreview(false)} onReplace={() => { setPreview(false); setSheet('upload'); }} />
    </Screen>
  );
}

/** 4.7 / 4.7a / 4.8–4.8c */
export function AddressScreen({ navigation }: P<'4.7'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [postcode, setPostcode] = useState('');
  const [found, setFound] = useState(false);
  const [a, setA] = useState({ county: '', city: '', line1: '', line2: '' });
  const [file, setFile] = useState<UploadedFile>(null);
  const [sheet, setSheet] = useState<'upload' | 'remove' | null>(null);
  const [preview, setPreview] = useState(false);
  // Demo lookup: a full UK postcode fills the address (4.7 → 4.7a).
  useEffect(() => {
    if (!found && /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode.trim())) {
      setFound(true);
      setA({ county: demoAddress.county, city: demoAddress.city, line1: demoAddress.line1, line2: '' });
    }
  }, [postcode, found]);
  const ready = found && !!a.line1.trim() && !!file;
  return (
    <Screen>
      <StepHeader step={2} total={2} title={tr(`${k}.stepAddress`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
        <TextField label={tr(`${k}.fields.postcode`)} value={postcode} onChangeText={(x) => setPostcode(x.toUpperCase())} helper={tr(`${k}.fields.postcodeHelper`)} autoCapitalize="characters" autoComplete="postal-code" ltrValue testID="postcode" />
        <TextField label={tr(`${k}.fields.country`)} value={demoAddress.country} locked />
        <TextField label={tr(`${k}.fields.county`)} value={a.county} onChangeText={(x) => setA((p) => ({ ...p, county: x }))} trailing="chevron" ltrValue testID="county" />
        <TextField label={tr(`${k}.fields.city`)} value={a.city} onChangeText={(x) => setA((p) => ({ ...p, city: x }))} trailing="chevron" ltrValue testID="city" />
        <TextField label={tr(`${k}.fields.line1`)} value={a.line1} onChangeText={(x) => setA((p) => ({ ...p, line1: x }))} autoComplete="address-line1" ltrValue testID="line1" />
        <TextField label={tr(`${k}.fields.line2`)} placeholder={tr(`${k}.fields.line2Placeholder`)} value={a.line2} onChangeText={(x) => setA((p) => ({ ...p, line2: x }))} autoComplete="address-line2" ltrValue testID="line2" />
        <DocCard
          title={tr(`${k}.4_7.proof`)}
          hint={tr(`${k}.4_7.proofHint`)}
          file={file}
          uploadLabel={tr(`${k}.4_7.uploadDoc`)}
          onUpload={() => setSheet('upload')}
          onPreview={() => setPreview(true)}
          onRemove={() => setSheet('remove')}
        />
      </ScrollView>
      <Footer>
        <Button type={ready ? 'primary' : 'disabled'} label={tr(`${k}.4_7.continue`)} onPress={() => navigation.popTo('4.1', { stage: 'submitted' })} testID="address-continue" />
      </Footer>
      <BottomSheet visible={!!sheet} onClose={() => setSheet(null)}>
        {sheet === 'upload' ? <UploadSheetBody kind="address" onClose={() => setSheet(null)} onPick={() => { setFile(demoUploads.address); setSheet(null); }} />
          : sheet === 'remove' ? <RemoveSheetBody kind="address" onRemove={() => { setFile(null); setSheet(null); }} onKeep={() => setSheet(null)} /> : null}
      </BottomSheet>
      <DocPreview kind="address" file={file} visible={preview} onClose={() => setPreview(false)} onReplace={() => { setPreview(false); setSheet('upload'); }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  centerText: { textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
});

