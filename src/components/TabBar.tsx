/**
 * Bottom tab bar — code addition (no Figma component yet, docs/figma-issues.md #38). Floating pill chosen on the
 * "Quicliq Home options" canvas (Nav 4) in light colours:
 * bar Neutral/White, radius/full, padding spacing/8, `elevation.floating`, inset spacing/16 from the screen sides and
 * spacing/16 (or the home-indicator inset) from the bottom. Icon-only tabs, each a 48-high cell (≥44 touch area):
 * active = Primary/Red pill with a Neutral/White icon; inactive = Neutral/Slate icon; pressed inactive = Alpha/Ink 6% pill.
 * Labels are kept for screen readers.
 */
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from './Icon';
import { useTheme } from '../theme';

export type TabBarItem = { key: string; icon: IconName; label: string };

export function TabBar({ items, active, onSelect }: { items: TabBarItem[]; active: string; onSelect: (key: string) => void }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingHorizontal: t.spacing['spacing/16'],
        paddingTop: t.spacing['spacing/8'],
        paddingBottom: Math.max(t.spacing['spacing/16'], insets.bottom),
      }}
    >
      <View
        accessibilityRole="tablist"
        style={{
          flexDirection: 'row',
          gap: t.spacing['spacing/8'],
          padding: t.spacing['spacing/8'],
          borderRadius: t.radius['radius/full'],
          backgroundColor: t.colors['Neutral/White'],
          ...t.elevation.floating,
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
              style={({ pressed }) => ({
                flex: 1,
                height: t.sizes.tabBar.item,
                borderRadius: t.radius['radius/full'],
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? t.colors['Primary/Red'] : pressed ? t.colors['Alpha/Ink 6%'] : undefined,
              })}
            >
              <Icon name={tab.icon} color={selected ? 'Neutral/White' : 'Neutral/Slate'} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
