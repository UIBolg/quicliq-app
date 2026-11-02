/**
 * Account (Profile tab) — PROPOSAL from the product owner's sketch; no Figma frame yet (docs/figma-issues.md #40).
 * Neutral/White page, pt spacing/8 · gutter · pb spacing/32, gap spacing/24:
 *  H2 "Account" ·
 *  profile card (Neutral/Fog, radius/xl, padding spacing/16): Avatar 56 · name (Title) + email (Caption, Slate) ·
 *    level pill (Alpha/Red 8%, Caption Primary/Red, "Level n of 3") · chevron → Personal details ·
 *  List Groups: Account (Personal details, Saved cards, Your limit → sending-limit sheet) ·
 *    Preferences (Security, Language → language sheet) · Support (Help, Legal) · Log out (danger row → 7.1) ·
 *  app version (Caption, Slate, centred).
 * Floating TabBar with Profile active.
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Avatar, Icon, LanguageSheet, ListGroup, ListRow, Screen, TabBar } from '../../components';
import { demoAccount, demoLimit, limitTotal } from '../../mock/account';
import { useLocale } from '../../i18n/LocaleProvider';
import { useMainTabs } from '../../navigation/mainTabs';
import { SendingLimitSheet } from '../home/SendingLimitSheet';
import { formatMoney } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';
import appConfig from '../../../app.json';

type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

const k = 'account';

export function AccountScreen({ navigation }: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { locale, setLocale } = useLocale();
  const tabs = useMainTabs(navigation);
  const [sheet, setSheet] = useState<'limit' | 'language' | null>(null);
  const notBuilt = (screenId: string) => () => navigation.navigate('NotBuilt', { screenId });
  const level = demoLimit.level;

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/24'] }}
      >
        <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>

        <Pressable
          onPress={notBuilt(tr(`${k}.rows.personal`))}
          accessibilityRole="button"
          accessibilityLabel={`${demoAccount.fullName}, ${demoAccount.email}, ${tr('home.levelLink', { level })}`}
          testID="profile-card"
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: t.spacing['spacing/12'],
            padding: t.spacing['spacing/16'],
            borderRadius: t.radius['radius/xl'],
            backgroundColor: t.colors[pressed ? 'Alpha/Ink 10%' : 'Neutral/Fog'],
          })}
        >
          <Avatar initials={demoAccount.initials} size={56} />
          <View style={[styles.flex, { gap: t.spacing['spacing/4'] }]}>
            <View>
              <AppText variant="Title" numberOfLines={1}>{demoAccount.fullName}</AppText>
              <AppText variant="Caption" color="Neutral/Slate" numberOfLines={1}>{demoAccount.email}</AppText>
            </View>
            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/4'], paddingHorizontal: t.spacing['spacing/8'], paddingVertical: t.spacing['spacing/2'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/Red 8%'] }}>
              <Icon name="shield" size={t.sizes.icon.xs} color="Primary/Red" />
              <AppText variant="Caption" color="Primary/Red">{tr('home.levelLink', { level })}</AppText>
            </View>
          </View>
          <Icon name="chevronRight" size={t.sizes.icon.md} color="Neutral/Slate" />
        </Pressable>

        <ListGroup title={tr(`${k}.groups.account`)}>
          <ListRow icon="user" title={tr(`${k}.rows.personal`)} onPress={notBuilt(tr(`${k}.rows.personal`))} />
          <ListRow icon="card" title={tr(`${k}.rows.cards`)} onPress={notBuilt(tr(`${k}.rows.cards`))} />
          <ListRow icon="trendingUp" title={tr(`${k}.rows.limit`)} value={formatMoney(limitTotal(level))} onPress={() => setSheet('limit')} testID="row-limit" />
        </ListGroup>

        <ListGroup title={tr(`${k}.groups.preferences`)}>
          <ListRow icon="shield" title={tr(`${k}.rows.security`)} onPress={notBuilt(tr(`${k}.rows.security`))} />
          <ListRow icon="globe" title={tr(`${k}.rows.language`)} value={tr(`onboarding.language.${locale}.title`)} onPress={() => setSheet('language')} testID="row-language" />
        </ListGroup>

        <ListGroup title={tr(`${k}.groups.support`)}>
          <ListRow icon="help" title={tr(`${k}.rows.help`)} onPress={notBuilt(tr(`${k}.rows.help`))} />
          <ListRow icon="file" title={tr(`${k}.rows.legal`)} onPress={notBuilt(tr(`${k}.rows.legal`))} />
        </ListGroup>

        <ListGroup>
          <ListRow icon="arrowRight" tone="danger" title={tr(`${k}.logOut`)} onPress={() => navigation.reset({ index: 0, routes: [{ name: '7.1' }] })} testID="log-out" />
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
      <LanguageSheet visible={sheet === 'language'} locale={locale} onClose={() => setSheet(null)} onChoose={(l) => { setSheet(null); setLocale(l); }} />
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
