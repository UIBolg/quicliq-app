/**
 * Step Header — build doc component 4 (Registration frames, e.g. 71:869): Back button · "Step x of y" (Caption, Slate) ·
 * screen title (H2) · segmented progress bar (one segment per step, `sizes.progress.sm` high, radius/full, gap spacing/4;
 * done and current segments Primary/Red, the rest Neutral/Dark Fog). Supports up to 3 steps.
 * Padding pt spacing/8, gutter, pb spacing/16; gap spacing/12.
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { BackButton } from './BackButton';
import { useTheme } from '../theme';

export function StepHeader({ step, total, title, onBack }: { step: number; total: number; title: string; onBack: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const label = tr('registration.step', { step, total });
  return (
    <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/16'], gap: t.spacing['spacing/12'] }}>
      <View style={{ alignItems: 'flex-start' }}>
        <BackButton onPress={onBack} testID="back" />
      </View>
      <View style={{ gap: t.spacing['spacing/4'] }}>
        <AppText variant="Caption" color="Neutral/Slate">{label}</AppText>
        <AppText variant="H2" accessibilityRole="header">{title}</AppText>
      </View>
      <View accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: total, now: step }} style={{ flexDirection: 'row', gap: t.spacing['spacing/4'] }}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={{ flex: 1, height: t.sizes.progress.sm, borderRadius: t.radius['radius/full'], backgroundColor: t.colors[i < step ? 'Primary/Red' : 'Neutral/Dark Fog'] }} />
        ))}
      </View>
    </View>
  );
}
