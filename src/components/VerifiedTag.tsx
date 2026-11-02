/**
 * Verified Tag — Figma 282:9835. Status/Success/Light pill (radius/full), padding spacing/4 × spacing/8,
 * gap spacing/8, 14 check icon + Caption label in Status/Success/Default. Icon sits on the start side.
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useTheme } from '../theme';

export function VerifiedTag({ label }: { label?: string }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View
      accessible
      accessibilityLabel={label ?? tr('common.matched')}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: t.spacing['spacing/8'],
        paddingHorizontal: t.spacing['spacing/8'],
        paddingVertical: t.spacing['spacing/4'],
        borderRadius: t.radius['radius/full'],
        backgroundColor: t.colors['Status/Success/Light'],
      }}
    >
      <Icon name="check" size={t.sizes.verifiedTag.icon} color="Status/Success/Default" />
      <AppText variant="Caption" color="Status/Success/Default">{label ?? tr('common.matched')}</AppText>
    </View>
  );
}
