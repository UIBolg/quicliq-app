/**
 * "Your sending limit" sheet — opened from the Home limit card (and the level pill on it). Based on the product
 * owner's sketch; no Figma frame yet (docs/figma-issues.md #39).
 * Bottom Sheet: Sheet Header (title, close) · usage line (Body, Slate) · 3 Limit Steps (done / current / locked) ·
 * Primary "Raise my limit" → the current step's flow (hidden at level 3, where a success line shows instead).
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, BottomSheet, Button, LimitStep, SheetHeader, type LimitStepStatus } from '../../components';
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
        <SheetHeader title={tr(`${k}.title`)} onClose={onClose} />
        <AppText variant="Body" color="Neutral/Slate">
          {tr(`${k}.usage`, { used: formatMoney(sent), left: formatMoney(Math.max(0, total - sent)) })}
        </AppText>
      </View>

      <View>
        {limitLevels.map((step, i) => {
          const status: LimitStepStatus = i < level ? 'done' : i === level ? 'current' : 'locked';
          const prev = i > 0 ? limitLevels[i - 1].total : null;
          const amount = step.total != null ? formatMoney(step.total) : tr(`${k}.over`, { amount: formatMoney(prev ?? 0) });
          const gain = status === 'current' && step.total != null && prev != null ? step.total - prev : null;
          const note = gain != null ? tr(`${k}.more`, { amount: formatMoney(gain) }) : tr(`${k}.total`);
          const hint = status === 'done' ? tr(`${k}.done`) : status === 'locked' ? tr(`${k}.locked`) : tr(`${k}.steps.${step.key}.hint`);
          return (
            <LimitStep
              key={step.key}
              status={status}
              icon={step.icon}
              title={tr(`${k}.steps.${step.key}.title`)}
              hint={hint}
              amount={amount}
              note={note}
              gain={gain != null}
              statusLabel={tr(`${k}.status.${status}`)}
              divider={i > 0}
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
