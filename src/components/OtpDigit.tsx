/**
 * OTP Digit — Figma 280:8044. One 46×60 box, radius/md. Digit in EN/H2 (Western digits, same in both languages).
 *  Empty   — Neutral/Fog, no border
 *  Focused — Neutral/Fog, Primary/Red border stroke/xl, 2×28 Primary/Red caret
 *  Filled  — Neutral/White, Neutral/Silver border stroke/xs, Ink digit
 *  Error   — Status/Failure/Light, Failure border stroke/xl, Failure digit
 *  Success — Status/Success/Light, Success border stroke/xl, Success digit
 */
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme, getTextStyle, type ColorToken, type StrokeToken } from '../theme';

export type OtpDigitState = 'empty' | 'focused' | 'filled' | 'error' | 'success';

const look: Record<OtpDigitState, { bg: ColorToken; border?: ColorToken; width?: StrokeToken; fg: ColorToken }> = {
  empty: { bg: 'Neutral/Fog', fg: 'Neutral/Ink' },
  focused: { bg: 'Neutral/Fog', border: 'Primary/Red', width: 'stroke/xl', fg: 'Neutral/Ink' },
  filled: { bg: 'Neutral/White', border: 'Neutral/Silver', width: 'stroke/xs', fg: 'Neutral/Ink' },
  error: { bg: 'Status/Failure/Light', border: 'Status/Failure/Default', width: 'stroke/xl', fg: 'Status/Failure/Default' },
  success: { bg: 'Status/Success/Light', border: 'Status/Success/Default', width: 'stroke/xl', fg: 'Status/Success/Default' },
};

function Caret() {
  const t = useTheme();
  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: t.states.motion.caret, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: t.states.motion.caret, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blink, t.states.motion.caret]);
  return (
    <Animated.View
      style={{ opacity: blink, width: t.sizes.otpDigit.caretWidth, height: t.sizes.otpDigit.caretHeight, backgroundColor: t.colors['Primary/Red'] }}
    />
  );
}

export function OtpDigit({ state, value }: { state: OtpDigitState; value?: string }) {
  const t = useTheme();
  const c = look[state];
  return (
    <View
      style={{
        width: t.sizes.otpDigit.width,
        height: t.sizes.otpDigit.height,
        borderRadius: t.radius['radius/md'],
        backgroundColor: t.colors[c.bg],
        borderWidth: c.width ? t.stroke[c.width] : 0,
        borderColor: c.border ? t.colors[c.border] : undefined,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {state === 'focused' ? (
        <Caret />
      ) : value ? (
        // Digits are always EN/H2 so they stay Western and identical in Arabic.
        <AppText variant="H2" color={c.fg} style={[getTextStyle('H2', 'en'), { textAlign: 'center' }]}>{value}</AppText>
      ) : null}
    </View>
  );
}
