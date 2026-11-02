/**
 * Bottom tab bar — code addition (Home proposal; no Figma component yet). Neutral/White, Neutral/Silver top hairline
 * (stroke/xs), pt spacing/8, pb spacing/24. Each tab: 24 icon + Caption label, gap spacing/4, ≥44 touch area.
 * Active = Primary/Red, inactive = Neutral/Slate; pressed inactive tab = Neutral/Ink.
 */
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useTheme } from '../theme';

export type TabBarItem = { key: string; icon: IconName; label: string };

export function TabBar({ items, active, onSelect }: { items: TabBarItem[]; active: string; onSelect: (key: string) => void }) {
  const t = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row', borderTopWidth: t.stroke['stroke/xs'], borderTopColor: t.colors['Neutral/Silver'],
        backgroundColor: t.colors['Neutral/White'], paddingTop: t.spacing['spacing/8'], paddingBottom: t.spacing['spacing/24'],
      }}
    >
      {items.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={selected ? undefined : () => onSelect(tab.key)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            style={{ flex: 1, alignItems: 'center', gap: t.spacing['spacing/4'], minHeight: t.sizes.touchTarget }}
          >
            {({ pressed }) => {
              const color = selected ? 'Primary/Red' : pressed ? 'Neutral/Ink' : 'Neutral/Slate';
              return (
                <>
                  <Icon name={tab.icon} color={color} />
                  <AppText variant="Caption" color={color}>{tab.label}</AppText>
                </>
              );
            }}
          </Pressable>
        );
      })}
    </View>
  );
}
