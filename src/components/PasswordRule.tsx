/**
 * Password Rule — Figma 281:7369. Row, gap spacing/8, Body text.
 * Met: Icon Badge 20 Success (white check) + Status/Success/Default text.
 * Unmet: 20 empty circle (Neutral/Silver outline) + Neutral/Slate text.
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { IconBadge } from './IconBadge';
import { useTheme } from '../theme';

export function PasswordRule({ label, met }: { label: string; met: boolean }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const d = t.sizes.passwordRule.indicator;
  return (
    <View
      accessible
      accessibilityLabel={`${label}, ${tr(met ? 'common.ruleMet' : 'common.ruleUnmet')}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}
    >
      {met ? (
        <IconBadge icon="check" size={20} tone="success" />
      ) : (
        <View style={{ width: d, height: d, borderRadius: t.radius['radius/full'], borderWidth: t.stroke['stroke/md'], borderColor: t.colors['Neutral/Silver'] }} />
      )}
      <AppText variant="Body" color={met ? 'Status/Success/Default' : 'Neutral/Slate'} style={{ flex: 1 }}>
        {label}
      </AppText>
    </View>
  );
}
