/**
 * "Coming soon" page for flows that are not built yet (the route still receives the Figma screen ID, but it is not
 * shown to users).
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, Illustration, Screen } from '../components';
import { useTheme } from '../theme';
import type { RootStackParamList } from '../navigation/routes';

export function NotBuiltScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'NotBuilt'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        <Illustration name="update" size={176} />
        <AppText variant="H2" accessibilityRole="header" style={{ textAlign: 'center' }}>{tr('notBuilt.title')}</AppText>
        <AppText variant="Body Large" color="Neutral/Slate" style={{ textAlign: 'center' }}>{tr('notBuilt.body')}</AppText>
      </View>
      <View style={{ padding: t.layout.screenGutter, paddingBottom: t.layout.footerBottom }}>
        <Button type="secondary" label={tr('common.back')} onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
