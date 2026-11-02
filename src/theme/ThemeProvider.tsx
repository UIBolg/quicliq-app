import React, { createContext, useContext, useMemo } from 'react';
import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { stroke } from './stroke';
import { layout } from './layout';
import { sizes } from './sizes';
import { states } from './states';
import { getTextStyle, type Locale, type TextStyleName } from './typography';

function buildTheme(locale: Locale) {
  return {
    locale,
    isRTL: locale === 'ar',
    colors,
    spacing,
    radius,
    stroke,
    layout,
    sizes,
    states,
    /** e.g. theme.text('H1') → EN/H1 or AR/H1 depending on locale */
    text: (name: TextStyleName) => getTextStyle(name, locale),
  };
}

export type Theme = ReturnType<typeof buildTheme>;

const ThemeContext = createContext<Theme>(buildTheme('en'));

export function ThemeProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const theme = useMemo(() => buildTheme(locale), [locale]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
