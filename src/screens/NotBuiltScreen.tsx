/**
 * Temporary destination for links into flows that are not built yet. Shows the Figma screen ID so reviewers
 * can see where the link goes. Removed once every Phase 1 flow exists.
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, Screen } from '../components';
import { useTheme } from '../theme';
import type { RootStackParamList } from '../navigation/routes';

export function NotBuiltScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'NotBuilt'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', padding: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        <AppText variant="Overline" color="Primary/Red">{route.params.screenId}</AppText>
        <AppText variant="H2" accessibilityRole="header">{tr('notBuilt.title')}</AppText>
        <AppText variant="Body Large" color="Neutral/Slate">{tr('notBuilt.body', { id: route.params.screenId })}</AppText>
      </View>
      <View style={{ padding: t.layout.screenGutter, paddingBottom: t.layout.footerBottom }}>
        <Button type="secondary" label={tr('common.back')} onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
