/**
 * 12.2 Personal details (doc p.46) — list view (owner's request), opened from the Account profile card.
 * TopBar · List Groups (List Rows: label as Caption eyebrow, value as the Body Medium title):
 *  From your ID check — Full name · Date of birth: read-only, lock icon at the end (they come from the ID check) ·
 *  Contact — Email · Mobile: tap opens an edit sheet (one Text Field + Save); a new mobile goes to code entry 2.4 ·
 *  Home address — tap opens the address finder (Loqate, not built yet).
 * A Caption line with a 14 lock under the locked group explains why.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, Button, Icon, ListGroup, ListRow, PhoneField, Screen, TextField, TopBar } from '../../components';
import { demoAccount, demoProfile } from '../../mock/account';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.personal';
type Editing = 'email' | 'mobile' | null;

export function PersonalDetailsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.2'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [email, setEmail] = useState<string>(demoAccount.email);
  const [mobile, setMobile] = useState(demoProfile.mobile);
  const [editing, setEditing] = useState<Editing>(null);
  const [draft, setDraft] = useState('');
  const lock = <Icon name="lock" size={t.sizes.icon.sm} color="Neutral/Slate" />;

  const edit = (field: Exclude<Editing, null>) => { setDraft(field === 'email' ? email : mobile); setEditing(field); };
  const save = () => {
    if (editing === 'email') setEmail(draft.trim());
    if (editing === 'mobile' && draft.replace(/\D/g, '') !== mobile.replace(/\D/g, '')) {
      setEditing(null);
      navigation.navigate('NotBuilt', { screenId: '2.4' });
      return;
    }
    setEditing(null);
  };
  const changed = editing === 'email' ? draft.trim() !== email && /\S+@\S+\.\S+/.test(draft) : draft.replace(/\D/g, '').length >= 9 && draft !== mobile;

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/24'] }}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <ListGroup title={tr(`${k}.sections.identity`)}>
            <ListRow icon="user" eyebrow={tr(`${k}.fullName`)} title={demoAccount.fullName} accessory={lock} />
            <ListRow icon="calendar" eyebrow={tr(`${k}.dob`)} title={ltr(demoProfile.dob)} accessory={lock} />
          </ListGroup>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: t.spacing['spacing/6'], paddingHorizontal: t.spacing['spacing/4'] }}>
            <Icon name="lock" size={t.sizes.icon.xs} color="Neutral/Slate" />
            <AppText variant="Caption" color="Neutral/Slate" style={styles.flex}>{tr(`${k}.lockedNote`)}</AppText>
          </View>
        </View>
        <ListGroup title={tr(`${k}.sections.contact`)}>
          <ListRow icon="mail" eyebrow={tr(`${k}.email`)} title={email} onPress={() => edit('email')} testID="row-email" />
          <ListRow icon="smartphone" eyebrow={tr(`${k}.mobile`)} title={ltr(`+44 ${mobile}`)} onPress={() => edit('mobile')} testID="row-mobile" />
        </ListGroup>
        <ListGroup title={tr(`${k}.sections.address`)}>
          <ListRow icon="pin" eyebrow={tr(`${k}.address`)} title={ltr(demoProfile.address)} onPress={() => navigation.navigate('NotBuilt', { screenId: 'Find address (Loqate)' })} testID="row-address" />
        </ListGroup>
      </ScrollView>

      <BottomSheet visible={!!editing} onClose={() => setEditing(null)}>
        <AppText variant="H3" accessibilityRole="header">{editing ? tr(`${k}.edit.${editing}`) : ''}</AppText>
        {editing === 'email' ? (
          <TextField label={tr(`${k}.email`)} value={draft} onChangeText={setDraft} keyboardType="email-address" autoCapitalize="none" autoComplete="email" testID="edit-email" />
        ) : editing === 'mobile' ? (
          <PhoneField label={tr(`${k}.mobile`)} value={draft} onChangeText={setDraft} keyboardType="phone-pad" helper={tr(`${k}.mobileNote`)} testID="edit-mobile" />
        ) : null}
        <Button type={changed ? 'primary' : 'disabled'} label={tr(`${k}.save`)} onPress={save} testID="save" />
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
