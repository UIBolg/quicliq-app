/**
 * 12.1 Account (Profile tab) — from "Quicliq API Gap Analysis" p.45, enhanced; no Figma frame yet (docs/figma-issues.md #40).
 * Rows open 12.2–12.7 and 13.1; Your limit opens the sending-limit sheet (5.2); Log out opens the 12.8 sheet.
 * Neutral/White page, pt spacing/8 · gutter · pb spacing/32, gap spacing/24:
 *  H2 "Account" ·
 *  profile card (Neutral/Fog, radius/xl, padding spacing/16): Avatar 56 · name (Title) + email (Caption, Slate) ·
 *    chevron → 12.2 (the limit lives only in the "Your limit" row) ·
 *  List Groups (every icon circle Alpha/Red 8% + Primary/Red, like Personal details): Account (Personal details, Saved cards, Your limit → sending-limit sheet) ·
 *    Preferences (Security, Language) · Support (Help, Legal) · Log out (danger row → 12.8 sheet → 7.1) ·
 *  app version (Caption, Slate, centred).
 * Floating TabBar with Profile active.
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Avatar, BottomSheet, Button, Icon, ListGroup, ListRow, Screen, TabBar } from '../../components';
import { demoAccount, demoLimit, limitTotal } from '../../mock/account';
import { useLocale } from '../../i18n/LocaleProvider';
import { useMainTabs } from '../../navigation/mainTabs';
import { SendingLimitSheet } from '../home/SendingLimitSheet';
import { formatMoney } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';
import appConfig from '../../../app.json';

type Props = NativeStackScreenProps<RootStackParamList, '12.1'>;

const k = 'account';

export function AccountScreen({ navigation }: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { locale } = useLocale();
  const tabs = useMainTabs(navigation);
  const [sheet, setSheet] = useState<'limit' | 'logout' | null>(null);
  const level = demoLimit.level;

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/24'] }}
      >
        <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>

        <View style={{ padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/xl'], backgroundColor: t.colors['Neutral/Fog'] }}>
          <Pressable
            onPress={() => navigation.navigate('12.2')}
            accessibilityRole="button"
            accessibilityLabel={`${demoAccount.fullName}, ${demoAccount.email}`}
            testID="profile-card"
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], backgroundColor: pressed ? t.colors['Alpha/Ink 6%'] : undefined, borderRadius: t.radius['radius/md'] })}
          >
            <Avatar initials={demoAccount.initials} size={56} />
            <View style={styles.flex}>
              <AppText variant="Title" numberOfLines={1}>{demoAccount.fullName}</AppText>
              <AppText variant="Caption" color="Neutral/Slate" numberOfLines={1}>{demoAccount.email}</AppText>
            </View>
            <Icon name="chevronRight" size={t.sizes.icon.md} color="Neutral/Slate" />
          </Pressable>
        </View>

        <ListGroup title={tr(`${k}.groups.account`)}>
          <ListRow icon="user" title={tr(`${k}.rows.personal`)} onPress={() => navigation.navigate('12.2')} />
          <ListRow icon="card" title={tr(`${k}.rows.cards`)} onPress={() => navigation.navigate('12.4')} />
          <ListRow icon="trendingUp" title={tr(`${k}.rows.limit`)} value={formatMoney(limitTotal(level))} onPress={() => setSheet('limit')} testID="row-limit" />
        </ListGroup>

        <ListGroup title={tr(`${k}.groups.preferences`)}>
          <ListRow icon="shield" title={tr(`${k}.rows.security`)} onPress={() => navigation.navigate('12.5')} testID="row-security" />
          <ListRow icon="globe" title={tr(`${k}.rows.language`)} value={tr(`onboarding.language.${locale}.title`)} onPress={() => navigation.navigate('12.6')} testID="row-language" />
        </ListGroup>

        <ListGroup title={tr(`${k}.groups.support`)}>
          <ListRow icon="help" title={tr(`${k}.rows.help`)} onPress={() => navigation.navigate('13.1')} />
          <ListRow icon="file" title={tr(`${k}.rows.legal`)} onPress={() => navigation.navigate('12.7')} />
        </ListGroup>

        <ListGroup>
          <ListRow icon="arrowRight" tone="danger" title={tr(`${k}.logOut`)} onPress={() => setSheet('logout')} testID="log-out" />
        </ListGroup>

        <AppText variant="Caption" color="Neutral/Slate" style={{ textAlign: 'center' }}>
          {tr(`${k}.version`, { version: appConfig.expo.version })}
        </AppText>
      </ScrollView>

      <TabBar items={tabs.items} active="profile" onSelect={tabs.onSelect} />
      <SendingLimitSheet
        visible={sheet === 'limit'}
        level={level}
        sent={demoLimit.sent}
        onClose={() => setSheet(null)}
        onRaise={(screenId) => { setSheet(null); navigation.navigate('NotBuilt', { screenId }); }}
      />
      {/* 12.8 Log out — sheet over Account. With the API: Session_Logout, then the login start (7.0 → 7.1 for now). */}
      <BottomSheet visible={sheet === 'logout'} onClose={() => setSheet(null)}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H3" accessibilityRole="header">{tr(`${k}.logout.title`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.logout.body`)}</AppText>
        </View>
        <View style={{ gap: t.spacing['spacing/12'] }}>
          <Button label={tr(`${k}.logout.confirm`)} onPress={() => { setSheet(null); navigation.reset({ index: 0, routes: [{ name: '7.1' }] }); }} testID="confirm-log-out" />
          <Button type="secondary" label={tr(`${k}.logout.cancel`)} onPress={() => setSheet(null)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
