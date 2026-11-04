/**
 * 3.6 Biometric setup — Face ID (iOS) / 3.1b fingerprint (Android) (Figma "New registration" 69:5045-frame / 90:1953):
 * Illustration (faceId / fingerprint) · H2 + Body Large · 3 benefit rows (40 red-tint Icon Badge + Body Medium) ·
 * Footer Primary "Enable …" (triggers the OS prompt; with the API: react-native-biometrics) · Ghost "Not now".
 * Both → Home. Web/preview shows Face ID unless `kind` says otherwise; phones without biometrics skip this screen.
 */
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, IconBadge, Illustration, Screen, type IconName } from '../../components';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

export function BiometricSetupScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '3.6'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const kind = route.params?.kind ?? (Platform.OS === 'android' ? 'fingerprint' : 'faceId');
  const k = `registration.3_6.${kind}`;
  const icons: IconName[] = ['zap', 'lock', 'shield'];
  const home = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  return (
    <Screen>
      <ScrollView style={styles.flex} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: t.layout.screenGutter, paddingVertical: t.spacing['spacing/24'], gap: t.spacing['spacing/24'] }}>
        <View style={{ alignItems: 'center' }}>
          <Illustration name={kind} />
        </View>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H2" accessibilityRole="header" style={styles.center}>{tr(`${k}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate" style={styles.center}>{tr(`${k}.body`)}</AppText>
        </View>
        <View style={{ gap: t.spacing['spacing/12'] }}>
          {(tr(`${k}.benefits`, { returnObjects: true }) as string[]).map((b, i) => (
            <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }}>
              <IconBadge icon={icons[i]} size={40} tone="redTint" />
              <AppText variant="Body Medium" style={styles.flex}>{b}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/40'], gap: t.spacing['spacing/8'] }}>
        <Button icon={kind} label={tr(`${k}.enable`)} onPress={home} testID="enable" />
        <Button type="ghost" label={tr('registration.3_6.notNow')} onPress={home} testID="not-now" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, center: { textAlign: 'center' } });
