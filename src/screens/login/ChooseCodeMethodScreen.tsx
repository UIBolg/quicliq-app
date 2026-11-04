/**
 * 7.2c Verify login — try another way (EN 220:6694).
 * Top: back button, pt spacing/8, gutter spacing/24 (Figma layer is named "Badge" with icon/message but renders the
 * back arrow — docs/figma-issues.md #28). Content pt spacing/24, gap spacing/24: Heading (H1 + Body Large Slate,
 * gap spacing/8), Options gap spacing/12 (Radio Option Icon=On: Text message / Email with masked destinations).
 * Footer pt spacing/16, pb spacing/40: Primary "Send code" → 7.2a (text) or 7.2b (email) with a new code.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BackButton, Button, RadioOption, Screen } from '../../components';
import { demoAccount } from '../../mock/account';
import { maskEmail, maskPhone } from '../../utils/mask';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

export function ChooseCodeMethodScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '7.2c' | '7.8d'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  // 7.8d "Where should we send your code?" (New Designs 57:28400, new-device flow; only when the email is verified).
  const newDevice = route.name === '7.8d';
  const phone = route.params?.phone ?? demoAccount.phone;
  const email = route.params?.email ?? demoAccount.email;
  const [method, setMethod] = useState<'sms' | 'email'>(route.params?.method ?? 'sms');
  const k = newDevice ? 'login.7_8d' : 'login.7_2c';
  const send = () => {
    if (newDevice) navigation.navigate(method === 'sms' ? '7.9' : '7.9b', { phone, email });
    else navigation.popTo(method === 'sms' ? '7.2a' : '7.2b', { phone, email });
  };
  const g = t.layout.screenGutter;

  return (
    <Screen>
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g, alignItems: 'flex-start' }}>
        <BackButton onPress={() => navigation.goBack()} testID="back" />
      </View>
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/24'], paddingHorizontal: g, gap: t.spacing['spacing/24'] }}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H1" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.body`)}</AppText>
        </View>
        <View accessibilityRole="radiogroup" style={{ gap: t.spacing['spacing/12'] }}>
          <RadioOption icon="smartphone" title={tr('login.7_2c.sms')} subtitle={maskPhone(phone)} selected={method === 'sms'} onPress={() => setMethod('sms')} testID="method-sms" />
          <RadioOption icon="mail" title={tr('login.7_2c.email')} subtitle={maskEmail(email)} selected={method === 'email'} onPress={() => setMethod('email')} testID="method-email" />
        </View>
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'] }}>
        <Button
          label={tr('login.7_2c.send')}
          onPress={send}
          testID="send-code"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
