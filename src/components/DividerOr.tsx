/**
 * Divider / Or — Figma 280:8553. Two hairlines (Neutral/Silver, stroke/xs) with a centred
 * Caption label in Neutral/Slate, gap spacing/16.
 * Note: Figma uses EN/Caption even in Arabic screens; we use AR/Caption for Arabic (build rule 5).
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { useTheme } from '../theme';

export function DividerOr({ label }: { label?: string }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const line = { flex: 1, height: t.stroke['stroke/xs'], backgroundColor: t.colors['Neutral/Silver'] };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'], alignSelf: 'stretch' }}>
      <View style={line} />
      <AppText variant="Caption" color="Neutral/Slate">{label ?? tr('common.or')}</AppText>
      <View style={line} />
    </View>
  );
}
