/**
 * Onboarding illustration — the "Illustration" block of Onboarding 1–4 (202:6433 …):
 * Neutral/Fog canvas, radius/2xl, 360 high, full width inside the screen gutter, scene artwork 342×360 at start.
 * Artwork exported from Figma (assets/illustrations/onboarding). Only scene 1 is mirrored in the AR frames
 * (202:6762 vs 202:6843/6919/6998), so only `sendMoney` flips in RTL — see docs/figma-issues.md #19.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { onboardingXml } from '../assets/onboarding.generated';
import { useTheme } from '../theme';

export type OnboardingSceneName = 'sendMoney' | 'rates' | 'receiving' | 'secure';
const MIRRORED_IN_RTL: ReadonlySet<OnboardingSceneName> = new Set(['sendMoney']);

export function OnboardingScene({ name }: { name: OnboardingSceneName }) {
  const t = useTheme();
  const { sceneWidth: w, sceneHeight: h } = t.sizes.onboarding;
  const flip = t.isRTL && MIRRORED_IN_RTL.has(name);
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{
        height: h,
        alignSelf: 'stretch',
        backgroundColor: t.colors['Neutral/Fog'],
        borderRadius: t.radius['radius/2xl'],
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ width: w, height: h, transform: flip ? [{ scaleX: -1 }] : undefined }}>
        <SvgXml xml={onboardingXml[name]} width={w} height={h} />
      </View>
    </View>
  );
}
