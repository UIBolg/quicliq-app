/**
 * React Navigation native stack; route names are Figma screen IDs (see routes.ts).
 * dev/* routes (read-only component gallery + tokens) are registered only in development builds.
 */
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { useEffect } from 'react';
import { inDeviceFrame } from '../platform/deviceFrame';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocale } from '../i18n/LocaleProvider';
import { useTheme } from '../theme';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { LoginScreen } from '../screens/login/LoginScreen';
import { VerifyLoginScreen } from '../screens/login/VerifyLoginScreen';
import { ChooseCodeMethodScreen } from '../screens/login/ChooseCodeMethodScreen';
import { OfflineScreen } from '../screens/login/OfflineScreen';
import { IdExpiredScreen } from '../screens/login/IdExpiredScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ActivityScreen } from '../screens/activity/ActivityScreen';
import { AccountScreen } from '../screens/account/AccountScreen';
import { PersonalDetailsScreen } from '../screens/account/PersonalDetailsScreen';
import { ChangePasswordScreen } from '../screens/account/ChangePasswordScreen';
import { SavedCardsScreen } from '../screens/account/SavedCardsScreen';
import { SecurityScreen } from '../screens/account/SecurityScreen';
import { LanguageScreen } from '../screens/account/LanguageScreen';
import { LegalDocumentScreen, LegalScreen } from '../screens/account/LegalScreen';
import { HelpScreen } from '../screens/account/HelpScreen';
import { NotificationsScreen } from '../screens/account/NotificationsScreen';
import { NotBuiltScreen } from '../screens/NotBuiltScreen';
import { ComponentGallery } from '../screens/dev/ComponentGallery';
import { FoundationsScreen } from '../screens/dev/FoundationsScreen';
import type { RootStackParamList } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/** Device-frame preview only: lets the review page's "Jump to screen" menu open routes and switch language. */
function usePreviewHooks() {
  const { setLocale } = useLocale();
  useEffect(() => {
    if (!inDeviceFrame) return;
    const w = window as unknown as Record<string, unknown>;
    w.__QUICLIQ_PREVIEW__ = {
      open: (route: string, params?: object) => {
        if (!navigationRef.isReady()) return;
        navigationRef.reset({ index: 0, routes: [{ name: route as keyof RootStackParamList, params: params as never }] });
      },
      setLocale,
    };
  }, [setLocale]);
}

function GalleryRoute({ navigation }: NativeStackScreenProps<RootStackParamList, 'dev/Gallery'>) {
  const { locale, setLocale } = useLocale();
  return <ComponentGallery onToggleLocale={() => setLocale(locale === 'en' ? 'ar' : 'en')} onShowTokens={() => navigation.navigate('dev/Tokens')} />;
}

function TokensRoute({ navigation }: NativeStackScreenProps<RootStackParamList, 'dev/Tokens'>) {
  return <FoundationsScreen onToggleLocale={() => navigation.goBack()} />;
}

export function RootNavigator() {
  const t = useTheme();
  usePreviewHooks();
  return (
    <NavigationContainer
      ref={navigationRef}
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
        <Stack.Screen name="7.5" component={OfflineScreen} />
        <Stack.Screen name="7.6" component={IdExpiredScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="11.1" component={ActivityScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="12.1" component={AccountScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="12.2" component={PersonalDetailsScreen} />
        <Stack.Screen name="12.3" component={ChangePasswordScreen} />
        <Stack.Screen name="12.4" component={SavedCardsScreen} />
        <Stack.Screen name="12.5" component={SecurityScreen} />
        <Stack.Screen name="12.6" component={LanguageScreen} />
        <Stack.Screen name="12.7" component={LegalScreen} />
        <Stack.Screen name="12.7a" component={LegalDocumentScreen} />
        <Stack.Screen name="13.1" component={HelpScreen} />
        <Stack.Screen name="13.2" component={NotificationsScreen} />
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
