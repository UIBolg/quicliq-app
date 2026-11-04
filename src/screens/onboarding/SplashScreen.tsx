/**
 * Splash — Loading. Figma EN 82:11650 / AR 82:11716: Primary/Red screen, light status bar, Lottie animation on top —
 * the product owner's splash.json (390×844, plays once, covers the screen; still last frame with Reduce Motion).
 * Resolves docs/figma-issues.md #23.
 * Waits for the saved language (and, later, app config / forced-update checks) then replaces itself with Onboarding.
 */
import { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { splashLottie } from '../../assets/lottie';
import { useReduceMotion } from '../../platform/reduceMotion';
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
  const reduce = useReduceMotion();

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => navigation.replace('Onboarding'), t.states.motion.splashMin);
    return () => clearTimeout(id);
  }, [ready, navigation, t.states.motion.splashMin]);

  return (
    <Screen background="Primary/Red" statusBar="light" edges={[]}>
      <View style={{ flex: 1 }} accessible accessibilityRole="progressbar" accessibilityLabel={`${tr('common.logo')}, ${tr('common.loading')}`}>
        <LottieView source={splashLottie} autoPlay={!reduce} loop={false} progress={reduce ? 1 : undefined} resizeMode="cover" style={{ flex: 1 }} />
      </View>
    </Screen>
  );
}
