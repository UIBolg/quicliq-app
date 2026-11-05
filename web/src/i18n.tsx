/** i18n — same EN / AR copy files as the Expo app (src/i18n/*.json). Arabic switches the document to RTL. */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@shared/i18n/en.json';
import ar from '@shared/i18n/ar.json';

export type Locale = 'en' | 'ar';
const KEY = 'quicliq.locale';
const read = (): Locale => { try { return localStorage.getItem(KEY) === 'ar' ? 'ar' : 'en'; } catch { return 'en'; } };

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: read(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

const Ctx = createContext<{ locale: Locale; isRTL: boolean; setLocale: (l: Locale) => void }>({ locale: 'en', isRTL: false, setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, set] = useState<Locale>(read());
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);
  const setLocale = useCallback((l: Locale) => {
    set(l);
    void i18n.changeLanguage(l);
    try { localStorage.setItem(KEY, l); } catch { /* private mode */ }
  }, []);
  return <Ctx.Provider value={{ locale, isRTL: locale === 'ar', setLocale }}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);
