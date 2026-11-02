/**
 * App locale: device language by default (Arabic if the device is Arabic, otherwise English),
 * overridden by the user's choice from "Choose language", which is saved on the device.
 * Switching updates i18next, the theme (AR text styles) and the layout direction immediately — no reload.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { deviceLocale } from './index';
import { ThemeProvider, type Locale } from '../theme';

const STORAGE_KEY = 'quicliq.locale';

type LocaleContextValue = { locale: Locale; ready: boolean; setLocale: (l: Locale) => void };
const LocaleContext = createContext<LocaleContextValue>({ locale: deviceLocale, ready: false, setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(deviceLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'en' || saved === 'ar') {
          i18n.changeLanguage(saved);
          setLocaleState(saved);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const setLocale = useCallback((next: Locale) => {
    i18n.changeLanguage(next);
    setLocaleState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo(() => ({ locale, ready, setLocale }), [locale, ready, setLocale]);
  return (
    <LocaleContext.Provider value={value}>
      <ThemeProvider locale={locale}>{children}</ThemeProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
