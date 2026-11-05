/**
 * Layout: full screen on phones; on larger screens the app sits in a 390×844 phone frame with an EN / AR switch
 * above it, so the client can review both languages. Sheets portal into #phone.
 */
import type { ReactNode } from 'react';
import { useLocale } from '@/i18n';
import { cn } from '@/lib/utils';

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 md:py-8">
      <div className="hidden items-center gap-1 rounded-full bg-white p-1 md:flex" dir="ltr" role="group" aria-label="Language">
        {(['en', 'ar'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className={cn('h-9 cursor-pointer rounded-full px-4 text-body-md', locale === l ? 'bg-ink text-white' : 'text-slate hover:bg-fog')}
          >
            {l === 'en' ? 'English' : 'العربية'}
          </button>
        ))}
      </div>
      <div
        id="phone"
        className="relative flex h-dvh w-full flex-col overflow-hidden bg-white md:h-[844px] md:w-[390px] md:rounded-3xl md:shadow-[0_24px_64px_rgba(23,23,23,0.18)] md:ring-8 md:ring-ink"
      >
        {children}
      </div>
    </div>
  );
}
