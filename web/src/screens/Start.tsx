/** Splash (Lottie, ~2.5 s) → Onboarding (4 illustrated slides, language sheet, Sign up / Log in). */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RadioGroup, RadioOption } from '@/components/ui/radio-group';
import { Illustration, Logo, Scene } from '@/components/Art';
import { Icon } from '@/components/Icon';
import { useLocale, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

export function Splash() {
  const nav = useNavigate();
  useEffect(() => { const id = setTimeout(() => nav('/onboarding', { replace: true }), 2500); return () => clearTimeout(id); }, [nav]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white">
      <Illustration name="splash" size={220} loop={false} />
    </div>
  );
}

const SLIDES = [
  { key: 'slide1', scene: 'sendMoney' },
  { key: 'slide2', scene: 'rates' },
  { key: 'slide3', scene: 'receiving' },
  { key: 'slide4', scene: 'secure' },
];

export function LanguageSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('onboarding.language.title')}>
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">{t('onboarding.language.title')}</h2>
          <p className="text-body text-slate">{t('onboarding.language.subtitle')}</p>
        </div>
        <RadioGroup value={locale} onValueChange={(v) => { setLocale(v as Locale); onOpenChange(false); }}>
          {(['en', 'ar'] as const).map((l) => (
            <RadioOption key={l} value={l} title={t(`onboarding.language.${l}.title`)} subtitle={t(`onboarding.language.${l}.subtitle`)} />
          ))}
        </RadioGroup>
      </SheetContent>
    </Sheet>
  );
}

export function Onboarding() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [page, setPage] = useState(0);
  const [lang, setLang] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const dir = getComputedStyle(el).direction === 'rtl' ? -1 : 1;
    el.scrollTo({ left: dir * i * el.clientWidth, behavior: 'smooth' });
  };
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-6 pt-4">
        <Logo height={28} />
        <button onClick={() => setLang(true)} aria-label={t('common.language')} className="grid size-10 cursor-pointer place-items-center rounded-full bg-fog hover:bg-dark-fog">
          <Icon name="globe" size={20} />
        </button>
      </div>
      <div
        ref={track}
        onScroll={(e) => setPage(Math.round(Math.abs(e.currentTarget.scrollLeft) / e.currentTarget.clientWidth))}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto no-scrollbar"
      >
        {SLIDES.map((s) => (
          <section key={s.key} className="flex w-full shrink-0 snap-center flex-col items-center justify-center gap-6 px-6">
            <Scene name={s.scene} className="aspect-[342/360] w-full max-w-[342px]" />
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-h1">{t(`onboarding.${s.key}.title`)}</h1>
              <p className="text-body-lg text-slate">{t(`onboarding.${s.key}.body`)}</p>
            </div>
          </section>
        ))}
      </div>
      <div className="flex justify-center gap-2 py-4" role="tablist">
        {SLIDES.map((s, i) => (
          <button key={s.key} role="tab" aria-selected={page === i} aria-label={`${i + 1} / 4`} onClick={() => go(i)} className={cn('h-2 cursor-pointer rounded-full transition-all', page === i ? 'w-6 bg-red' : 'w-2 bg-silver')} />
        ))}
      </div>
      <div className="flex flex-col gap-3 px-6 pb-10">
        <Button onClick={() => nav('/register')}>{t('onboarding.signUp')}</Button>
        <Button variant="secondary" onClick={() => nav('/login')}>{t('onboarding.logIn')}</Button>
      </div>
      <LanguageSheet open={lang} onOpenChange={setLang} />
    </div>
  );
}
