import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import i18n, { deviceLocale } from './src/i18n';
import { ComponentGallery } from './src/screens/dev/ComponentGallery';
import { FoundationsScreen } from './src/screens/dev/FoundationsScreen';
import { ThemeProvider, fontAssets, type Locale } from './src/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [locale, setLocale] = useState<Locale>(deviceLocale);
  const [screen, setScreen] = useState<'gallery' | 'tokens'>('gallery');
  if (!fontsLoaded && !fontError) return null;

  const toggleLocale = () => {
    const next: Locale = locale === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
    setLocale(next);
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider locale={locale}>
        <StatusBar style="dark" />
        {screen === 'gallery' ? (
          <ComponentGallery onToggleLocale={toggleLocale} onShowTokens={() => setScreen('tokens')} />
        ) : (
          <FoundationsScreen onToggleLocale={() => setScreen('gallery')} />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
