/**
 * Spot illustration — Figma "Icons & Illustrations" 79:389 (160 artboards). Plays the product owner's Lottie
 * animation for the name (src/assets/lottie.ts, looping); falls back to the exported static SVG
 * (assets/illustrations) when there is no animation. With "Reduce Motion" on, the animation is shown paused on its
 * last frame. Never mirrored. Decorative: screens carry the meaning in their heading.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import { illustrationXml } from '../assets/illustrations.generated';
import { lottieSources } from '../assets/lottie';
import { useReduceMotion } from '../platform/reduceMotion';
import { useTheme } from '../theme';

export type IllustrationName = keyof typeof lottieSources;

export function Illustration({ name, size, loop = true }: { name: IllustrationName; size?: number; loop?: boolean }) {
  const t = useTheme();
  const reduce = useReduceMotion();
  const d = size ?? t.sizes.illustration.default;
  const svg = (illustrationXml as Record<string, string | undefined>)[name];
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: d, height: d, direction: 'ltr' }}>
      {lottieSources[name] ? (
        <LottieView source={lottieSources[name]} autoPlay={!reduce} loop={loop && !reduce} progress={reduce ? 1 : undefined} style={{ width: d, height: d }} />
      ) : svg ? (
        <SvgXml xml={svg} width={d} height={d} />
      ) : null}
    </View>
  );
}
