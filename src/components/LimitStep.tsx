/**
 * Limit Step — one row of the "Your sending limit" sheet (code addition, no Figma component yet; docs/figma-issues.md #39).
 * Row, gap spacing/12, padding spacing/12 vertical, Alpha/Ink 10% hairline between rows (stroke/xs):
 *  status badge (Icon Badge 32): done = Success + check · current = Red tint + the step's icon · locked = Grey + lock
 *  title (Body Medium; Slate when locked) over hint (Caption, Slate)
 *  amount (Body Medium, EN style, LTR) over note (Caption; Status/Success/Default when `gain`, i.e. the extra the current step unlocks).
 * The current step sits on Alpha/Red 4% with radius/md so it reads as "you are here".
 */
import { View } from 'react-native';
import { AppText } from './AppText';
import { IconBadge } from './IconBadge';
import type { IconName } from './Icon';
import { getTextStyle, useTheme } from '../theme';

export type LimitStepStatus = 'done' | 'current' | 'locked';

export type LimitStepProps = {
  status: LimitStepStatus;
  icon: IconName;
  title: string;
  hint: string;
  amount: string;
  note: string;
  /** The note is the amount gained (shown in success green). */
  gain?: boolean;
  /** Spoken status, e.g. "Done" / "Next step" / "Locked". */
  statusLabel: string;
  divider?: boolean;
};

export function LimitStep({ status, icon, title, hint, amount, note, gain, statusLabel, divider }: LimitStepProps) {
  const t = useTheme();
  const current = status === 'current';
  const badge =
    status === 'done' ? <IconBadge icon="check" size={32} tone="success" />
      : current ? <IconBadge icon={icon} size={32} tone="redTint" />
        : <IconBadge icon="lock" size={32} tone="grey" />;
  return (
    <View
      accessible
      accessibilityLabel={`${title}, ${statusLabel}. ${hint}. ${amount} ${note}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacing['spacing/12'],
        paddingVertical: t.spacing['spacing/12'],
        paddingHorizontal: current ? t.spacing['spacing/12'] : undefined,
        marginHorizontal: current ? -t.spacing['spacing/12'] : undefined,
        borderRadius: current ? t.radius['radius/md'] : undefined,
        backgroundColor: current ? t.colors['Alpha/Red 4%'] : undefined,
        borderTopWidth: divider && !current ? t.stroke['stroke/xs'] : undefined,
        borderTopColor: t.colors['Alpha/Ink 10%'],
      }}
    >
      {badge}
      <View style={{ flex: 1 }}>
        <AppText variant="Body Medium" color={status === 'locked' ? 'Neutral/Slate' : 'Neutral/Ink'}>{title}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">{hint}</AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText variant="Body Medium" style={[getTextStyle('Body Medium', 'en'), { color: t.colors[status === 'locked' ? 'Neutral/Slate' : 'Neutral/Ink'] }]}>
          {amount}
        </AppText>
        <AppText variant="Caption" color={gain ? 'Status/Success/Default' : 'Neutral/Slate'}>{note}</AppText>
      </View>
    </View>
  );
}
