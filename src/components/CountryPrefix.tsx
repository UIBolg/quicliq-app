/**
 * Country Prefix — Figma 281:9863. Fixed "+44" with UK flag and a 14 lock: 112×64, Neutral/Fog, radius/lg,
 * padding 0/spacing/16, gap spacing/8. "+44" uses EN/Body Large in both languages (Latin digits) and is never mirrored.
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { Flag } from './Flag';
import { Icon } from './Icon';
import { getTextStyle, useTheme } from '../theme';

export function CountryPrefix() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View
      accessible
      accessibilityLabel={tr('components.countryPrefix')}
      style={{
        width: t.sizes.countryPrefix.width,
        height: t.sizes.textField.height,
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacing['spacing/8'],
        paddingHorizontal: t.spacing['spacing/16'],
        borderRadius: t.radius['radius/lg'],
        backgroundColor: t.colors['Neutral/Fog'],
        direction: 'ltr',
      }}
    >
      <Flag country="UK" />
      <Text style={[getTextStyle('Body Large', 'en'), { color: t.colors['Neutral/Ink'] }]}>+44</Text>
      <Icon name="lock" size={t.sizes.countryPrefix.lock} color="Neutral/Slate" mirror={false} />
    </View>
  );
}
