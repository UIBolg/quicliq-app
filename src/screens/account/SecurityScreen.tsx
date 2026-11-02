/**
 * 12.5 Security (doc p.49). List Group: Face ID row with a Switch (whole row toggles; on by default in the demo) ·
 * Change password → 12.3. "ACTIVE DEVICE" (Overline, Slate) above a Fog card: device name (Body Medium) + "This device" Verified Tag over
 * "Only one device can be active" (Caption, Slate). Intro line (Body, Slate) at the top.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, IconBadge, ListGroup, ListRow, Screen, Switch, TopBar, VerifiedTag } from '../../components';
import { demoDevice } from '../../mock/account';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.security';

export function SecurityScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.5'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [faceId, setFaceId] = useState(true);

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/24'] }}>
        <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.intro`)}</AppText>
        <ListGroup>
          <ListRow
            icon="faceId"
            title={tr(`${k}.faceId`)}
            subtitle={tr(`${k}.faceIdHint`)}
            accessory={<Switch value={faceId} />}
            accessibilityState={{ checked: faceId }}
            onPress={() => setFaceId((v) => !v)}
            testID="face-id"
          />
          <ListRow icon="lock" title={tr(`${k}.changePassword`)} onPress={() => navigation.navigate('12.3')} testID="change-password" />
        </ListGroup>

        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="Overline" color="Neutral/Slate" accessibilityRole="header">{tr(`${k}.device`)}</AppText>
          <View accessible style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
            <IconBadge icon="smartphone" size={40} tone="white" />
            <View style={styles.flex}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
                <AppText variant="Body Medium">{demoDevice.name}</AppText>
                <VerifiedTag label={tr(`${k}.thisDevice`)} />
              </View>
              <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.deviceHint`)}</AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
