/**
 * Splash — Loading. Matches the visible Figma frames EN 82:11650 / AR 82:11716: a plain Primary/Red screen with a
 * light status bar. In Figma the content is a Lottie animation (placeholder layer linking to LottieFiles); the file
 * is not in Figma yet, so nothing is drawn on top (docs/figma-issues.md #23).
 * Waits for the saved language (and, later, app config / forced-update checks) then replaces itself with Onboarding.
 */
import { useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components';
import { useLocale } from '../../i18n/LocaleProvider';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

export function SplashScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { ready } = useLocale();

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => navigation.replace('Onboarding'), t.states.motion.splashMin);
    return () => clearTimeout(id);
  }, [ready, navigation, t.states.motion.splashMin]);

  return (
    <Screen background="Primary/Red" statusBar="light" edges={[]}>
      <View style={{ flex: 1 }} accessible accessibilityRole="progressbar" accessibilityLabel={`${tr('common.logo')}, ${tr('common.loading')}`} />
    </Screen>
  );
}
