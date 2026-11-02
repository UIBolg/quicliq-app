/**
 * Switch Account — Figma 282:9874. "Not you?" (Body, Slate) + "Switch account" (Body Medium, Primary/Red link),
 * gap spacing/4. Same styling in Arabic (verified on AR/7.0 footer 139:3994).
 */
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { useTheme } from '../theme';

export function SwitchAccount({ onPress }: { onPress: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/4'], alignSelf: 'center' }}>
      <AppText variant="Body" color="Neutral/Slate">{tr('components.switchAccount.prompt')}</AppText>
      <Pressable onPress={onPress} accessibilityRole="link" hitSlop={t.spacing['spacing/12']}>
        {({ pressed }) => (
          <AppText variant="Body Medium" color="Primary/Red" style={pressed ? { textDecorationLine: 'underline' } : undefined}>
            {tr('components.switchAccount.action')}
          </AppText>
        )}
      </Pressable>
    </View>
  );
}
