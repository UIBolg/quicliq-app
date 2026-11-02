/**
 * 12.2 Personal details (doc "Quicliq API Gap Analysis" p.46). Name and date of birth are locked (they come from the
 * ID check); email, mobile and address are editable. Find address (search field) → Loqate finder (not built yet).
 * Save is enabled once something changed: a new mobile first goes to code entry (2.4), otherwise it saves and goes back.
 * Latin values that start with digits (date, address) are kept LTR so Arabic doesn't reorder them.
 * Layout: TopBar · fields gap spacing/16 · locked note (Caption, Slate) · footer Primary "Save".
 */
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, PhoneField, Screen, TextField, TopBar } from '../../components';
import { demoAccount, demoProfile } from '../../mock/account';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.personal';

export function PersonalDetailsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.2'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [email, setEmail] = useState<string>(demoAccount.email);
  const [mobile, setMobile] = useState(demoProfile.mobile);
  const mobileChanged = mobile.replace(/\D/g, '') !== demoProfile.mobile.replace(/\D/g, '');
  const changed = email !== demoAccount.email || mobileChanged;

  const save = () => {
    if (mobileChanged) navigation.navigate('NotBuilt', { screenId: '2.4' });
    else navigation.goBack();
  };

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/16'] }} keyboardShouldPersistTaps="handled">
          <TextField label={tr(`${k}.fullName`)} value={demoAccount.fullName} locked />
          <TextField label={tr(`${k}.dob`)} value={ltr(demoProfile.dob)} locked />
          <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.lockedNote`)}</AppText>
          <TextField label={tr(`${k}.email`)} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" testID="email" />
          <PhoneField
            label={tr(`${k}.mobile`)}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            helper={mobileChanged ? tr(`${k}.mobileNote`) : undefined}
            testID="mobile"
          />
          <TextField label={tr(`${k}.address`)} value={ltr(demoProfile.address)} trailing="search" onPress={() => navigation.navigate('NotBuilt', { screenId: 'Find address (Loqate)' })} testID="address" />
        </ScrollView>
        <View style={{ paddingHorizontal: t.layout.screenGutter, paddingTop: t.spacing['spacing/16'], paddingBottom: t.layout.footerBottom }}>
          <Button type={changed ? 'primary' : 'disabled'} label={tr(`${k}.save`)} onPress={save} testID="save" />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
