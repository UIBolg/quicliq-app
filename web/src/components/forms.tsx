/** Form and code-entry pieces matching the preview artifact (Figma Kitchen components). */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { flagXml } from '@shared/assets/flags.generated';
import { ltr } from '@shared/utils/format';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/Icon';
import { BackButton } from '@/components/quicliq';
import { cn } from '@/lib/utils';

export const formatMSS = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Seconds left, once per second from `seconds`; restart by changing `round`. */
export function useCountdown(seconds: number, round: unknown = 0) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    if (!seconds) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? (clearInterval(id), 0) : s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds, round]);
  return left;
}

/** Step Header — back, "Step x of y" (Caption Slate), H2 title, segmented bar (done/current red, rest Dark Fog). */
export function StepHeader({ step, total, title, onBack }: { step: number; total: number; title: string; onBack?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
      <div className="flex"><BackButton onClick={onBack} /></div>
      <div className="flex flex-col gap-1">
        <span className="text-caption text-slate">{t('registration.step', { step, total })}</span>
        <h1 className="text-h2">{title}</h1>
      </div>
      <div className="flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}>
        {Array.from({ length: total }, (_, i) => <span key={i} className={cn('h-1 flex-1 rounded-full', i < step ? 'bg-red' : 'bg-dark-fog')} />)}
      </div>
    </div>
  );
}

/** 6-digit code (OTP Digit 46×60, radius md, H2 digits, separator after 3). Always LTR. Hidden input drives it. */
export function CodeInput({ value, onChange, status, disabled, autoFocus = true }: { value: string; onChange: (v: string) => void; status?: 'error' | 'success'; disabled?: boolean; autoFocus?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();
  const box = (i: number) => {
    const d = value[i];
    const active = focused && !status && i === Math.min(value.length, 5) && !disabled;
    return (
      <span key={i} className={cn(
        'grid h-[60px] w-[46px] place-items-center rounded-md text-h2 font-[800]',
        status === 'error' ? 'border-2 border-failure bg-failure-light text-failure'
          : status === 'success' ? 'border-2 border-success bg-success-light text-success'
          : active ? 'border-2 border-red bg-white' : d ? 'border border-silver bg-white text-ink' : 'bg-fog',
      )} style={{ fontFamily: 'var(--font-en)' }}>
        {d ?? (active ? <span className="h-6 w-0.5 animate-pulse bg-red" /> : '')}
      </span>
    );
  };
  return (
    <div className="relative" dir="ltr" onClick={() => ref.current?.focus()}>
      <div className="flex items-center justify-between">
        {[0, 1, 2].map(box)}
        <span className="h-0.5 w-2 rounded-full bg-silver" aria-hidden />
        {[3, 4, 5].map(box)}
      </div>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        disabled={disabled}
        aria-label={t('components.codeInput.label', { count: 6 })}
        className="absolute inset-0 opacity-0"
      />
    </div>
  );
}

export function CodeError({ message, attemptsLeft, total = 3 }: { message: string; attemptsLeft: number; total?: number }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col gap-2 rounded-md bg-failure-light p-4">
      <p className="flex items-start gap-2 text-body-md text-failure"><Icon name="alert" size={18} className="mt-0.5" />{message}</p>
      <div className="flex items-center gap-2">
        <span className="flex gap-1">{Array.from({ length: total }, (_, i) => <span key={i} className={cn('h-1 w-4 rounded-full', i < total - attemptsLeft ? 'bg-failure' : 'bg-silver')} />)}</span>
        <span className="text-caption text-slate">{t('components.codeError.attemptsLeft', { count: attemptsLeft })}</span>
      </div>
    </div>
  );
}

export function ResendCountdown({ secondsLeft, total, onResend }: { secondsLeft: number; total: number; onResend: () => void }) {
  const { t } = useTranslation();
  if (secondsLeft > 0) {
    const r = 8, c = 2 * Math.PI * r;
    return (
      <span className="flex items-center gap-2 text-body-md text-slate">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden><circle cx="10" cy="10" r={r} fill="none" stroke="var(--color-fog)" strokeWidth="2.5" /><circle cx="10" cy="10" r={r} fill="none" stroke="var(--color-slate)" strokeWidth="2.5" strokeDasharray={c} strokeDashoffset={c * (1 - secondsLeft / total)} transform="rotate(-90 10 10)" strokeLinecap="round" /></svg>
        {t('components.resend.counting', { time: ltr(formatMSS(secondsLeft)) })}
      </span>
    );
  }
  return <button onClick={onResend} className="flex cursor-pointer items-center gap-1.5 text-body-md text-red"><Icon name="refresh" size={16} />{t('components.resend.action')}</button>;
}

/** Country Prefix (+44, UK flag, lock; 112×64 Fog radius lg) + mobile field; the row stays LTR. */
export function PhoneRow({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-2" dir="ltr">
      <span aria-label={t('components.countryPrefix')} className="flex h-16 w-28 shrink-0 items-center gap-2 rounded-lg border-[1.5px] border-dark-fog bg-fog px-4">
        <span className="h-4 w-6 overflow-hidden rounded-[2px] [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: flagXml.UK }} />
        <span className="text-body-lg" style={{ fontFamily: 'var(--font-en)' }}>+44</span>
        <Icon name="lock" size={14} className="text-slate" />
      </span>
      <div className="flex-1" dir="auto">{children}</div>
    </div>
  );
}

export function Agreement({ document, checked, onChange, onOpen }: { document: 'privacy' | 'fraud'; checked: boolean; onChange: (c: boolean) => void; onOpen: () => void }) {
  const { t } = useTranslation();
  return (
    <label className="flex cursor-pointer items-center gap-2 text-body text-ink">
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(c === true)} />
      <span>{t(`components.agreement.${document}.prefix`)}<button type="button" onClick={(e) => { e.preventDefault(); onOpen(); }} className="cursor-pointer text-red underline">{t(`components.agreement.${document}.link`)}</button></span>
    </label>
  );
}

export function PasswordRule({ label, met }: { label: string; met: boolean }) {
  return (
    <span className={cn('flex items-center gap-2 text-body', met ? 'text-success' : 'text-slate')}>
      {met ? <span className="grid size-5 place-items-center rounded-full bg-success text-white"><Icon name="check" size={12} /></span> : <span className="size-5 rounded-full border-[1.5px] border-silver" />}
      {label}
    </span>
  );
}

export function VerifiedTag({ label }: { label: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-2 py-1 text-caption text-success"><Icon name="check" size={14} />{label}</span>;
}

/** Centred message screen (7.5, 7.6, 7.8c, 7.11, 9.x, 4.2, 4.3a): illustration, H2 + Body Large, extra content, footer. */
export function MessageLayout({ illustration, title, body, children, footer }: { illustration: ReactNode; title: string; body: string; children?: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-4 pt-10 no-scrollbar [&>*]:shrink-0">
        {illustration}
        <div className="flex w-full flex-col gap-2 text-center">
          <h1 className="text-h2">{title}</h1>
          <p className="text-body-lg text-slate">{body}</p>
        </div>
        {children ? <div className="flex w-full flex-col gap-6">{children}</div> : null}
      </div>
      <div className="flex flex-col gap-4 px-4 pt-4 pb-10">{footer}</div>
    </div>
  );
}

export function Footer({ children, border }: { children: ReactNode; border?: boolean }) {
  return <div className={cn('flex flex-col gap-2 px-4 pt-4 pb-8', border && 'border-t border-fog')}>{children}</div>;
}

/** iOS number pad mock (Figma 281:8115) — shown only in the desktop phone frame, where there is no phone keyboard.
 *  "From Messages" suggestion fills the whole code. Always LTR. */
export function Keypad({ onDigit, onDelete, suggestion, onSuggestion }: { onDigit: (d: string) => void; onDelete: () => void; suggestion?: string; onSuggestion?: (c: string) => void }) {
  const { t } = useTranslation();
  const rows: [string, string][][] = [[['1', ''], ['2', 'ABC'], ['3', 'DEF']], [['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO']], [['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']]];
  const key = (d: string, l: string) => (
    <button key={d} onClick={() => onDigit(d)} className="flex h-[46px] cursor-pointer flex-col items-center justify-center rounded-sm bg-white shadow-[0_1px_0_rgba(0,0,0,0.25)] active:bg-dark-fog">
      <span className="text-h3 leading-6 font-[400]" style={{ fontFamily: 'var(--font-en)' }}>{d}</span>
      {l ? <span className="text-overline leading-3 font-[700]" style={{ fontFamily: 'var(--font-en)' }}>{l}</span> : null}
    </button>
  );
  return (
    <div className="hidden flex-col gap-2 bg-keyboard px-2 pt-2 pb-8 md:flex" dir="ltr">
      {suggestion ? (
        <button onClick={() => onSuggestion?.(suggestion)} className="flex cursor-pointer flex-col items-center py-1 text-ink">
          <span className="text-caption text-slate">{t('components.keypad.fromMessages')}</span>
          <span className="text-body-lg" style={{ fontFamily: 'var(--font-en)' }}>{suggestion.slice(0, 3)} {suggestion.slice(3)}</span>
        </button>
      ) : null}
      {rows.map((r, i) => <div key={i} className="grid grid-cols-3 gap-1.5">{r.map(([d, l]) => key(d, l))}</div>)}
      <div className="grid grid-cols-3 gap-1.5">
        <span />{key('0', '')}
        <button onClick={onDelete} aria-label={t('components.keypad.delete')} className="grid h-[46px] cursor-pointer place-items-center"><Icon name="backspace" size={24} /></button>
      </div>
    </div>
  );
}
