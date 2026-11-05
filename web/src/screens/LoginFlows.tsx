/** Login flows: 7.2a/b/d verify code · 7.2c try another way · 7.5 offline · 7.6 ID expired · 7.0 welcome back ·
 *  7.7–7.11 new device · 7.7c contact support · 9.1 update required · 9.2 maintenance. */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoIdentity, demoSystem, supportContacts } from '@shared/mock/account';
import { maskEmail, maskPhone } from '@shared/utils/mask';
import { ltr } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RadioGroup, RadioOption } from '@/components/ui/radio-group';
import { Illustration, Logo } from '@/components/Art';
import { Icon } from '@/components/Icon';
import { Avatar, BackButton, Banner, IconBadge, ListGroup, ListRow, Screen, TextField, TopBar } from '@/components/quicliq';
import { CodeError, CodeInput, Footer, Keypad, MessageLayout, ResendCountdown, formatMSS, useCountdown } from '@/components/forms';

const home = '/home?level=1';

/** Shared code entry: 7.2a/b (login), 7.9/7.9b (new device). */
function CodeEntry({ method, title, intro, onSuccess, helpLabel, onHelp }: { method: 'sms' | 'email'; title: string; intro: string; onSuccess: () => void; helpLabel: string; onHelp: () => void }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'error' | 'success'>();
  const [left, setLeft] = useState<number>(demoAccount.codeAttempts);
  const [round, setRound] = useState(0);
  const secs = useCountdown(demoAccount.resendSeconds, round);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const change = (v: string) => {
    if (status === 'success' || left === 0) return;
    if (status === 'error') { setStatus(undefined); setCode(v.slice(-1)); return; }
    setCode(v);
    if (v.length === 6) {
      if (v === demoAccount.code) { setStatus('success'); timer.current = setTimeout(onSuccess, 600); }
      else { setStatus('error'); setLeft((a) => Math.max(0, a - 1)); }
    }
  };
  return (
    <Screen footer={<Keypad onDigit={(d) => change(status === 'error' ? d : (code + d).slice(0, 6))} onDelete={() => change(code.slice(0, -1))} suggestion={method === 'sms' && !status ? demoAccount.code : undefined} onSuggestion={change} />}>
      <div className="flex px-6 pt-2 pb-4"><BackButton /></div>
      <div className="flex flex-col gap-6 px-6 pt-2 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2">{title}</h1>
          <p className="text-body-lg text-slate">{intro}</p>
          <div className="flex items-center gap-4">
            <span className="text-title">{ltr(method === 'sms' ? maskPhone(demoAccount.phone) : maskEmail(demoAccount.email))}</span>
            <Button variant="tonal" size="sm" onClick={() => nav(-1)}><Icon name="edit" size={16} />{t('common.edit')}</Button>
          </div>
        </div>
        <CodeInput value={code} onChange={change} status={status} disabled={left === 0} />
        {status === 'error' ? <CodeError message={t('components.codeError.wrongCode')} attemptsLeft={left} /> : null}
        <div className="flex items-center justify-between gap-2">
          <ResendCountdown secondsLeft={secs} total={demoAccount.resendSeconds} onResend={() => { setRound((r) => r + 1); setCode(''); setStatus(undefined); setLeft(demoAccount.codeAttempts); }} />
          <button onClick={onHelp} className="cursor-pointer text-body-md text-red hover:underline">{helpLabel}</button>
        </div>
        <p className="text-caption text-slate md:hidden" dir="ltr">Demo · {demoAccount.code}</p>
      </div>
    </Screen>
  );
}

export function VerifyLogin() {
  const { method = 'sms' } = useParams();
  const { t } = useTranslation();
  const nav = useNavigate();
  const m = method === 'email' ? 'email' : 'sms';
  return <CodeEntry method={m} title={t('login.7_2.title')} intro={t(`login.7_2.${m === 'sms' ? 'textedTo' : 'emailedTo'}`)} onSuccess={() => nav(home, { replace: true })} helpLabel={t('components.tryAnotherWay')} onHelp={() => nav(`/login/method?m=${m}`)} />;
}

/** 7.2c and 7.8d share the layout. */
function MethodChoice({ k, onSend }: { k: string; onSend: (m: 'sms' | 'email') => void }) {
  const { t } = useTranslation();
  const [q] = useSearchParams();
  const [m, setM] = useState<'sms' | 'email'>(q.get('m') === 'email' ? 'email' : 'sms');
  return (
    <Screen footer={<Footer><Button onClick={() => onSend(m)}>{t('login.7_2c.send')}</Button></Footer>}>
      <div className="flex px-6 pt-2"><BackButton /></div>
      <div className="flex flex-col gap-6 px-6 pt-6">
        <div className="flex flex-col gap-2">
          <h1 className={k === 'login.7_2c' ? 'text-h1' : 'text-h2'}>{t(`${k}.title`)}</h1>
          <p className="text-body-lg text-slate">{t(`${k}.body`)}</p>
        </div>
        <RadioGroup value={m} onValueChange={(v) => setM(v as 'sms' | 'email')}>
          <RadioOption value="sms" title={t('login.7_2c.sms')} subtitle={ltr(maskPhone(demoAccount.phone))} leading={<IconBadge icon="smartphone" size={40} />} />
          <RadioOption value="email" title={t('login.7_2c.email')} subtitle={ltr(maskEmail(demoAccount.email))} leading={<IconBadge icon="mail" size={40} />} />
        </RadioGroup>
      </div>
    </Screen>
  );
}

export function TryAnotherWay() {
  const nav = useNavigate();
  return <MethodChoice k="login.7_2c" onSend={(m) => nav(`/login/verify/${m}`, { replace: true })} />;
}

export function Offline() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return <MessageLayout illustration={<Illustration name="offline" />} title={t('login.7_5.title')} body={t('login.7_5.body')} footer={<Button onClick={() => navigator.onLine && nav(-1)}><Icon name="refresh" size={20} />{t('login.7_5.retry')}</Button>} />;
}

export function IdExpired() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <MessageLayout illustration={<Illustration name="idCard" size={144} />} title={t('login.7_6.title')} body={t('login.7_6.body')} footer={<>
      <Button onClick={() => nav('/verify/choose-id')}>{t('login.7_6.verify')}</Button>
      <Button variant="ghost" onClick={() => nav(home)}>{t('login.7_6.later')}</Button>
    </>} />
  );
}

/** 7.0 Welcome back — password, Face ID / fingerprint, errors, 15-min lock, switch account. */
export function WelcomeBack() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const k = 'login.7_0';
  const bio = q.get('bio') === 'fingerprint' ? 'fingerprint' : 'faceId';
  const [pw, setPw] = useState('');
  const [pwFailed, setPwFailed] = useState(0);
  const [lockRound, setLockRound] = useState(0);
  const lockLeft = useCountdown(lockRound ? demoAccount.lockSeconds : 0, lockRound);
  const locked = lockRound > 0 && lockLeft > 0;
  const [bioFailed, setBioFailed] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [last, setLast] = useState<'pw' | 'bio' | null>(null);
  const out = bioFailed >= 3;
  const logIn = () => {
    if (pw === demoAccount.password) return nav(home);
    const n = pwFailed + 1; setPwFailed(n); setLast('pw');
    if (n >= demoAccount.loginAttempts) { setLockRound((r) => r + 1); setPw(''); }
  };
  const failBio = () => { const n = bioFailed + 1; setBioFailed(n); setLast('bio'); if (n >= 3) setSheet(false); };
  const startBio = () => { if (bio === 'fingerprint') return setSheet(true); setScanning(true); setTimeout(() => { setScanning(false); failBio(); }, 1200); };
  let banner: { type: 'error' | 'security'; text: string } | null = null;
  if (locked) banner = { type: 'security', text: t('login.7_1.tooMany') };
  else if (last === 'pw' && pwFailed) banner = { type: 'error', text: t(`${k}.wrongPassword`, { count: demoAccount.loginAttempts - pwFailed }) };
  else if (last === 'bio' && bioFailed) banner = { type: 'error', text: bio === 'faceId' ? (out ? t(`${k}.faceIdOut`) : t(`${k}.faceIdFail`, { count: 3 - bioFailed })) : out ? t(`${k}.fingerprintOut`) : '' };
  return (
    <div className="relative flex flex-1 flex-col">
      <Screen className="gap-8 px-6 pt-12 pb-6">
        <Logo height={36} />
        <div className="flex items-center gap-4">
          <Avatar initials={demoAccount.initials} tone="brand" />
          <div className="flex flex-col gap-1">
            <h1 className="text-h2">{t(`${k}.title`, { name: demoAccount.firstName })}</h1>
            <span className="flex items-center gap-1.5 text-body text-slate"><Icon name="smartphone" size={16} />{t(`${k}.number`, { number: ltr(maskPhone(demoAccount.phone)), last4: ltr(demoAccount.phone.slice(-4)) })}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {banner?.text ? <Banner type={banner.type} icon={banner.type === 'security' ? 'clock' : undefined}>{banner.text}</Banner> : null}
          <TextField label={t('login.7_1.password')} value={pw} onChange={(v) => { setPw(v); if (last === 'pw') setLast(null); }} type="password" error={last === 'pw' && pwFailed && !locked ? ' ' : undefined} />
          {locked ? null : <button onClick={() => nav('/soon/Forgot password')} className="cursor-pointer self-end text-body-md text-red hover:underline">{t('login.7_1.forgot')}</button>}
        </div>
        {locked ? (
          <div className="flex flex-col gap-4">
            <Button disabled>{t('login.7_1.tryAgainIn', { time: ltr(formatMSS(lockLeft)) })}</Button>
            <Button variant="ghost" onClick={() => nav('/soon/Forgot password')}>{t('login.7_1.resetPassword')}</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Button disabled={!pw} onClick={logIn}>{t('login.7_1.logIn')}</Button>
            {!out ? <>
              <div className="flex items-center gap-3 text-caption text-slate"><span className="h-px flex-1 bg-dark-fog" />{t('common.or')}<span className="h-px flex-1 bg-dark-fog" /></div>
              <Button variant="secondary" onClick={startBio}><Icon name={bio} size={20} />{bio === 'faceId' ? t(last === 'bio' && bioFailed ? `${k}.faceIdAgain` : `${k}.faceId`) : t(`${k}.fingerprint`)}</Button>
            </> : null}
          </div>
        )}
        <p className="mt-auto text-center text-body text-slate">{t('components.switchAccount.prompt')} <button onClick={() => nav('/login', { replace: true })} className="cursor-pointer text-body-md text-red hover:underline">{t('components.switchAccount.action')}</button></p>
      </Screen>
      {scanning ? (
        <div className="absolute inset-0 z-40 grid place-items-center bg-ink-50/50">
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-6">
            <span className="grid size-[88px] place-items-center rounded-full bg-fog text-red"><Icon name="faceId" size={48} /></span>
            <span className="text-body-md">{t(`${k}.faceIdPrompt`)}</span>
          </div>
        </div>
      ) : null}
      <Sheet open={sheet} onOpenChange={setSheet}>
        <SheetContent title={t(`${k}.fingerprintTitle`)}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-h3">{t(`${k}.fingerprintTitle`)}</h2>
            <p className={bioFailed ? 'text-body text-failure' : 'text-body text-slate'}>{bioFailed ? t(`${k}.fingerprintFail`, { count: 3 - bioFailed }) : t(`${k}.touchSensor`)}</p>
            <button onClick={failBio} aria-label={t(`${k}.touchSensor`)} className={`grid size-[88px] cursor-pointer place-items-center rounded-full ${bioFailed ? 'bg-failure-light text-failure' : 'bg-fog text-red'}`}><Icon name="fingerprint" size={48} /></button>
          </div>
          <Button variant="secondary" onClick={() => setSheet(false)}>{t(`${k}.usePassword`)}</Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ——— New device 7.7 – 7.11 ——— */
export function NewDevice() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = 'login.7_7';
  return (
    <Screen footer={<Footer><Button onClick={() => nav('/device/details')}>{t('common.continue')}</Button></Footer>}>
      <div className="flex px-6 pt-2"><BackButton /></div>
      <div className="flex flex-col gap-6 px-6 pt-4">
        <div className="flex justify-center"><Illustration name="newDevice" size={144} /></div>
        <div className="flex flex-col gap-2"><h1 className="text-h2">{t(`${k}.title`)}</h1><p className="text-body-lg text-slate">{t(`${k}.body`)}</p></div>
        <ol className="flex flex-col gap-4">
          {(['details', 'code', 'trusted'] as const).map((s, i) => (
            <li key={s} className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-red-10 text-body-md text-red">{i + 1}</span><span className="text-body">{t(`${k}.steps.${s}`)}</span></li>
          ))}
        </ol>
        <Banner type="info">{t(`${k}.oneDevice`)}</Banner>
      </div>
    </Screen>
  );
}

export function VerifyDetails() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = 'login.7_8';
  const [v, setV] = useState({ first: '', middle: '', last: '', dob: '' });
  const [left, setLeft] = useState<number>(demoIdentity.attempts);
  const [mismatch, setMismatch] = useState(false);
  const set = (f: keyof typeof v) => (x: string) => { setMismatch(false); setV((p) => ({ ...p, [f]: x })); };
  const digits = v.dob.replace(/\D/g, '');
  const ready = !!(v.first.trim() && v.last.trim() && digits.length === 8);
  const n = (s: string) => s.trim().toLowerCase();
  const submit = () => {
    const ok = n(v.first) === n(demoIdentity.first) && n(v.last) === n(demoIdentity.last) && (!v.middle.trim() || n(v.middle) === n(demoIdentity.middle)) && digits === demoIdentity.dob;
    if (ok) return nav('/device/method');
    if (left - 1 <= 0) return nav('/device/locked', { replace: true });
    setLeft(left - 1); setMismatch(true);
  };
  return (
    <Screen footer={<Footer><Button disabled={!ready} onClick={submit}>{t('common.continue')}</Button></Footer>}>
      <div className="flex px-6 pt-2"><BackButton /></div>
      <div className="flex flex-col gap-6 px-6 pt-4 pb-6">
        <div className="flex flex-col gap-2"><h1 className="text-h2">{t(`${k}.title`)}</h1><p className="text-body-lg text-slate">{t(`${k}.body`)}</p></div>
        <div className="flex flex-col gap-4">
          <TextField label={t(`${k}.first`)} value={v.first} onChange={set('first')} error={mismatch ? ' ' : undefined} autoComplete="given-name" />
          <TextField label={t(`${k}.middle`)} value={v.middle} onChange={set('middle')} error={mismatch ? ' ' : undefined} />
          <TextField label={t(`${k}.last`)} value={v.last} onChange={set('last')} error={mismatch ? ' ' : undefined} autoComplete="family-name" />
          <TextField label={t(`${k}.dob`)} value={v.dob} onChange={set('dob')} error={mismatch ? ' ' : undefined} inputMode="numeric" dirLtr trailing={<Icon name="calendar" size={20} className="text-slate" />} />
        </div>
        {mismatch ? <Banner type="error">{t(`${k}.mismatch`, { count: left })}</Banner> : <Banner type="info">{t(`${k}.note`, { maskedPhone: ltr(maskPhone(demoAccount.phone)), last4: ltr(demoAccount.phone.slice(-4)) })}</Banner>}
        <p className="text-caption text-slate">Demo: James · Robert · Carter · 14/03/1990</p>
      </div>
    </Screen>
  );
}

export function DeviceLocked() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return <MessageLayout illustration={<Illustration name="locked" />} title={t('login.7_8c.title')} body={t('login.7_8c.body')} footer={<>
    <Button onClick={() => nav('/support')}>{t('login.7_7c.title')}</Button>
    <Button variant="ghost" onClick={() => nav('/login', { replace: true })}>{t('login.7_8c.back')}</Button>
  </>} />;
}

export function DeviceMethod() {
  const nav = useNavigate();
  return <MethodChoice k="login.7_8d" onSend={(m) => nav(`/device/code/${m}`)} />;
}

export function DeviceCode() {
  const { method = 'sms' } = useParams();
  const { t } = useTranslation();
  const nav = useNavigate();
  const m = method === 'email' ? 'email' : 'sms';
  return <CodeEntry method={m} title={t('login.7_9.title')} intro={t(`login.7_9.${m === 'sms' ? 'textedTo' : 'emailedTo'}`)} onSuccess={() => nav('/device/verified', { replace: true })} helpLabel={t('login.7_9.noCode')} onHelp={() => nav(-1)} />;
}

export function DeviceVerified() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return <MessageLayout illustration={<Illustration name="newDevice" />} title={t('login.7_11.title')} body={t('login.7_11.body')} footer={<Button onClick={() => nav(home, { replace: true })}>{t('common.continue')}</Button>} />;
}

export function ContactSupport() {
  const { t } = useTranslation();
  const k = 'login.7_7c';
  const call = () => { location.href = `tel:${supportContacts.phone}`; };
  const mail = () => { location.href = `mailto:${supportContacts.email}`; };
  return (
    <Screen footer={<Footer><Button onClick={call}><Icon name="phoneCall" size={20} />{t(`${k}.callSupport`)}</Button><Button variant="secondary" onClick={mail}><Icon name="mail" size={20} />{t(`${k}.emailSupport`)}</Button></Footer>}>
      <TopBar title={t(`${k}.title`)} />
      <div className="flex flex-col gap-6 px-6 pt-4">
        <div className="flex flex-col gap-2"><h1 className="text-h2">{t(`${k}.hero`)}</h1><p className="text-body-lg text-slate">{t(`${k}.body`)}</p></div>
        <ListGroup>
          <ListRow icon="phoneCall" title={t(`${k}.call`)} subtitle={ltr(supportContacts.phoneDisplay)} onClick={call} />
          <ListRow icon="mail" title={t(`${k}.email`)} subtitle={supportContacts.email} onClick={mail} />
          <ListRow icon="pin" title={t(`${k}.office`)} subtitle={ltr(supportContacts.office)} />
        </ListGroup>
        <Banner type="security">{t(`${k}.security`)}</Banner>
      </div>
    </Screen>
  );
}

/* ——— System 9.1 / 9.2 ——— */
export function UpdateRequired() {
  const { t } = useTranslation();
  const k = 'system.9_1';
  return (
    <MessageLayout illustration={<Illustration name="update" />} title={t(`${k}.title`)} body={t(`${k}.body`)} footer={<Button><Icon name="download" size={20} />{t(`${k}.update`)}</Button>}>
      <div className="flex items-center gap-2 rounded-lg bg-fog p-4">
        <div className="flex flex-1 flex-col items-center gap-1"><span className="text-caption text-slate">{t(`${k}.yours`)}</span><span className="text-body-md text-slate">{demoSystem.version}</span></div>
        <Icon name="arrowRight" size={20} className="text-slate" />
        <div className="flex flex-1 flex-col items-center gap-1"><span className="text-caption text-slate">{t(`${k}.latest`)}</span><span className="text-body-md text-red">{demoSystem.latest}</span></div>
      </div>
      <Banner type="info">{t(`${k}.safe`)}</Banner>
    </MessageLayout>
  );
}

export function Maintenance() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = 'system.9_2';
  return (
    <MessageLayout illustration={<Illustration name="maintenance" />} title={t(`${k}.title`)} body={t(`${k}.body`)} footer={<>
      <Button onClick={() => nav(-1)}><Icon name="refresh" size={20} />{t(`${k}.retry`)}</Button>
      <Button variant="ghost" onClick={() => nav('/support')}>{t(`${k}.support`)}</Button>
    </>}>
      <div className="flex items-center gap-2 rounded-lg bg-fog p-4">
        <Icon name="clock" size={20} />
        <div className="flex flex-col"><span className="text-caption text-slate">{t(`${k}.backBy`)}</span><span className="text-body-md">{t(`${k}.time`, { time: ltr(demoSystem.backBy) })}</span></div>
      </div>
      <Banner type="info">{t(`${k}.safe`)}</Banner>
    </MessageLayout>
  );
}
