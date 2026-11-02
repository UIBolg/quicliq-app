/**
 * Section header — code addition (Home proposal): H3 title at the start, optional Body Medium Primary/Red action
 * ("See all") at the end. The action underlines while pressed; touch area extended with hitSlop.
 */
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme';

export function SectionHeader({ title, actionLabel, onAction, actionAccessibilityLabel }: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Defaults to "<action>, <title>" so "See all" is not ambiguous for screen readers. */
  actionAccessibilityLabel?: string;
}) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: t.spacing['spacing/12'] }}>
      <AppText variant="H3" accessibilityRole="header" style={{ flexShrink: 1 }}>{title}</AppText>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="link"
          accessibilityLabel={actionAccessibilityLabel ?? `${actionLabel}, ${title}`}
          hitSlop={t.spacing['spacing/12']}
        >
          {({ pressed }) => (
            <AppText variant="Body Medium" color="Primary/Red" style={pressed ? { textDecorationLine: 'underline' } : undefined}>
              {actionLabel}
            </AppText>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
