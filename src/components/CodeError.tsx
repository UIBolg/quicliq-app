/**
 * Code error box — local pattern in the code-entry screens (7.2d 220:6766, 7.10 99:2845; also 2.6):
 * Status/Failure/Light, radius/md, padding spacing/16, gap spacing/8.
 * Row 1: alert icon 18 (Failure, centred in a Body Medium line) + message (Body Medium, Failure), gap spacing/8.
 * Row 2: attempt bars 16×4 radius/full, gap spacing/4 — used attempts Failure, remaining Neutral/Silver —
 *        + "n attempts left" (Caption, Slate), gap spacing/8. Plural forms come from i18next (Arabic dual/plural).
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useTheme } from '../theme';

export function CodeError({ message, attemptsLeft, attemptsTotal = 3 }: { message: string; attemptsLeft?: number; attemptsTotal?: number }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const used = attemptsLeft === undefined ? 0 : attemptsTotal - attemptsLeft;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={{
        backgroundColor: t.colors['Status/Failure/Light'],
        borderRadius: t.radius['radius/md'],
        padding: t.spacing['spacing/16'],
        gap: t.spacing['spacing/8'],
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: t.spacing['spacing/8'] }}>
        <View style={{ height: t.text('Body Medium').lineHeight, justifyContent: 'center' }}>
          <Icon name="alert" size={t.sizes.codeError.icon} color="Status/Failure/Default" />
        </View>
        <AppText variant="Body Medium" color="Status/Failure/Default" style={{ flex: 1 }}>{message}</AppText>
      </View>
      {attemptsLeft !== undefined ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
          <View style={{ flexDirection: 'row', gap: t.spacing['spacing/4'] }}>
            {Array.from({ length: attemptsTotal }, (_, i) => (
              <View
                key={i}
                style={{
                  width: t.sizes.codeError.barWidth,
                  height: t.sizes.codeError.barHeight,
                  borderRadius: t.radius['radius/full'],
                  backgroundColor: t.colors[i < used ? 'Status/Failure/Default' : 'Neutral/Silver'],
                }}
              />
            ))}
          </View>
          <AppText variant="Caption" color="Neutral/Slate">{tr('components.codeError.attemptsLeft', { count: attemptsLeft })}</AppText>
        </View>
      ) : null}
    </View>
  );
}
