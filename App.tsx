import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { getLocales } from 'expo-localization';
import { FoundationsScreen } from './src/screens/dev/FoundationsScreen';
import { ThemeProvider, fontAssets, type Locale } from './src/theme';

const deviceLocale: Locale = getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en';

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [locale, setLocale] = useState<Locale>(deviceLocale);
  if (!fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
    <ThemeProvider locale={locale}>
      <StatusBar style="dark" />
      <FoundationsScreen onToggleLocale={() => setLocale(locale === 'en' ? 'ar' : 'en')} />
    </ThemeProvider>
    </SafeAreaProvider>
  );
}
