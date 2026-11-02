/**
 * 13.1 Help (doc p.53): H2 "How can we help?" · List Group: Call us (phone dialler) · Email us (mail app) ·
 * Help articles (help page). Same contact routes as the old app — contacts in src/mock/account.ts are placeholders.
 */
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, ListGroup, ListRow, Screen, TopBar } from '../../components';
import { supportContacts } from '../../mock/account';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.help';

export function HelpScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '13.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const open = (url: string) => () => { Linking.openURL(url).catch(() => {}); };
  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        <View style={{ gap: t.spacing['spacing/4'] }}>
          <AppText variant="H2" accessibilityRole="header">{tr(`${k}.heading`)}</AppText>
          <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.intro`)}</AppText>
        </View>
        <ListGroup>
          <ListRow icon="phoneCall" title={tr(`${k}.call`)} subtitle={ltr(supportContacts.phoneDisplay)} onPress={open(`tel:${supportContacts.phone}`)} testID="call-us" />
          <ListRow icon="mail" title={tr(`${k}.email`)} subtitle={supportContacts.email} onPress={open(`mailto:${supportContacts.email}`)} testID="email-us" />
          <ListRow icon="help" title={tr(`${k}.articles`)} onPress={open(supportContacts.articlesUrl)} testID="help-articles" />
        </ListGroup>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
