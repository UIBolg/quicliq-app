/**
 * Payment card — realistic card face (code addition: Saved cards 12.4 + Add a card sheet; no Figma component yet,
 * docs/figma-issues.md #47). Width fills its parent, height from `sizes.paymentCard.aspect` (ISO 1.586), radius/lg.
 * Front: brand fill (Visa = Neutral/Ink, Mastercard = Primary/Red, unknown = Neutral/Slate; brand colours aren't tokens)
 *   with two soft Alpha/White circles · chip (Alpha/White 50%, radius/xs) + contactless icon · number in 4 groups
 *   (EN H3, White, letter-spaced, always LTR) · "Expires" label + MM/YY · brand mark at the end (VISA / two circles).
 * Back: magnetic strip (Neutral/Ink) · signature band (Neutral/White) with the CVV · brand mark.
 * `flipped` animates a 3D flip (rotateY, `states.motion.sheet`); the faces swap at 90°. Never mirrored.
 */
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { getTextStyle, useTheme, type ColorToken } from '../theme';

export type CardBrand = 'Visa' | 'Mastercard' | 'Unknown';

export type PaymentCardProps = {
  brand: CardBrand;
  /** Digits only (0–16); missing digits show as •. */
  number: string;
  /** MM/YY (may be partial). */
  expires: string;
  cvv?: string;
  expiresLabel: string;
  flipped?: boolean;
  /** Mask all but the last 4 digits (saved cards). */
  masked?: boolean;
  accessibilityLabel?: string;
};

const fill: Record<CardBrand, ColorToken> = { Visa: 'Neutral/Ink', Mastercard: 'Primary/Red', Unknown: 'Neutral/Slate' };

export function PaymentCard({ brand, number, expires, cvv = '', expiresLabel, flipped = false, masked, accessibilityLabel }: PaymentCardProps) {
  const t = useTheme();
  const s = t.sizes.paymentCard;
  const turn = useRef(new Animated.Value(flipped ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(turn, { toValue: flipped ? 1 : 0, duration: t.states.motion.sheet * 2, useNativeDriver: true }).start();
  }, [flipped, turn, t.states.motion.sheet]);

  const front = turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const back = turn.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = turn.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = turn.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const padded = (number + '•'.repeat(16)).slice(0, 16);
  const shown = masked ? '•'.repeat(12) + number.slice(-4) : padded;
  const groups = shown.replace(/(.{4})(?=.)/g, '$1 ');
  const digitStyle = [getTextStyle('H3', 'en'), { color: t.colors['Neutral/White'], letterSpacing: s.numberSpacing }];
  const face = {
    position: 'absolute' as const, top: 0, right: 0, bottom: 0, left: 0,
    borderRadius: t.radius['radius/lg'],
    backgroundColor: t.colors[fill[brand]],
    padding: t.spacing['spacing/16'] + t.spacing['spacing/4'],
    overflow: 'hidden' as const,
    backfaceVisibility: 'hidden' as const,
  };

  const mark = brand === 'Visa' ? (
    <AppText variant="H3" color="Neutral/White" style={[getTextStyle('H3', 'en'), { color: t.colors['Neutral/White'], fontStyle: 'italic' }]}>VISA</AppText>
  ) : brand === 'Mastercard' ? (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: s.markDot, height: s.markDot, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 85%'] }} />
      <View style={{ width: s.markDot, height: s.markDot, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 50%'], marginLeft: -s.markDot / 2.5 }} />
    </View>
  ) : null;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={{ width: '100%', aspectRatio: s.aspect, direction: 'ltr' }}>
      {/* Front */}
      <Animated.View style={[face, { opacity: frontOpacity, transform: [{ perspective: s.perspective }, { rotateY: front }] }]}>
        <View pointerEvents="none" style={{ position: 'absolute', width: s.glow, height: s.glow, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 14%'], top: -s.glow / 3, right: -s.glow / 4 }} />
        <View pointerEvents="none" style={{ position: 'absolute', width: s.glow * 0.7, height: s.glow * 0.7, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 14%'], bottom: -s.glow / 3, left: -s.glow / 6 }} />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ width: s.chipW, height: s.chipH, borderRadius: t.radius['radius/xs'], backgroundColor: t.colors['Alpha/White 50%'] }} />
            <Icon name="zap" size={t.sizes.icon.md} color="Alpha/White 80%" />
          </View>
          <AppText variant="H3" style={digitStyle} numberOfLines={1} adjustsFontSizeToFit>{groups}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View>
              <AppText variant="Overline" color="Alpha/White 70%">{expiresLabel}</AppText>
              <AppText variant="Body Medium" style={[getTextStyle('Body Medium', 'en'), { color: t.colors['Neutral/White'] }]}>{expires || 'MM/YY'}</AppText>
            </View>
            {mark}
          </View>
        </View>
      </Animated.View>
      {/* Back */}
      <Animated.View style={[face, { padding: 0, opacity: backOpacity, transform: [{ perspective: s.perspective }, { rotateY: back }] }]}>
        <View style={{ height: s.strip, backgroundColor: t.colors['Neutral/Ink'], marginTop: t.spacing['spacing/24'] }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], margin: t.spacing['spacing/16'] + t.spacing['spacing/4'] }}>
          <View style={{ flex: 1, height: s.chipH + t.spacing['spacing/8'], borderRadius: t.radius['radius/xs'], backgroundColor: t.colors['Neutral/White'], alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: t.spacing['spacing/12'] }}>
            <AppText variant="Body Medium" style={[getTextStyle('Body Medium', 'en'), { color: t.colors['Neutral/Ink'], letterSpacing: s.numberSpacing }]}>{(cvv + '•••').slice(0, 3)}</AppText>
          </View>
          <AppText variant="Overline" color="Alpha/White 80%">CVV</AppText>
        </View>
        <View style={{ position: 'absolute', bottom: t.spacing['spacing/16'] + t.spacing['spacing/4'], right: t.spacing['spacing/16'] + t.spacing['spacing/4'] }}>{mark}</View>
      </Animated.View>
    </View>
  );
}
