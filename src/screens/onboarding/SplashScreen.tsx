/**
 * Splash — Loading. Figma EN 82:11650 is only a Lottie placeholder; layout taken from AR 82:11716:
 * Primary/Red background, two decorative white circles, white Logo 200 wide, tagline (AR/Body Large, white —
 * Arabic only, the build doc gives no EN tagline), white spinner near the bottom. Light status bar.
 * Waits for the saved language (and, later, app config / forced-update checks) then replaces itself with Onboarding.
 */
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Logo, Screen } from '../../components';
import { useLocale } from '../../i18n/LocaleProvider';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

export function SplashScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { ready } = useLocale();
  const s = t.sizes.splash;
  const tagline = tr('splash.tagline');

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => navigation.replace('Onboarding'), t.states.motion.splashMin);
    return () => clearTimeout(id);
  }, [ready, navigation, t.states.motion.splashMin]);

  const deco = (d: { size: number; top: number; start: number }) => ({
    position: 'absolute' as const,
    width: d.size,
    height: d.size,
    top: d.top,
    start: d.start,
    borderRadius: t.radius['radius/full'],
    // Figma: white at 10% opacity — no Alpha/White 10% token exists (docs/figma-issues.md #20); closest token.
    backgroundColor: t.colors['Alpha/White 14%'],
  });

  return (
    <Screen background="Primary/Red" statusBar="light" edges={[]}>
      {/* Decoration is not directional: positions are kept exactly as in AR 82:11716 for both languages. */}
      <View style={[StyleSheet.absoluteFill, { direction: 'ltr' }]} pointerEvents="none">
        <View style={deco(s.decoLarge)} />
        <View style={deco(s.decoSmall)} />
      </View>
      <View style={styles.center}>
        <View style={{ alignItems: 'center', gap: t.spacing['spacing/24'] }}>
          <Logo tone="white" height={s.logoWidth / t.sizes.logo.aspectRatio} />
          {tagline ? (
            <AppText variant="Body Large" color="Neutral/White" style={{ textAlign: 'center' }}>{tagline}</AppText>
          ) : null}
        </View>
      </View>
      <View style={{ alignItems: 'center', paddingBottom: t.spacing['spacing/80'] }}>
        <ActivityIndicator color={t.colors['Neutral/White']} accessibilityLabel={tr('common.loading')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
