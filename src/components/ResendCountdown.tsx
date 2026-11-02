/**
 * Resend Countdown — Figma 281:9668.
 *  Counting — 20 countdown ring (Neutral/Fog track, Neutral/Slate arc, stroke/2xl) + "Resend code in m:ss"
 *             (Body Medium, Slate), gap spacing/8. The arc shows the time left.
 *  Unlocked — refresh icon 16 + "Resend code" (Body Medium, Primary/Red), gap spacing/6; tappable.
 * Icon sits at the start (left in EN, right in AR, as in the AR variants). Time is always Western digits m:ss.
 */
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useTheme } from '../theme';

/** Seconds left, counting down once per second from `seconds`; restart by changing `key`. */
export function useCountdown(seconds: number, key: unknown = 0) {
  const [left, setLeft] = useState(seconds);
  const end = useRef(0);
  useEffect(() => {
    end.current = Date.now() + seconds * 1000;
    setLeft(seconds);
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((end.current - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [seconds, key]);
  return left;
}

export const formatMSS = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function Ring({ fraction }: { fraction: number }) {
  const t = useTheme();
  const d = t.sizes.resendCountdown.ring;
  const w = t.stroke['stroke/2xl'];
  const r = d / 2 - t.spacing['spacing/2']; // centre-line radius: Figma r = 8 in the 20 box
  const c = 2 * Math.PI * r;
  return (
    <Svg width={d} height={d}>
      <Circle cx={d / 2} cy={d / 2} r={r} stroke={t.colors['Neutral/Fog']} strokeWidth={w} fill="none" />
      <Circle
        cx={d / 2}
        cy={d / 2}
        r={r}
        stroke={t.colors['Neutral/Slate']}
        strokeWidth={w}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${c * fraction} ${c}`}
        // start at 12 o'clock, run clockwise (a clock is not mirrored in RTL)
        transform={`rotate(-90 ${d / 2} ${d / 2})`}
      />
    </Svg>
  );
}

export type ResendCountdownProps = {
  /** Seconds left; 0 = Unlocked. */
  secondsLeft: number;
  /** Total seconds of the countdown, for the ring. */
  total: number;
  onResend: () => void;
  testID?: string;
};

export function ResendCountdown({ secondsLeft, total, onResend, testID }: ResendCountdownProps) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  if (secondsLeft > 0) {
    const time = formatMSS(secondsLeft);
    return (
      <View
        testID={testID}
        accessible
        accessibilityRole="timer"
        accessibilityLabel={tr('components.resend.counting', { time })}
        style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}
      >
        <Ring fraction={total > 0 ? secondsLeft / total : 0} />
        <AppText variant="Body Medium" color="Neutral/Slate">{tr('components.resend.counting', { time: `⁦${time}⁩` })}</AppText>
      </View>
    );
  }
  return (
    <Pressable
      testID={testID}
      onPress={onResend}
      accessibilityRole="button"
      accessibilityLabel={tr('components.resend.action')}
      hitSlop={t.spacing['spacing/12']}
      style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/6'] }}
    >
      {({ pressed }) => (
        <>
          <Icon name="refresh" size={t.sizes.resendCountdown.icon} color="Primary/Red" />
          <AppText variant="Body Medium" color="Primary/Red" style={pressed ? { textDecorationLine: 'underline' } : undefined}>
            {tr('components.resend.action')}
          </AppText>
        </>
      )}
    </Pressable>
  );
}
