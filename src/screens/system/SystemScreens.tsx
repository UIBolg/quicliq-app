/**
 * System (Figma "System" EN 158:4856 / AR 158:4860), shown at launch when the API says so:
 *  9.1 Update required (158:4604) — Illustration/update 160 · H2 + Body Large · Version card (Fog, radius/lg, padding
 *      spacing/16: "Your version" / "Latest version" Caption Slate over Body Medium, latest in Primary/Red, arrow between,
 *      mirrored in RTL) · Info banner · Primary "Update now" (download icon) → store.
 *  9.2 Maintenance (158:4679) — Illustration/maintenance 160 · H2 + Body Large · Back-by card (clock, Caption Slate +
 *      Body Medium) · Info banner · Primary "Try again" (refresh) + Ghost "Contact support" → 7.7c.
 * Content pt spacing/40; footer pt spacing/16, pb spacing/40.
 */
import type { ReactNode } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Banner, Button, Icon, Illustration } from '../../components';
import { demoSystem } from '../../mock/account';
import { MessageLayout } from '../common/MessageLayout';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

function Card({ children }: { children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
      {children}
    </View>
  );
}

export function UpdateRequiredScreen(_: NativeStackScreenProps<RootStackParamList, '9.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const k = 'system.9_1';
  const kv = [styles.kv, { gap: t.spacing['spacing/4'] }];
  return (
    <MessageLayout
      illustration={<Illustration name="update" />}
      title={tr(`${k}.title`)}
      body={tr(`${k}.body`)}
      contentPadTop="spacing/40"
      footer={<Button icon="download" label={tr(`${k}.update`)} onPress={() => Linking.openURL(demoSystem.storeUrl).catch(() => {})} testID="update-now" />}
    >
      <Card>
        <View style={kv}>
          <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.yours`)}</AppText>
          <AppText variant="Body Medium" color="Neutral/Slate">{ltr(demoSystem.version)}</AppText>
        </View>
        <Icon name="arrowRight" size={t.sizes.icon.md} color="Neutral/Slate" />
        <View style={kv}>
          <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.latest`)}</AppText>
          <AppText variant="Body Medium" color="Primary/Red">{ltr(demoSystem.latest)}</AppText>
        </View>
      </Card>
      <Banner type="info" text={tr(`${k}.safe`)} />
    </MessageLayout>
  );
}

export function MaintenanceScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '9.2'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const k = 'system.9_2';
  return (
    <MessageLayout
      illustration={<Illustration name="maintenance" />}
      title={tr(`${k}.title`)}
      body={tr(`${k}.body`)}
      contentPadTop="spacing/40"
      footer={
        <>
          <Button icon="refresh" label={tr(`${k}.retry`)} onPress={() => navigation.goBack()} testID="retry" />
          <Button type="ghost" label={tr(`${k}.support`)} onPress={() => navigation.navigate('7.7c')} testID="support" />
        </>
      }
    >
      <Card>
        <Icon name="clock" size={t.sizes.icon.md} color="Neutral/Ink" />
        <View style={styles.flex}>
          <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.backBy`)}</AppText>
          <AppText variant="Body Medium">{tr(`${k}.time`, { time: ltr(demoSystem.backBy) })}</AppText>
        </View>
      </Card>
      <Banner type="info" text={tr(`${k}.safe`)} />
    </MessageLayout>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, kv: { flex: 1, alignItems: 'center' } });
