/**
 * 7.7 New device detected (New Designs 57:28236) — shown after login when the account is active on another phone.
 * Back (top, pt spacing/8) · Content gutter, gap spacing/24: Illustration/newDevice 144 · Heading (H2 + Body Large Slate) ·
 * List of 3 numbered steps (32 badge Alpha/Red 10% + Primary/Red number, Body) · Info banner (one active device).
 * Footer pt spacing/16, pb spacing/40: Primary "Continue" → 7.8.
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BackButton, Banner, Button, Illustration, Screen } from '../../components';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'login.7_7';

export function NewDeviceScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '7.7'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const badge = t.sizes.limitStep.badge;
  return (
    <Screen>
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g, alignItems: 'flex-start' }}>
        <BackButton onPress={() => navigation.goBack()} testID="back" />
      </View>
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, gap: t.spacing['spacing/24'] }}>
        <View style={{ alignItems: 'center' }}>
          <Illustration name="newDevice" size={t.sizes.illustration.small} />
        </View>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.body`)}</AppText>
        </View>
        <View accessibilityRole="list" style={{ gap: t.spacing['spacing/16'] }}>
          {(['details', 'code', 'trusted'] as const).map((s, i) => (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }}>
              <View style={{ width: badge, height: badge, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/Red 10%'], alignItems: 'center', justifyContent: 'center' }}>
                <AppText variant="Body Medium" color="Primary/Red">{String(i + 1)}</AppText>
              </View>
              <AppText variant="Body" style={styles.flex}>{tr(`${k}.steps.${s}`)}</AppText>
            </View>
          ))}
        </View>
        <Banner type="info" text={tr(`${k}.oneDevice`)} />
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'] }}>
        <Button label={tr('common.continue')} onPress={() => navigation.navigate('7.8')} testID="continue" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
