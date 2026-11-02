/**
 * Limit Step — one row of the "Your sending limit" sheet, as in the product owner's design (no Figma component yet;
 * docs/figma-issues.md #39). Row, gap spacing/12, padding spacing/12 vertical:
 *  status badge (32 circle): done = Icon Badge Success + check · current = Alpha/Red 10% circle with a Primary/Red dot ·
 *    locked = Icon Badge Grey + lock
 *  title (Body Medium) over hint (Caption, Slate)
 *  amount (Body Medium, EN style, LTR) over note (Caption, Slate), aligned to the end.
 */
import { View } from 'react-native';
import { AppText } from './AppText';
import { IconBadge } from './IconBadge';
import { getTextStyle, useTheme } from '../theme';

export type LimitStepStatus = 'done' | 'current' | 'locked';

export type LimitStepProps = {
  status: LimitStepStatus;
  title: string;
  hint: string;
  amount: string;
  note: string;
  /** Spoken status, e.g. "Done" / "Next step" / "Locked". */
  statusLabel: string;
};

export function LimitStep({ status, title, hint, amount, note, statusLabel }: LimitStepProps) {
  const t = useTheme();
  const d = t.sizes.limitStep;
  const badge =
    status === 'done' ? <IconBadge icon="check" size={32} tone="success" />
      : status === 'locked' ? <IconBadge icon="lock" size={32} tone="grey" />
        : (
          <View style={{ width: d.badge, height: d.badge, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/Red 10%'], alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: d.dot, height: d.dot, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Primary/Red'] }} />
          </View>
        );
  return (
    <View
      accessible
      accessibilityLabel={`${title}, ${statusLabel}. ${hint}. ${amount} ${note}`}
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: t.spacing['spacing/12'], paddingVertical: t.spacing['spacing/12'] }}
    >
      {badge}
      <View style={{ flex: 1 }}>
        <AppText variant="Body Medium">{title}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">{hint}</AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText variant="Body Medium" style={[getTextStyle('Body Medium', 'en'), { color: t.colors['Neutral/Ink'] }]}>{amount}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">{note}</AppText>
      </View>
    </View>
  );
}
