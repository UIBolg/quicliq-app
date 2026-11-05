/** Verify ID and address (4.0–4.9): raise-limit sheet, before you start, hub (4 stages), choose ID, camera access, scan,
 *  couldn't read, review scan, manual entry + ID photo, address + proof of address. */
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAddress, demoIdScan, demoUploads, limitLevels } from '@shared/mock/account';
import { formatMoney } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RadioGroup, RadioOption } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Illustration } from '@/components/Art';
import { Icon, type IconName } from '@/components/Icon';
import { Banner, IconBadge, IconButton, Screen, TextField } from '@/components/quicliq';
import { Footer, MessageLayout, StepHeader } from '@/components/forms';
import { cn } from '@/lib/utils';

const k = 'verify';
type Stage = 'start' | 'idDone' | 'idReview' | 'submitted';
type File = { name: string; size: string } | null;

function CloseBar() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return <div className="flex px-4 pt-2"><IconButton plain icon="x" label={t(`${k}.4_1.close`)} onClick={() => nav('/home?level=1')} /></div>;
}
function NumberedStep({ n, title, hint }: { n: number; title: string; hint: string }) {
  return <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-red-10 text-body-md text-red">{n}</span><div className="flex flex-col"><span className="text-body-md">{title}</span><span className="text-caption text-slate">{hint}</span></div></div>;
}

/** 4.0 Raise your sending limit — shown as a sheet over Home. */
export function RaiseLimitSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t(`${k}.4_0.title`)}>
        <div className="flex justify-center"><Illustration name="locked" size={144} /></div>
        <div className="flex flex-col gap-2 text-center"><h2 className="text-h3">{t(`${k}.4_0.title`)}</h2><p className="text-body text-slate">{t(`${k}.4_0.body`, { amount: formatMoney(limitLevels[1].total ?? 0) })}</p></div>
        <div className="flex flex-col gap-3 rounded-lg bg-fog p-4"><NumberedStep n={1} title={t(`${k}.steps.id`)} hint={t(`${k}.steps.idHint`)} /><NumberedStep n={2} title={t(`${k}.steps.address`)} hint={t(`${k}.steps.addressHint`)} /></div>
        <Button onClick={() => { onOpenChange(false); nav('/verify/start'); }}>{t(`${k}.4_0.start`)}</Button>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>{t(`${k}.4_0.later`)}</Button>
      </SheetContent>
    </Sheet>
  );
}

/** 4.0a */
export function BeforeYouStart() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const kk = `${k}.4_0a`;
  const group = (title: string, items: string[], note: string, icon: IconName) => (
    <div className="flex flex-col gap-2">
      <h2 className="text-h3">{title}</h2>
      <div className="flex flex-col gap-2 rounded-lg bg-fog p-4">{items.map((it) => <p key={it} className="flex items-center gap-2 text-body-md"><IconBadge icon={icon} size={32} tone="white" />{it}</p>)}</div>
      <p className="text-caption text-slate">{note}</p>
    </div>
  );
  return (
    <Screen footer={<Footer border><Button onClick={() => nav('/verify/hub', { replace: true })}>{t(`${kk}.ready`)}</Button><Button variant="ghost" onClick={() => nav(-1)}>{t(`${kk}.later`)}</Button></Footer>}>
      <CloseBar />
      <div className="flex flex-col gap-6 p-6">
        <IconBadge icon="file" size={56} />
        <div className="flex flex-col gap-2"><h1 className="text-h1">{t(`${kk}.title`)}</h1><p className="text-body-lg text-slate">{t(`${kk}.body`)}</p></div>
        {group(t(`${kk}.id`), t(`${kk}.idItems`, { returnObjects: true }) as string[], t(`${kk}.idNote`), 'idCard')}
        {group(t(`${kk}.address`), t(`${kk}.addressItems`, { returnObjects: true }) as string[], t(`${kk}.addressNote`), 'home')}
      </div>
    </Screen>
  );
}

function HubStep({ n, title, hint, status, state }: { n: number; title: string; hint: string; status?: string; state: 'current' | 'locked' | 'done' }) {
  return (
    <div className={cn('flex items-center gap-4 rounded-lg p-4', state === 'current' ? 'border-2 border-red bg-white' : state === 'locked' ? 'border border-silver bg-fog opacity-70' : 'border border-dark-fog bg-white')}>
      {state === 'done' ? <IconBadge icon="check" size={32} tone="success" /> : <span className={cn('grid size-8 place-items-center rounded-full text-body-md', state === 'current' ? 'bg-red text-white' : 'bg-white text-slate')}>{n}</span>}
      <div className="flex flex-1 flex-col"><span className="text-body-md">{title}</span><span className="text-caption text-slate">{hint}</span></div>
      {state === 'locked' ? <Icon name="lock" size={18} className="text-slate" /> : status ? <span className={cn('rounded-full px-2 text-caption', state === 'done' ? 'bg-success-light text-success' : 'bg-fog text-slate')}>{status}</span> : null}
    </div>
  );
}

/** 4.1 / 4.6 / 4.6a / 4.9 */
export function Hub() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const stage = (q.get('stage') ?? 'start') as Stage;
  const kk = `${k}.4_1`;
  const done = { start: 0, idDone: 1, idReview: 1, submitted: 2 }[stage];
  const progress = stage === 'idReview' ? t(`${kk}.submitted1`) : stage === 'submitted' ? t(`${kk}.submitted2`) : t(`${kk}.progress`, { done });
  const note = { start: 'noteStart', idDone: 'noteIdDone', idReview: 'noteIdReview', submitted: 'noteDone' }[stage];
  return (
    <Screen footer={<Footer>{stage === 'start' ? <Button onClick={() => nav('/verify/choose-id')}>{t(`${kk}.start1`)}</Button> : stage === 'submitted' ? <Button onClick={() => nav('/home?level=1')}>{t(`${kk}.done`)}</Button> : <Button onClick={() => nav(`/verify/address?from=${stage}`)}>{t(`${kk}.start2`)}</Button>}</Footer>}>
      <CloseBar />
      <div className="flex flex-col gap-6 px-4 pt-4 pb-6">
        <div className="flex flex-col gap-2"><h1 className="text-h1">{t(`${kk}.title`)}</h1><p className="text-body-lg text-slate">{t(`${kk}.body`)}</p></div>
        <div className="flex flex-col gap-2"><span className="text-body-md">{progress}</span><Progress value={done * 50} className="h-1.5 bg-fog" /></div>
        <div className="flex flex-col gap-4">
          <HubStep n={1} title={t(`${k}.steps.id`)} hint={t(`${k}.steps.${stage === 'idReview' ? 'idReview' : 'idHint'}`)} status={t(`${k}.status.${stage === 'start' ? 'notStarted' : stage === 'idReview' ? 'inReview' : 'completed'}`)} state={stage === 'start' ? 'current' : 'done'} />
          <HubStep n={2} title={t(`${k}.steps.address`)} hint={t(`${k}.steps.${stage === 'start' ? 'addressLocked' : stage === 'submitted' ? 'addressReview' : 'addressHint'}`)} status={stage === 'start' ? undefined : t(`${k}.status.${stage === 'submitted' ? 'inReview' : 'inProgress'}`)} state={stage === 'start' ? 'locked' : stage === 'submitted' ? 'done' : 'current'} />
        </div>
        <Banner type="info">{t(`${kk}.${note}`)}</Banner>
      </div>
    </Screen>
  );
}

/** 4.1a */
export function ChooseId() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [doc, setDoc] = useState('passport');
  const kk = `${k}.4_1a`;
  return (
    <Screen footer={<Footer><Button onClick={() => nav(`/verify/camera?doc=${doc}`)}>{t(`${kk}.continue`)}</Button></Footer>}>
      <StepHeader step={1} total={2} title={t(`${kk}.title`)} />
      <div className="flex flex-col gap-4 px-4">
        <p className="text-body-lg text-slate">{t(`${kk}.body`)}</p>
        <RadioGroup value={doc} onValueChange={setDoc}>
          <RadioOption value="passport" title={t(`${kk}.passport`)} subtitle={t(`${kk}.passportHint`)} leading={<IconBadge icon="idCard" size={40} />} />
          <RadioOption value="licence" title={t(`${kk}.licence`)} subtitle={t(`${kk}.licenceHint`)} leading={<IconBadge icon="card" size={40} />} />
        </RadioGroup>
      </div>
    </Screen>
  );
}

/** 4.2 */
export function CameraAccess() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  return <MessageLayout illustration={<Illustration name="cameraOff" />} title={t(`${k}.4_2.title`)} body={t(`${k}.4_2.body`)} footer={<>
    <Button onClick={() => nav(`/verify/scan?doc=${q.get('doc') ?? 'passport'}`, { replace: true })}>{t(`${k}.4_2.settings`)}</Button>
    <Button variant="ghost" onClick={() => nav('/verify/manual', { replace: true })}>{t(`${k}.4_2.manual`)}</Button>
  </>} />;
}

/** 4.3 — camera mock, auto-captures. */
export function Scan() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const licence = q.get('doc') === 'licence';
  useEffect(() => { const id = setTimeout(() => nav('/verify/review', { replace: true }), 2400); return () => clearTimeout(id); }, [nav]);
  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <div className="flex px-4 pt-2"><IconButton icon="x" label={t(`${k}.4_1.close`)} onClick={() => nav(-1)} /></div>
      <div className="flex flex-1 flex-col justify-center gap-6 p-6">
        <div className="flex flex-col gap-2 text-center"><h1 className="text-h3">{t(licence ? `${k}.4_3.titleLicence` : `${k}.4_3.title`)}</h1><p className="text-body text-white-80">{t(`${k}.4_3.body`)}</p></div>
        <div className={cn('grid w-full place-items-center rounded-lg border-2 border-dashed border-white', licence ? 'aspect-[1.586]' : 'aspect-[1.42]')}><Icon name="scan" size={48} className="text-white-80" /></div>
        <span className="self-center rounded-full bg-white-20 px-3 py-1 text-body-md">{t(`${k}.4_3.hold`)}</span>
      </div>
      <button onClick={() => nav(`/verify/scan-failed?doc=${q.get('doc') ?? 'passport'}`, { replace: true })} className="cursor-pointer pb-10 text-body-md underline">{t(`${k}.4_3.trouble`)}</button>
    </div>
  );
}

/** 4.3a */
export function ScanFailed() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const icons: IconName[] = ['file', 'sun', 'focus', 'smartphone'];
  return (
    <MessageLayout illustration={<Illustration name="error" />} title={t(`${k}.4_3a.title`)} body={t(`${k}.4_3a.body`)} footer={<>
      <Button onClick={() => nav(`/verify/scan?doc=${q.get('doc') ?? 'passport'}`, { replace: true })}>{t(`${k}.4_3a.again`)}</Button>
      <Button variant="ghost" onClick={() => nav('/verify/manual', { replace: true })}>{t(`${k}.4_3a.manual`)}</Button>
    </>}>
      <div className="flex flex-col gap-4 rounded-lg bg-fog p-4">{(t(`${k}.4_3a.tips`, { returnObjects: true }) as string[]).map((tip, i) => <p key={tip} className="flex items-center gap-2 text-start text-body-md"><IconBadge icon={icons[i]} size={32} tone="white" />{tip}</p>)}</div>
    </MessageLayout>
  );
}

const FIELDS = ['title', 'first', 'middle', 'last', 'birthCountry', 'birthDate', 'idType', 'idNumber', 'issuer', 'expiry'] as const;
function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-16 items-center gap-2 rounded-md border-[1.5px] border-dashed border-silver px-4">
      <span className="flex flex-1 flex-col"><span className="text-caption text-slate">{label}</span><span className="text-body-lg text-slate">{value}</span></span>
      <Icon name="lock" size={18} className="text-slate" />
    </div>
  );
}

/** 4.4 */
export function ReviewDetails() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <Screen footer={<Footer border><Button onClick={() => nav('/verify/hub?stage=idDone', { replace: true })}>{t(`${k}.4_4.confirm`)}</Button></Footer>}>
      <StepHeader step={1} total={2} title={t(`${k}.stepId`)} />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Banner type="success">{t(`${k}.4_4.banner`)}</Banner>
        {FIELDS.map((f) => <LockedField key={f} label={t(`${k}.fields.${f}`)} value={demoIdScan[f]} />)}
      </div>
    </Screen>
  );
}

/* Upload pieces (4.5a–d, 4.8–4.8c) */
function UploadSheet({ kind, open, onOpenChange, onPick }: { kind: 'id' | 'address'; open: boolean; onOpenChange: (o: boolean) => void; onPick: () => void }) {
  const { t } = useTranslation();
  const ku = `${k}.upload`;
  const src: [IconName, string][] = [['camera', 'camera'], ['image', 'gallery'], ['file', 'file']];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t(`${ku}.${kind}Title`)}>
        <div className="flex items-center justify-between"><h2 className="text-h3">{t(`${ku}.${kind}Title`)}</h2><IconButton icon="x" label={t('common.close')} onClick={() => onOpenChange(false)} /></div>
        <p className="text-body text-slate">{t(`${ku}.${kind}Body`)}</p>
        <div className="flex flex-col gap-2 rounded-lg border border-dark-fog p-4">
          <p className="text-body-md">{t(`${ku}.${kind}Accepted`)}</p>
          {(t(`${ku}.${kind}List`, { returnObjects: true }) as string[]).map((d) => <p key={d} className="flex items-center gap-2 text-body"><Icon name="file" size={16} className="text-red" />{d}</p>)}
          <p className="text-caption text-slate">{t(`${ku}.${kind}Rule`)}</p>
        </div>
        <div className="flex flex-col gap-2">{src.map(([icon, key]) => <button key={key} onClick={onPick} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg bg-fog px-4 hover:bg-dark-fog"><IconBadge icon={icon} size={40} /><span className="flex-1 text-start text-body-md">{t(`${ku}.${key}`)}</span><Icon name="chevronRight" size={16} className="text-slate" /></button>)}</div>
        <p className="text-center text-caption text-slate">{t(`${ku}.formats`)}</p>
      </SheetContent>
    </Sheet>
  );
}
function DocCard({ title, hint, file, uploadLabel, onUpload, onPreview, onRemove }: { title: string; hint: string; file: File; uploadLabel: string; onUpload: () => void; onPreview: () => void; onRemove: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-silver bg-white p-4">
      <div className="flex items-center gap-4">
        <span className={cn('grid size-10 place-items-center rounded-full text-white', file ? 'bg-success' : 'bg-red')}><Icon name={file ? 'check' : 'home'} size={20} /></span>
        <div className="flex flex-1 flex-col"><span className="text-body-md">{title}</span><span className="text-caption text-slate" dir={file ? 'ltr' : undefined}>{file ? `${file.name} · ${file.size}` : hint}</span></div>
      </div>
      {file ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="tonal" size="sm" onClick={onPreview}><Icon name="eye" size={16} />{t(`${k}.upload.preview`)}</Button>
          <Button variant="tonal" size="sm" onClick={onUpload}><Icon name="refresh" size={16} />{t(`${k}.upload.replace`)}</Button>
          <Button variant="tonal" size="sm" onClick={onRemove}><Icon name="trash" size={16} />{t(`${k}.upload.remove`)}</Button>
        </div>
      ) : <Button variant="secondary" onClick={onUpload}>{uploadLabel}</Button>}
    </div>
  );
}
function useDoc(kind: 'id' | 'address') {
  const { t } = useTranslation();
  const [file, setFile] = useState<File>(null);
  const [sheet, setSheet] = useState<'upload' | 'remove' | null>(null);
  const [preview, setPreview] = useState(false);
  const overlays: ReactNode = (
    <>
      <UploadSheet kind={kind} open={sheet === 'upload'} onOpenChange={(o) => setSheet(o ? 'upload' : null)} onPick={() => { setFile(demoUploads[kind]); setSheet(null); }} />
      <Sheet open={sheet === 'remove'} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent title={t(`${k}.upload.removeTitle`)}>
          <h2 className="text-h3">{t(`${k}.upload.removeTitle`)}</h2>
          <p className="text-body text-slate">{t(kind === 'id' ? `${k}.upload.removeIdBody` : `${k}.upload.removeAddressBody`)}</p>
          <Button onClick={() => { setFile(null); setSheet(null); }}>{t(`${k}.upload.remove`)}</Button>
          <Button variant="ghost" onClick={() => setSheet(null)}>{t(`${k}.upload.keep`)}</Button>
        </SheetContent>
      </Sheet>
      {preview && file ? (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <div className="flex px-4 pt-2"><IconButton icon="x" label={t('common.close')} onClick={() => setPreview(false)} /></div>
          <div className="flex flex-1 flex-col gap-4 p-6">
            <div><h2 className="text-h3">{t(kind === 'id' ? `${k}.upload.idTitle` : `${k}.upload.addressTitle`)}</h2><p className="text-caption text-slate"><span dir="ltr">{file.name} · {file.size}</span> · {t(`${k}.upload.uploadedToday`)}</p></div>
            <div className="grid flex-1 place-items-center rounded-xl bg-fog">{kind === 'id' ? <Illustration name="idCard" /> : <Icon name="file" size={48} className="text-red" />}</div>
          </div>
          <Footer><Button onClick={() => setPreview(false)}>{t(`${k}.upload.done`)}</Button><Button variant="secondary" onClick={() => { setPreview(false); setSheet('upload'); }}>{t(`${k}.upload.replace`)}</Button></Footer>
        </div>
      ) : null}
    </>
  );
  return { file, overlays, open: () => setSheet('upload'), remove: () => setSheet('remove'), preview: () => setPreview(true) };
}

/** 4.5 / 4.5a–d */
export function ManualDetails() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [v, setV] = useState<Record<string, string>>({});
  const doc = useDoc('id');
  const ready = ['first', 'last', 'birthDate', 'idType', 'idNumber', 'expiry'].every((f) => v[f]?.trim()) && !!doc.file;
  const picker = new Set(['title', 'birthCountry', 'idType', 'issuer']);
  const dates = new Set(['birthDate', 'expiry']);
  return (
    <>
      <Screen footer={<Footer border><Button disabled={!ready} onClick={() => nav('/verify/hub?stage=idReview', { replace: true })}>{t(`${k}.4_5.submit`)}</Button></Footer>}>
        <StepHeader step={1} total={2} title={t(`${k}.stepId`)} />
        <div className="flex flex-col gap-4 px-4 pb-6">
          <Banner type="info">{t(`${k}.4_5.banner`)}</Banner>
          {FIELDS.map((f) => <TextField key={f} label={t(`${k}.fields.${f}`)} value={v[f] ?? ''} onChange={(x) => setV((p) => ({ ...p, [f]: x }))} dirLtr={f === 'idNumber' || dates.has(f)} trailing={picker.has(f) ? <Icon name="chevronDown" size={20} className="text-slate" /> : dates.has(f) ? <Icon name="calendar" size={20} className="text-slate" /> : undefined} />)}
          <DocCard title={t(`${k}.4_5.photo`)} hint={t(`${k}.4_5.photoHint`)} file={doc.file} uploadLabel={t(`${k}.4_5.upload`)} onUpload={doc.open} onPreview={doc.preview} onRemove={doc.remove} />
        </div>
      </Screen>
      {doc.overlays}
    </>
  );
}

/** 4.7 / 4.7a / 4.8–4.8c */
export function Address() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [postcode, setPostcode] = useState('');
  const [a, setA] = useState({ county: '', city: '', line1: '', line2: '' });
  const doc = useDoc('address');
  useEffect(() => {
    if (!a.line1 && /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode.trim())) setA({ county: demoAddress.county, city: demoAddress.city, line1: demoAddress.line1, line2: '' });
  }, [postcode, a.line1]);
  const ready = !!a.line1.trim() && !!doc.file;
  return (
    <>
      <Screen footer={<Footer border><Button disabled={!ready} onClick={() => nav('/verify/hub?stage=submitted', { replace: true })}>{t(`${k}.4_7.continue`)}</Button></Footer>}>
        <StepHeader step={2} total={2} title={t(`${k}.stepAddress`)} />
        <div className="flex flex-col gap-4 px-4 pb-6">
          <TextField label={t(`${k}.fields.postcode`)} value={postcode} onChange={(x) => setPostcode(x.toUpperCase())} helper={t(`${k}.fields.postcodeHelper`)} dirLtr />
          <LockedField label={t(`${k}.fields.country`)} value={demoAddress.country} />
          <TextField label={t(`${k}.fields.county`)} value={a.county} onChange={(x) => setA((p) => ({ ...p, county: x }))} dirLtr trailing={<Icon name="chevronDown" size={20} className="text-slate" />} />
          <TextField label={t(`${k}.fields.city`)} value={a.city} onChange={(x) => setA((p) => ({ ...p, city: x }))} dirLtr trailing={<Icon name="chevronDown" size={20} className="text-slate" />} />
          <TextField label={t(`${k}.fields.line1`)} value={a.line1} onChange={(x) => setA((p) => ({ ...p, line1: x }))} dirLtr />
          <TextField label={t(`${k}.fields.line2`)} value={a.line2} onChange={(x) => setA((p) => ({ ...p, line2: x }))} dirLtr />
          <DocCard title={t(`${k}.4_7.proof`)} hint={t(`${k}.4_7.proofHint`)} file={doc.file} uploadLabel={t(`${k}.4_7.uploadDoc`)} onUpload={doc.open} onPreview={doc.preview} onRemove={doc.remove} />
          <p className="text-caption text-slate" dir="ltr">Demo · SW1A 1AA</p>
        </div>
      </Screen>
      {doc.overlays}
    </>
  );
}
