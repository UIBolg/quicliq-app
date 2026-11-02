/**
 * Pagination — Figma 12:57. Onboarding page indicator: 8 dots, active dot 24 wide, gap spacing/8.
 * Active = Primary/Red, inactive = Neutral/Silver, radius/full. In RTL the row runs right-to-left so
 * step 1 sits on the right (component description), which the RTL `direction` gives us for free.
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';

export function Pagination({ step, count = 4 }: { step: number; count?: number }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={tr('components.pagination', { step, count })}
      style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}
    >
      {Array.from({ length: count }, (_, i) => {
        const active = i + 1 === step;
        return (
          <View
            key={i}
            style={{
              height: t.sizes.pagination.dot,
              width: active ? t.sizes.pagination.active : t.sizes.pagination.dot,
              borderRadius: t.radius['radius/full'],
              backgroundColor: t.colors[active ? 'Primary/Red' : 'Neutral/Silver'],
            }}
          />
        );
      })}
    </View>
  );
}
