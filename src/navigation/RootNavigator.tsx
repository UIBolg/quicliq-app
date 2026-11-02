/**
 * React Navigation native stack; route names are Figma screen IDs (see routes.ts).
 * dev/* routes (read-only component gallery + tokens) are registered only in development builds.
 */
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocale } from '../i18n/LocaleProvider';
import { useTheme } from '../theme';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { LoginScreen } from '../screens/login/LoginScreen';
import { VerifyLoginScreen } from '../screens/login/VerifyLoginScreen';
import { ChooseCodeMethodScreen } from '../screens/login/ChooseCodeMethodScreen';
import { NotBuiltScreen } from '../screens/NotBuiltScreen';
import { ComponentGallery } from '../screens/dev/ComponentGallery';
import { FoundationsScreen } from '../screens/dev/FoundationsScreen';
import type { RootStackParamList } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

function GalleryRoute({ navigation }: NativeStackScreenProps<RootStackParamList, 'dev/Gallery'>) {
  const { locale, setLocale } = useLocale();
  return <ComponentGallery onToggleLocale={() => setLocale(locale === 'en' ? 'ar' : 'en')} onShowTokens={() => navigation.navigate('dev/Tokens')} />;
}

function TokensRoute({ navigation }: NativeStackScreenProps<RootStackParamList, 'dev/Tokens'>) {
  return <FoundationsScreen onToggleLocale={() => navigation.goBack()} />;
}

export function RootNavigator() {
  const t = useTheme();
  return (
    <NavigationContainer
      theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: t.colors['Neutral/White'] } }}
      // Swipe-back and push animations follow the reading direction.
      direction={t.isRTL ? 'rtl' : 'ltr'}
    >
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="7.1" component={LoginScreen} />
        <Stack.Screen name="7.2a" component={VerifyLoginScreen} />
        <Stack.Screen name="7.2b" component={VerifyLoginScreen} />
        <Stack.Screen name="7.2c" component={ChooseCodeMethodScreen} />
        <Stack.Screen name="NotBuilt" component={NotBuiltScreen} />
        {__DEV__ ? (
          <>
            <Stack.Screen name="dev/Gallery" component={GalleryRoute} />
            <Stack.Screen name="dev/Tokens" component={TokensRoute} />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
