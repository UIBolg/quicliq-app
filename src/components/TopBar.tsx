/**
 * Top bar for inner screens (12.2–13.2): Back button (40 Fog circle) at the start, Title centred, an equal empty
 * slot at the end so the title stays centred. pt spacing/8, gutter, pb spacing/16.
 */
import { View } from 'react-native';
import { AppText } from './AppText';
import { BackButton } from './BackButton';
import { useTheme } from '../theme';

export function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  const t = useTheme();
  const slot = t.sizes.iconButton.size;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/16'] }}>
      <View style={{ width: slot }}>
        <BackButton onPress={onBack} testID="back" />
      </View>
      <AppText variant="Title" accessibilityRole="header" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>{title}</AppText>
      <View style={{ width: slot }} />
    </View>
  );
}
