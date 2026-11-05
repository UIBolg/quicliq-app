/** Registration: 1.1–1.7 About you · 2.1–2.3d Account details · 2.4–2.8 Verify your number · 2.9 / 2.9b Account created ·
 *  3.6 / 3.1b Biometric setup. Demo rules as in the artifact. */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoIdentity, demoRegistration, limitLevels } from '@shared/mock/account';
import { formatMoney, ltr } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Illustration, type IllustrationName } from '@/components/Art';
import { Icon, type IconName } from '@/components/Icon';
import { Banner, IconBadge, Screen, TextField } from '@/components/quicliq';
import { Agreement, CodeError, CodeInput, Footer, Keypad, PasswordRule, PhoneRow, ResendCountdown, StepHeader, VerifiedTag, formatMSS, useCountdown } from '@/components/forms';
import { useLocale } from '@/i18n';
import { cn } from '@/lib/utils';

const NAME_RE = /^[\p{L}][\p{L}\s'’-]*$/u;
const pad = (n: number) => String(n).padStart(2, '0');
type D = { d: number; m: number; y: number };
const age = (x: D) => { const n = new Date(); let a = n.getFullYear() - x.y; if (n.getMonth() + 1 < x.m || (n.getMonth() + 1 === x.m && n.getDate() < x.d)) a--; return a; };
const uk = (d: string) => `+44 ${d.slice(0, 4)} ${d.slice(4)}`;
const months = (l: string) => { const f = new Intl.DateTimeFormat(l === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { month: 'long', timeZone: 'UTC' }); return Array.from({ length: 12 }, (_, i) => f.format(new Date(Date.UTC(2000, i, 1)))); };
const longDate = (l: string, x: D) => new Intl.DateTimeFormat(l === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(x.y, x.m - 1, x.d)));

/* ——— pieces ——— */
function SheetHeading({ illustration, title, body }: { illustration?: IllustrationName; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {illustration ? <Illustration name={illustration} size={144} /> : null}
      <h2 className="text-h3">{title}</h2>
      <p className="text-body text-slate">{body}</p>
    </div>
  );
}
function ThingsToCheck({ items }: { items: string[] }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-fog p-4">
      <p className="text-body-md">{t('registration.thingsToCheck')}</p>
      {items.map((it) => <p key={it} className="flex items-center gap-2 text-body"><IconBadge icon="check" size={32} tone="white" />{it}</p>)}
    </div>
  );
}
function FooterNote({ text }: { text: string }) {
  return <p className="flex items-center gap-2 text-caption text-slate"><Icon name="lock" size={16} />{text}</p>;
}

function WheelColumn({ items, index, onIndex }: { items: string[]; index: number; onIndex: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const tmr = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => { ref.current?.scrollTo({ top: index * 40 }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className="h-[200px] flex-1 snap-y snap-mandatory overflow-y-auto py-20 no-scrollbar"
      onScroll={(e) => { const top = e.currentTarget.scrollTop; clearTimeout(tmr.current); tmr.current = setTimeout(() => onIndex(Math.max(0, Math.min(items.length - 1, Math.round(top / 40)))), 100); }}>
      {items.map((it, i) => (
        <button key={it + i} onClick={() => { onIndex(i); ref.current?.scrollTo({ top: i * 40, behavior: 'smooth' }); }} className={cn('flex h-10 w-full cursor-pointer snap-center items-center justify-center', i === index ? 'text-title text-ink' : 'text-body text-slate')}>{it}</button>
      ))}
    </div>
  );
}

/* ——— 1.1 About you ——— */
export function AboutYou() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const nav = useNavigate();
  const k = 'registration.1_1';
  const [v, setV] = useState({ first: '', middle: '', last: '' });
  const [dob, setDob] = useState<D | null>(null);
  const [wheel, setWheel] = useState<D>({ d: 1, m: 1, y: 1990 });
  const [picker, setPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'matched' | 'unknown' | 'exists' | null>(null);
  const set = (f: keyof typeof v) => (x: string) => setV((p) => ({ ...p, [f]: x }));
  const nameErr = (s: string, req: boolean) => !submitted ? undefined : !s.trim() ? (req ? t(`${k}.errors.required`) : undefined) : NAME_RE.test(s.trim()) ? undefined : t(`${k}.errors.letters`);
  const errs = { first: nameErr(v.first, true), middle: nameErr(v.middle, false), last: nameErr(v.last, true), dob: submitted && dob && age(dob) < 18 ? t(`${k}.errors.age`) : undefined };
  const ready = !!(v.first.trim() && v.last.trim() && dob);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 99 + i);
  const full = [v.first, v.middle, v.last].map((s) => s.trim()).filter(Boolean).join(' ');
  const submit = () => {
    setSubmitted(true);
    if ([v.first, v.last].some((s) => !NAME_RE.test(s.trim())) || (v.middle.trim() && !NAME_RE.test(v.middle.trim())) || !dob || age(dob) < 18) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      const n = (s: string) => s.trim().toLowerCase();
      if (n(v.first) === n(demoIdentity.first) && n(v.last) === n(demoIdentity.last) && `${pad(dob.d)}${pad(dob.m)}${dob.y}` === demoIdentity.dob) setResult('exists');
      else if (n(v.last) === 'unknown') setResult('unknown');
      else setResult('matched');
    }, 1200);
  };
  return (
    <>
      <Screen footer={<Footer>{checking ? <FooterNote text={t(`${k}.creditNote`)} /> : null}<Button disabled={!ready || checking} onClick={submit}>{checking ? t('common.loading') : t('common.continue')}</Button></Footer>}>
        <StepHeader step={1} total={2} title={t(`${k}.title`)} />
        <div className="flex flex-col gap-4 px-4 pb-6">
          <p className="text-body-lg text-slate">{t(`${k}.intro`)}</p>
          <TextField label={t(`${k}.first`)} value={v.first} onChange={set('first')} error={errs.first} autoComplete="given-name" />
          <TextField label={t(`${k}.middle`)} value={v.middle} onChange={set('middle')} error={errs.middle} />
          <TextField label={t(`${k}.last`)} value={v.last} onChange={set('last')} error={errs.last} autoComplete="family-name" />
          <button onClick={() => { if (dob) setWheel(dob); setPicker(true); }} className="flex cursor-pointer flex-col gap-2 text-start">
            <span className={cn('flex h-16 items-center gap-2 rounded-md px-4', errs.dob ? 'border-[1.5px] border-failure bg-failure-light' : 'bg-fog')}>
              <span className="flex flex-1 flex-col"><span className={cn('text-caption', errs.dob ? 'text-failure' : 'text-slate')}>{t(`${k}.dob`)}</span><span className={cn('text-body-lg', dob ? 'text-ink' : 'text-slate')} dir="ltr" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>{dob ? `${pad(dob.d)} / ${pad(dob.m)} / ${dob.y}` : t(`${k}.dobFormat`)}</span></span>
              <Icon name="calendar" size={20} className="text-slate" />
            </span>
            <span className={cn('text-caption', errs.dob ? 'text-failure' : 'text-slate')}>{errs.dob ?? t(`${k}.dobHelper`)}</span>
          </button>
          <p className="text-caption text-slate">Demo · last name “Unknown” → couldn’t confirm · James Carter 14/03/1990 → account exists</p>
        </div>
      </Screen>
      <Sheet open={picker} onOpenChange={setPicker}>
        <SheetContent title={t(`${k}.dob`)}>
          <h2 className="text-h3">{t(`${k}.dob`)}</h2>
          <div className="relative flex" dir="ltr">
            <span className="pointer-events-none absolute inset-x-0 top-20 h-10 rounded-md bg-fog" />
            <WheelColumn items={Array.from({ length: 31 }, (_, i) => String(i + 1))} index={wheel.d - 1} onIndex={(i) => setWheel((w) => ({ ...w, d: i + 1 }))} />
            <WheelColumn items={months(locale)} index={wheel.m - 1} onIndex={(i) => setWheel((w) => ({ ...w, m: i + 1 }))} />
            <WheelColumn items={years.map(String)} index={Math.max(0, years.indexOf(wheel.y))} onIndex={(i) => setWheel((w) => ({ ...w, y: years[i] }))} />
          </div>
          <Button onClick={() => { setDob(wheel); setPicker(false); }}>{t('common.done')}</Button>
        </SheetContent>
      </Sheet>
      <Sheet open={!!result} onOpenChange={(o) => !o && setResult(null)}>
        <SheetContent title={t(`${k}.title`)}>
          {result === 'matched' && dob ? <>
            <SheetHeading illustration="success" title={t(`${k}.matched.title`)} body={t(`${k}.matched.body`)} />
            <div className="flex items-center gap-3 rounded-lg bg-fog p-4">
              <IconBadge icon="user" size={40} />
              <div className="flex flex-1 flex-col"><span className="text-body-md">{full}</span><span className="text-caption text-slate">{longDate(locale, dob)}</span></div>
              <VerifiedTag label={t(`${k}.matched.tag`)} />
            </div>
            <Button onClick={() => nav(`/register/account?name=${encodeURIComponent(v.first.trim())}`)}>{t('common.continue')}</Button>
          </> : result === 'unknown' ? <>
            <SheetHeading illustration="error" title={t(`${k}.unknown.title`)} body={t(`${k}.unknown.body`)} />
            <ThingsToCheck items={t(`${k}.unknown.checks`, { returnObjects: true }) as string[]} />
            <Button onClick={() => setResult(null)}>{t(`${k}.unknown.edit`)}</Button>
          </> : result === 'exists' ? <>
            <SheetHeading illustration="idCard" title={t(`${k}.exists.title`)} body={t(`${k}.exists.body`)} />
            <Button onClick={() => nav('/login', { replace: true })}>{t('login.7_1.logIn')}</Button>
            <Button variant="secondary" onClick={() => nav('/soon/Forgot password')}>{t('login.7_1.resetPassword')}</Button>
          </> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ——— 2.1 Account details ——— */
const RULES = { length: (p: string) => p.length >= 8, upper: (p: string) => /[A-Z]/.test(p), lower: (p: string) => /[a-z]/.test(p), number: (p: string) => /\d/.test(p), special: (p: string) => /[^A-Za-z0-9]/.test(p) };
export function AccountDetails() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const name = q.get('name') ?? demoAccount.firstName;
  const k = 'registration.2_1';
  const [f, setF] = useState({ mobile: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [agreed, setAgreed] = useState({ privacy: false, fraud: false });
  const [checking, setChecking] = useState(false);
  const [sheet, setSheet] = useState<'ok' | 'no' | null>(null);
  const digits = f.mobile.replace(/\D/g, '').replace(/^0/, '');
  const ok = { mobile: /^7\d{9}$/.test(digits), email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()), password: Object.values(RULES).every((r) => r(f.password)), confirm: !!f.confirm && f.confirm === f.password };
  const err = (key: keyof typeof ok, msg: string) => (touched[key] && f[key] && !ok[key] ? msg : undefined);
  const ready = Object.values(ok).every(Boolean) && agreed.privacy && agreed.fraud;
  const set = (key: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [key]: v }));
  const blur = (key: string) => () => setTouched((p) => ({ ...p, [key]: true }));
  const create = () => { setChecking(true); setTimeout(() => { setChecking(false); setSheet(digits === demoRegistration.ownedMobile ? 'ok' : 'no'); }, 1200); };
  const phone = ltr(uk(digits));
  return (
    <>
      <Screen footer={<Footer>{checking ? <FooterNote text={t(`${k}.checking`)} /> : null}<Button disabled={!ready || checking} onClick={create}>{checking ? t('common.loading') : t(`${k}.create`)}</Button></Footer>}>
        <StepHeader step={2} total={2} title={t(`${k}.title`)} />
        <div className="flex flex-col gap-4 px-4 pb-6">
          <p className="text-body-lg text-slate">{t(`${k}.intro`)}</p>
          <div onBlur={blur('mobile')}><PhoneRow><TextField label={t(`${k}.mobile`)} value={f.mobile} onChange={set('mobile')} inputMode="tel" dirLtr helper={t(`${k}.mobileHelper`)} error={err('mobile', t(`${k}.errors.mobile`))} /></PhoneRow></div>
          <div onBlur={blur('email')}><TextField label={t(`${k}.email`)} value={f.email} onChange={set('email')} type="email" dirLtr error={err('email', t(`${k}.errors.email`))} /></div>
          <div className="flex flex-col gap-2" onBlur={blur('password')}>
            <TextField label={t(`${k}.password`)} value={f.password} onChange={set('password')} type="password" />
            {f.password && !ok.password ? <div className="flex flex-col gap-1">{(Object.keys(RULES) as (keyof typeof RULES)[]).map((r) => <PasswordRule key={r} label={t(`${k}.rules.${r}`)} met={RULES[r](f.password)} />)}</div> : null}
          </div>
          <div onBlur={blur('confirm')}><TextField label={t(`${k}.confirmPassword`)} value={f.confirm} onChange={set('confirm')} type="password" error={err('confirm', t(`${k}.errors.match`))} helper={ok.confirm ? t(`${k}.match`) : undefined} /></div>
          <div className="flex flex-col gap-3">
            {(['privacy', 'fraud'] as const).map((d) => <Agreement key={d} document={d} checked={agreed[d]} onChange={(c) => setAgreed((p) => ({ ...p, [d]: c }))} onOpen={() => nav(`/legal/${d}`)} />)}
          </div>
          {ready && !checking ? <Banner type="info">{t(`${k}.nextCode`, { phone })}</Banner> : null}
          <p className="text-caption text-slate">Demo · 7700 900123 is registered in your name</p>
        </div>
      </Screen>
      <Sheet open={!!sheet} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent title={t(`${k}.title`)}>
          {sheet === 'ok' ? <>
            <SheetHeading illustration="success" title={t(`${k}.ok.title`)} body={t(`${k}.ok.body`)} />
            <div className="flex items-center gap-3 rounded-lg bg-fog p-4"><IconBadge icon="smartphone" size={40} /><span className="flex-1 text-body-md">{phone}</span><VerifiedTag label={t(`${k}.ok.tag`)} /></div>
            <Button onClick={() => nav(`/register/verify?phone=${digits}&name=${encodeURIComponent(name)}`)}>{t(`${k}.ok.send`)}</Button>
          </> : sheet === 'no' ? <>
            <SheetHeading illustration="error" title={t(`${k}.no.title`)} body={t(`${k}.no.body`)} />
            <ThingsToCheck items={t(`${k}.no.checks`, { returnObjects: true }) as string[]} />
            <Button onClick={() => { setSheet(null); setF((p) => ({ ...p, mobile: '' })); }}>{t(`${k}.no.different`)}</Button>
            <p className="text-center text-caption text-slate">{t(`${k}.no.note`)}</p>
            <Button variant="secondary" onClick={() => nav(`/register/verify?phone=${digits}&name=${encodeURIComponent(name)}&id=1`)}>{t(`${k}.no.continue`)}</Button>
          </> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ——— 2.4 Verify your number ——— */
function OptionRow({ icon, title, subtitle, disabled, onClick }: { icon: IconName; title: string; subtitle?: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button disabled={disabled} onClick={onClick} className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg bg-fog p-4 text-start hover:bg-dark-fog disabled:cursor-default disabled:opacity-50">
      <IconBadge icon={icon} size={40} />
      <span className="flex flex-1 flex-col"><span className="text-body-md">{title}</span>{subtitle ? <span className="text-caption text-slate">{subtitle}</span> : null}</span>
    </button>
  );
}
export function VerifyNumber() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const name = q.get('name') ?? demoAccount.firstName;
  const idCheck = q.get('id') === '1';
  const k = 'registration.2_4';
  const [phone, setPhone] = useState(q.get('phone') ?? demoRegistration.ownedMobile);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'error' | 'success' | 'verifying'>();
  const [left, setLeft] = useState<number>(demoAccount.codeAttempts);
  const [round, setRound] = useState(0);
  const [sent, setSent] = useState(false);
  const secs = useCountdown(demoAccount.resendSeconds, round);
  const [sheet, setSheet] = useState<'help' | 'edit' | 'checking' | 'ok' | 'no' | null>(null);
  const [nm, setNm] = useState('');
  const nd = nm.replace(/\D/g, '').replace(/^0/, '');
  const done = status === 'success' || status === 'verifying';
  const resend = () => { setRound((r) => r + 1); setCode(''); setStatus(undefined); setLeft(demoAccount.codeAttempts); setSent(true); };
  const change = (v: string) => {
    if (done || left === 0) return;
    if (status === 'error') { setStatus(undefined); setCode(v.slice(-1)); return; }
    setCode(v);
    if (v.length === 6) {
      setStatus('verifying');
      setTimeout(() => {
        if (v === demoAccount.code) { setStatus('success'); setTimeout(() => nav(`/register/created?name=${encodeURIComponent(name)}${idCheck ? '&id=1' : ''}`, { replace: true }), 1200); }
        else { setStatus('error'); setLeft((a) => Math.max(0, a - 1)); }
      }, 600);
    }
  };
  return (
    <>
      <Screen footer={done ? undefined : <Keypad onDigit={(d) => change(status === 'error' ? d : (code + d).slice(0, 6))} onDelete={() => change(code.slice(0, -1))} suggestion={!status ? demoAccount.code : undefined} onSuggestion={change} />}>
        <StepHeader step={2} total={2} title={t('registration.2_1.title')} />
        <div className="flex flex-col gap-6 px-4 pb-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-h2">{t(`${k}.title`)}</h2>
            <p className="text-body-lg text-slate">{t(`${k}.textedTo`)}</p>
            <div className="flex items-center gap-4"><span className="text-title">{ltr(uk(phone))}</span>{done ? null : <Button variant="tonal" size="sm" onClick={() => { setNm(''); setSheet('edit'); }}><Icon name="edit" size={16} />{t('common.edit')}</Button>}</div>
          </div>
          <CodeInput value={code} onChange={change} status={status === 'verifying' ? undefined : status} disabled={left === 0 || done} />
          {status === 'error' ? <CodeError message={t('components.codeError.wrongCode')} attemptsLeft={left} /> : null}
          {status === 'verifying' ? <Button disabled>{t(`${k}.verifying`)}</Button> : null}
          {status === 'success' ? <div className="flex flex-col items-start gap-2"><VerifiedTag label={t(`${k}.verified`)} /><p className="text-body text-slate">{t(`${k}.creating`)}</p></div> : null}
          {sent && !status ? <Banner type="success">{t(`${k}.newCode`)}</Banner> : null}
          {done ? null : <div className="flex items-center justify-between gap-2"><ResendCountdown secondsLeft={secs} total={demoAccount.resendSeconds} onResend={resend} /><button onClick={() => setSheet('help')} className="cursor-pointer text-body-md text-red hover:underline">{t(`${k}.noCode`)}</button></div>}
          <p className="text-caption text-slate md:hidden" dir="ltr">Demo · {demoAccount.code}</p>
        </div>
      </Screen>
      <Sheet open={!!sheet} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent title={t(`${k}.title`)}>
          {sheet === 'help' ? <>
            <div className="flex flex-col gap-2"><h2 className="text-h3">{t(`${k}.noCode`)}</h2><p className="text-body text-slate">{t(`${k}.helpBody`)}</p></div>
            <OptionRow icon="message" title={t(`${k}.resendText`)} subtitle={secs > 0 ? t(`${k}.availableIn`, { time: ltr(formatMSS(secs)) }) : undefined} disabled={secs > 0} onClick={() => { resend(); setSheet(null); }} />
            <OptionRow icon="edit" title={t(`${k}.change`)} subtitle={ltr(uk(phone))} onClick={() => { setNm(''); setSheet('edit'); }} />
            <Button variant="ghost" onClick={() => setSheet(null)}>{t(`${k}.cancel`)}</Button>
          </> : sheet === 'edit' || sheet === 'checking' ? <>
            <div className="flex flex-col gap-2"><h2 className="text-h3">{t(`${k}.change`)}</h2><p className="text-body text-slate">{t(`${k}.changeBody`)}</p></div>
            <PhoneRow><TextField label={t('registration.2_1.mobile')} value={nm} onChange={setNm} inputMode="tel" dirLtr /></PhoneRow>
            <Button disabled={!/^7\d{9}$/.test(nd) || sheet === 'checking'} onClick={() => { setSheet('checking'); setTimeout(() => setSheet(nd === demoRegistration.ownedMobile ? 'ok' : 'no'), 1200); }}>{sheet === 'checking' ? t('common.loading') : t(`${k}.sendNew`)}</Button>
          </> : sheet === 'ok' ? <>
            <SheetHeading illustration="success" title={t('registration.2_1.ok.title')} body={t('registration.2_1.ok.body')} />
            <Button onClick={() => { setPhone(nd); resend(); setSheet(null); }}>{t('registration.2_1.ok.send')}</Button>
          </> : sheet === 'no' ? <>
            <SheetHeading illustration="error" title={t('registration.2_1.no.title')} body={t('registration.2_1.no.body')} />
            <ThingsToCheck items={[...(t('registration.2_1.no.checks', { returnObjects: true }) as string[]), t(`${k}.check07`)]} />
            <Button onClick={() => setSheet('edit')}>{t('registration.2_1.no.different')}</Button>
          </> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ——— 2.9 Account created ——— */
export function AccountCreated() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const name = q.get('name') ?? demoAccount.firstName;
  const idCheck = q.get('id') === '1';
  const k = 'registration.2_9';
  const first = limitLevels[0].total ?? 0, second = limitLevels[1].total ?? 0;
  const step = (status: 'done' | 'current' | 'locked', title: string, hint: string, amount: string, red?: boolean) => (
    <div className="flex items-center gap-3 py-3">
      {status === 'done' ? <IconBadge icon="check" size={32} tone="success" /> : status === 'locked' ? <IconBadge icon="lock" size={32} tone="grey" /> : <span className="grid size-8 place-items-center rounded-full bg-red-10"><span className="size-2.5 rounded-full bg-red" /></span>}
      <span className="flex flex-1 flex-col"><span className="text-body-md">{title}</span><span className={cn('text-caption', red ? 'text-red' : 'text-slate')}>{hint}</span></span>
      <span className="flex flex-col items-end"><span className="text-body-md" dir="ltr">{amount}</span><span className="text-caption text-slate">{t(`${k}.total`)}</span></span>
    </div>
  );
  return (
    <Screen footer={<Footer><Button onClick={() => nav('/verify/start')}>{t(`${k}.verify`)}</Button><Button variant="ghost" onClick={() => nav('/register/biometric')}>{t(`${k}.later`)}</Button></Footer>}>
      <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Illustration name="success" size={144} />
          <h1 className="text-h2">{t(`${k}.title`)}</h1>
          <p className="text-body-lg text-slate">{t(idCheck ? `${k}.welcomeId` : `${k}.welcome`, { name })}</p>
        </div>
        {idCheck ? <Banner type="security">{t(`${k}.idBanner`)}</Banner> : null}
        <div className="flex flex-col gap-4 rounded-xl bg-fog p-5">
          <div className="flex flex-col gap-1"><span className="text-body text-slate">{t(`${k}.yourLimit`)}</span><span className="text-numeric-l" dir="ltr" style={{ textAlign: 'start' }}>{formatMoney(idCheck ? 0 : first)}</span><span className="text-caption text-slate">{t(`${k}.lifetime`)}</span></div>
          <span className="h-px bg-dark-fog" />
          <span className="text-body-md">{t(`${k}.raise`)}</span>
          <div>
            {step('done', t(`${k}.steps.account`), t(`${k}.done`), formatMoney(first))}
            {step('current', t(`${k}.steps.id`), t(idCheck ? `${k}.steps.idRequired` : `${k}.steps.idHint`), formatMoney(second), true)}
            {step('locked', t(`${k}.steps.funds`), t(`${k}.steps.fundsHint`), `${formatMoney(second)}+`)}
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ——— 3.6 / 3.1b Biometric setup ——— */
export function BiometricSetup() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q] = useSearchParams();
  const kind = q.get('kind') === 'fingerprint' ? 'fingerprint' : 'faceId';
  const k = `registration.3_6.${kind}`;
  const icons: IconName[] = ['zap', 'lock', 'shield'];
  const done = () => nav('/home?level=1', { replace: true });
  return (
    <Screen footer={<Footer><Button onClick={done}><Icon name={kind} size={20} />{t(`${k}.enable`)}</Button><Button variant="ghost" onClick={done}>{t('registration.3_6.notNow')}</Button></Footer>}>
      <div className="flex flex-1 flex-col justify-center gap-6 px-4 py-6">
        <div className="flex justify-center"><Illustration name={kind} /></div>
        <div className="flex flex-col gap-2 text-center"><h1 className="text-h2">{t(`${k}.title`)}</h1><p className="text-body-lg text-slate">{t(`${k}.body`)}</p></div>
        <div className="flex flex-col gap-3">{(t(`${k}.benefits`, { returnObjects: true }) as string[]).map((b, i) => <p key={b} className="flex items-center gap-3 text-body-md"><IconBadge icon={icons[i]} size={40} />{b}</p>)}</div>
      </div>
    </Screen>
  );
}
