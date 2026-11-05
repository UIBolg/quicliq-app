/** 7.1 Log in — mobile / email, password; demo: empty fields → Home, or open Home at a limit level. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, isDemoLogin } from '@shared/mock/account';
import { PhoneRow, formatMSS, useCountdown } from '@/components/forms';
import { ltr } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Art';
import { Banner, Screen, TextField } from '@/components/quicliq';
import { cn } from '@/lib/utils';

export function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = 'login.7_1';
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState(0);
  const [lockRound, setLockRound] = useState(0);
  const lockLeft = useCountdown(lockRound ? demoAccount.lockSeconds : 0, lockRound);
  const locked = lockRound > 0 && lockLeft > 0;
  const logIn = () => {
    setLoading(true); setError(false);
    setTimeout(() => {
      setLoading(false);
      if (!navigator.onLine) return nav('/offline');
      if (!id.trim() && !password) return nav('/home?level=1');
      if (isDemoLogin(method, id, password)) return nav(`/login/verify/${method === 'mobile' ? 'sms' : 'email'}`);
      const n = failed + 1; setFailed(n);
      if (n >= demoAccount.loginAttempts) { setLockRound((r) => r + 1); setFailed(0); } else setError(true);
    }, 600);
  };
  return (
    <Screen className="gap-8 px-4 pt-12 pb-8">
      <Logo height={44} />
      <div className="flex flex-col gap-2">
        <h1 className="text-h1">{t(`${k}.title`)}</h1>
        <p className="text-body-lg text-slate">{t(`${k}.subtitle`)}</p>
      </div>
      <div className="grid grid-cols-2 rounded-full bg-fog p-1" role="tablist">
        {(['mobile', 'email'] as const).map((m) => (
          <button key={m} role="tab" aria-selected={method === m} onClick={() => { setMethod(m); setId(''); setError(false); }} className={cn('h-10 cursor-pointer rounded-full text-body-md', method === m ? 'bg-white text-ink shadow-sm' : 'text-slate')}>
            {t(`${k}.${m}`)}
          </button>
        ))}
      </div>
      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); logIn(); }}>
        {error ? <Banner type="error">{t(`${k}.incorrect`)}</Banner> : null}
        {locked ? <Banner type="security" icon="clock">{t(`${k}.tooMany`)}</Banner> : null}
        {method === 'mobile' ? (
          <PhoneRow><TextField label={t(`${k}.mobile`)} value={id} onChange={(v) => { setId(v); setError(false); }} type="tel" inputMode="tel" autoComplete="tel" dirLtr error={error ? ' ' : undefined} /></PhoneRow>
        ) : <TextField
          label={t(`${k}.${method}`)}
          value={id}
          onChange={(v) => { setId(v); setError(false); }}
          type={method === 'email' ? 'email' : 'tel'}
          inputMode={method === 'email' ? 'email' : 'tel'}
          autoComplete={method === 'email' ? 'email' : 'tel'}
          dirLtr
          error={error ? ' ' : undefined}
          trailing={undefined}
        />}
        <TextField label={t(`${k}.password`)} value={password} onChange={(v) => { setPassword(v); setError(false); }} type="password" autoComplete="current-password" error={error ? ' ' : undefined} />
        <button type="button" onClick={() => nav('/soon/Forgot password')} className="cursor-pointer self-end text-body-md text-red hover:underline">{t(`${k}.forgot`)}</button>
        {locked ? (
          <>
            <Button type="button" disabled>{t(`${k}.tryAgainIn`, { time: ltr(formatMSS(lockLeft)) })}</Button>
            <Button type="button" variant="ghost" onClick={() => nav('/soon/Forgot password')}>{t(`${k}.resetPassword`)}</Button>
          </>
        ) : <Button type="submit" disabled={loading}>{loading ? t('common.loading') : t(`${k}.logIn`)}</Button>}
      </form>
      <div className="flex flex-col items-center gap-2">
        <p className="text-caption text-slate">{t(`${k}.demo`)}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {([1, 2, 3] as const).map((l) => (
            <Button key={l} variant="tonal" size="sm" onClick={() => nav(`/home?level=${l}`)}>{t(`home.levels.${l}`)}</Button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="tonal" size="sm" onClick={() => nav('/device')}>{t(`${k}.demoNewDevice`)}</Button>
          <Button variant="tonal" size="sm" onClick={() => nav('/welcome-back?bio=faceId')}>{t(`${k}.demoFaceId`)}</Button>
          <Button variant="tonal" size="sm" onClick={() => nav('/welcome-back?bio=fingerprint')}>{t(`${k}.demoFingerprint`)}</Button>
          <Button variant="tonal" size="sm" onClick={() => nav('/update')}>{t('system.9_1.title')}</Button>
          <Button variant="tonal" size="sm" onClick={() => nav('/maintenance')}>{t('system.9_2.title')}</Button>
        </div>
        <p className="text-caption text-slate" dir="ltr">Demo · {demoAccount.phone} · {demoAccount.password}</p>
      </div>
      <p className="mt-auto text-center text-body text-slate">
        {t(`${k}.noAccount`)}{' '}
        <button onClick={() => nav('/register')} className="cursor-pointer text-body-md text-red hover:underline">{t(`${k}.signUp`)}</button>
      </p>
    </Screen>
  );
}
