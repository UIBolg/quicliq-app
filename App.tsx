import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import './src/i18n';
import { LocaleProvider } from './src/i18n/LocaleProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { fontAssets } from './src/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  if (!fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <RootNavigator />
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
