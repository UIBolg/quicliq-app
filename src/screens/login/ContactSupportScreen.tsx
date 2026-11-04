/**
 * 7.7c Contact support (New Designs 57:28370): Top bar (back + "Contact support") · Hero (H2 + Body Large Slate) ·
 * 3 options (Call us / Email us / Visit our office) in a List Group · Security banner ·
 * Footer: Primary "Call support" (dialler) + Secondary "Email support" (mail app).
 */
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Banner, Button, ListGroup, ListRow, Screen, TopBar } from '../../components';
import { supportContacts } from '../../mock/account';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'login.7_7c';

export function ContactSupportScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '7.7c'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const open = (url: string) => () => { Linking.openURL(url).catch(() => {}); };
  const call = open(`tel:${supportContacts.phone}`);
  const mail = open(`mailto:${supportContacts.email}`);
  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, gap: t.spacing['spacing/24'] }}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H2" accessibilityRole="header">{tr(`${k}.hero`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.body`)}</AppText>
        </View>
        <ListGroup>
          <ListRow icon="phoneCall" title={tr(`${k}.call`)} subtitle={ltr(supportContacts.phoneDisplay)} onPress={call} divider testID="call-us" />
          <ListRow icon="mail" title={tr(`${k}.email`)} subtitle={supportContacts.email} onPress={mail} divider testID="email-us" />
          <ListRow icon="pin" title={tr(`${k}.office`)} subtitle={ltr(supportContacts.office)} testID="office" />
        </ListGroup>
        <Banner type="security" text={tr(`${k}.security`)} />
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'], gap: t.spacing['spacing/12'] }}>
        <Button icon="phoneCall" label={tr(`${k}.callSupport`)} onPress={call} testID="call-support" />
        <Button type="secondary" icon="mail" label={tr(`${k}.emailSupport`)} onPress={mail} testID="email-support" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
