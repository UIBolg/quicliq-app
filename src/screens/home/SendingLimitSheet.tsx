/**
 * "Your sending limit" sheet — opened from the Home limit card (and the level pill on it). Based on the product
 * owner's sketch; no Figma frame yet (docs/figma-issues.md #39).
 * Bottom Sheet (as in the owner's design): title (H3) · usage line (Body Large, Slate) · 3 Limit Steps
 * (done / current / locked) · Primary "Raise my limit" → the current step's flow (hidden at level 3, where a success line shows instead).
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, BottomSheet, Button, LimitStep, type LimitStepStatus } from '../../components';
import { limitLevels, limitTotal, nextLevel, type LimitLevel } from '../../mock/account';
import { formatMoney } from '../../utils/format';
import { useTheme } from '../../theme';

const k = 'home.limitSheet';

export function SendingLimitSheet({ visible, level, sent, onClose, onRaise }: {
  visible: boolean;
  level: LimitLevel;
  sent: number;
  onClose: () => void;
  /** Called with the route of the step that raises the limit next. */
  onRaise: (route: string) => void;
}) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const total = limitTotal(level);
  const nextRoute = nextLevel(level)?.route;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={{ gap: t.spacing['spacing/4'] }}>
        <AppText variant="H3" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
        <AppText variant="Body Large" color="Neutral/Slate">
          {tr(`${k}.usage`, { used: formatMoney(sent), left: formatMoney(Math.max(0, total - sent)) })}
        </AppText>
      </View>

      <View>
        {limitLevels.map((step, i) => {
          const status: LimitStepStatus = i < level ? 'done' : i === level ? 'current' : 'locked';
          const amount = step.total != null ? formatMoney(step.total) : tr(`${k}.over`, { amount: formatMoney(limitLevels[i - 1].total ?? 0) });
          const hint = status === 'done' ? tr(`${k}.done`) : tr(`${k}.steps.${step.key}.${status}`);
          return (
            <LimitStep
              key={step.key}
              status={status}
              title={tr(`${k}.steps.${step.key}.title`)}
              hint={hint}
              amount={amount}
              note={tr(`${k}.total`)}
              statusLabel={tr(`${k}.status.${status}`)}
            />
          );
        })}
      </View>

      {nextRoute ? (
        <Button label={tr(`${k}.raise`)} onPress={() => onRaise(nextRoute)} testID="raise-limit" />
      ) : (
        <AppText variant="Body Medium" color="Status/Success/Default">{tr(`${k}.allDone`)}</AppText>
      )}
    </BottomSheet>
  );
}
