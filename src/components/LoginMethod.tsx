/**
 * Login Method — Figma 141:4399. Segmented switch: Neutral/Fog track, radius/full, padding + gap spacing/4.
 * Tabs: flex 1, padding spacing/8 vertical, radius/full; selected = Neutral/White + tab shadow, Ink text;
 * unselected = Slate text. Text Body Medium. Mobile is on the start side (right in Arabic).
 */
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { useTheme } from '../theme';

export type LoginMethodValue = 'mobile' | 'email';

export function LoginMethod({ value, onChange }: { value: LoginMethodValue; onChange: (v: LoginMethodValue) => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const options: LoginMethodValue[] = ['mobile', 'email'];
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        gap: t.spacing['spacing/4'],
        padding: t.spacing['spacing/4'],
        borderRadius: t.radius['radius/full'],
        backgroundColor: t.colors['Neutral/Fog'],
      }}
    >
      {options.map((o) => {
        const selected = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            hitSlop={t.spacing['spacing/4']}
            style={({ pressed }) => [
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: t.spacing['spacing/8'],
                borderRadius: t.radius['radius/full'],
                backgroundColor: selected ? t.colors['Neutral/White'] : pressed ? t.colors[t.states.pressedOverlay] : undefined,
              },
              selected && t.elevation.tab,
            ]}
          >
            <AppText variant="Body Medium" color={selected ? 'Neutral/Ink' : 'Neutral/Slate'}>
              {tr(`components.loginMethod.${o}`)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
