/**
 * 2.9 Account created / 2.9b limit £0 (Figma "New registration" 69:5020-frame and 2.9b):
 * Header (Illustration/success 144 + H2 "Account created" + Body Large welcome) · [2.9b Security banner] ·
 * Limit card (Fog, radius/xl, padding spacing/20): "Your sending limit" · amount (Numeric L, EN style) · caption ·
 * divider · "Raise your limit" (Body Medium) · 3 Limit Steps (account done · ID and address current / required · source of
 * funds locked). Footer Primary "Verify ID and address" → 4.1 · Ghost "Maybe later" → 3.6.
 * Limits come from the API (demo: src/mock/account.ts limitLevels).
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Banner, Button, Illustration, LimitStep, Screen } from '../../components';
import { limitLevels } from '../../mock/account';
import { formatMoney } from '../../utils/format';
import { getTextStyle, useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'registration.2_9';

export function AccountCreatedScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '2.9'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const { firstName, idCheck } = route.params;
  const first = limitLevels[0].total ?? 0;
  const second = limitLevels[1].total ?? 0;
  const limit = idCheck ? 0 : first;
  const amountFace = getTextStyle('Numeric L', 'en');
  const total = tr(`${k}.total`);
  return (
    <Screen>
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/24'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/24'] }}>
        <View style={{ alignItems: 'center', gap: t.spacing['spacing/16'] }}>
          <Illustration name="success" size={t.sizes.illustration.small} />
          <View style={{ alignSelf: 'stretch', gap: t.spacing['spacing/8'] }}>
            <AppText variant="H2" accessibilityRole="header" style={styles.center}>{tr(`${k}.title`)}</AppText>
            <AppText variant="Body Large" color="Neutral/Slate" style={styles.center}>{tr(idCheck ? `${k}.welcomeId` : `${k}.welcome`, { name: firstName })}</AppText>
          </View>
        </View>
        {idCheck ? <Banner type="security" text={tr(`${k}.idBanner`)} /> : null}
        <View style={{ padding: t.spacing['spacing/16'] + t.spacing['spacing/4'], borderRadius: t.radius['radius/xl'], backgroundColor: t.colors['Neutral/Fog'], gap: t.spacing['spacing/16'] }}>
          <View style={{ gap: t.spacing['spacing/4'] }}>
            <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.yourLimit`)}</AppText>
            <AppText variant="Numeric L" style={[amountFace, { textAlign: t.isRTL ? 'right' : 'left' }]}>{formatMoney(limit)}</AppText>
            <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.lifetime`)}</AppText>
          </View>
          <View style={{ height: t.stroke['stroke/xs'], backgroundColor: t.colors['Neutral/Dark Fog'] }} />
          <AppText variant="Body Medium">{tr(`${k}.raise`)}</AppText>
          <View>
            <LimitStep status="done" title={tr(`${k}.steps.account`)} hint={tr(`${k}.done`)} amount={formatMoney(first)} note={total} statusLabel={tr(`${k}.done`)} />
            <LimitStep status="current" title={tr(`${k}.steps.id`)} hint={tr(idCheck ? `${k}.steps.idRequired` : `${k}.steps.idHint`)} amount={formatMoney(second)} note={total} statusLabel={tr(`${k}.steps.id`)} />
            <LimitStep status="locked" title={tr(`${k}.steps.funds`)} hint={tr(`${k}.steps.fundsHint`)} amount={`${formatMoney(second)}+`} note={total} statusLabel={tr(`${k}.steps.fundsHint`)} />
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'], gap: t.spacing['spacing/8'] }}>
        <Button label={tr(`${k}.verify`)} onPress={() => navigation.navigate('NotBuilt', { screenId: '4.1' })} testID="verify-id" />
        <Button type="ghost" label={tr(`${k}.later`)} onPress={() => navigation.navigate('3.6')} testID="later" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, center: { textAlign: 'center' } });
