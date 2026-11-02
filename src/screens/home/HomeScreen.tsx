/**
 * Home — PROPOSAL, not from Figma. The Figma file has no Home screen yet (pages: Documentation, Components,
 * Icons & Illustrations, Log in & Sign up, Forgot Password, Verify ID & Address). Built only from existing tokens and
 * components so the login flows have somewhere to land and the team can react to a direction; replace it with the
 * designer's frames once they exist (docs/figma-issues.md #30). Sample data from src/mock/account.ts.
 *
 * Layout: Header (Avatar 44 + greeting, bell Icon Button) · Send card (Primary/Red, radius/xl: corridor, live rate,
 * "Send money" button) · Quick actions (4 × Icon Badge 56 red tint + Caption) · Recent transfers (Icon Badge 44 +
 * name/date, amount + status at the end) · Bottom tab bar (Home, Send, History, Profile).
 */
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Avatar, Button, Flag, Icon, IconBadge, IconButton, Screen, type IconName } from '../../components';
import { demoAccount, demoTransfers } from '../../mock/account';
import { useTheme, getTextStyle } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const LRI = '⁦';
const PDI = '⁩';

export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const g = t.layout.screenGutter;
  const k = 'home';
  const notBuilt = (screenId: string) => () => navigation.navigate('NotBuilt', { screenId });

  const actions: { key: string; icon: IconName }[] = [
    { key: 'send', icon: 'send' },
    { key: 'recipients', icon: 'users' },
    { key: 'rates', icon: 'trendingUp' },
    { key: 'help', icon: 'help' },
  ];
  const tabs: { key: string; icon: IconName }[] = [
    { key: 'home', icon: 'home' },
    { key: 'send', icon: 'send' },
    { key: 'history', icon: 'history' },
    { key: 'profile', icon: 'user' },
  ];

  return (
    <Screen edges={['top']}>
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/24'] }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }}>
          <Avatar initials={demoAccount.initials} size={44} accessibilityLabel={demoAccount.fullName} />
          <View style={styles.flex}>
            <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.greeting`)}</AppText>
            <AppText variant="Title" accessibilityRole="header">{demoAccount.firstName}</AppText>
          </View>
          <IconButton icon="bell" accessibilityLabel={tr(`${k}.notifications`)} onPress={notBuilt('Notifications')} />
        </View>

        {/* Send card */}
        <View style={{ backgroundColor: t.colors['Primary/Red'], borderRadius: t.radius['radius/xl'], padding: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
            <View style={{ flexDirection: 'row', direction: 'ltr' }}>
              <Flag country="UK" />
              <View style={{ marginStart: -t.spacing['spacing/6'] }}><Flag country="JO" /></View>
            </View>
            <AppText variant="Body Medium" color="Neutral/White">{tr(`${k}.corridor`)}</AppText>
          </View>
          <View style={{ gap: t.spacing['spacing/4'] }}>
            <AppText variant="Overline" color="Alpha/White 80%">{tr(`${k}.rateLabel`)}</AppText>
            <AppText variant="Numeric L" color="Neutral/White" style={[getTextStyle('Numeric L', 'en'), { textAlign: t.isRTL ? 'right' : 'left' }]}>
              {`${LRI}${demoAccount.rate.jod}${PDI}`}
            </AppText>
            <AppText variant="Body" color="Alpha/White 80%">{tr(`${k}.rateNote`, { gbp: `${LRI}£1${PDI}` })}</AppText>
          </View>
          <Button type="secondary" icon="send" label={tr(`${k}.sendMoney`)} onPress={notBuilt('Send money')} testID="home-send" />
        </View>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {actions.map((a) => (
            <Pressable key={a.key} onPress={notBuilt(tr(`${k}.actions.${a.key}`))} accessibilityRole="button" style={{ alignItems: 'center', gap: t.spacing['spacing/8'], flex: 1 }}>
              <IconBadge icon={a.icon} size={56} tone="redTint" />
              <AppText variant="Caption" style={{ textAlign: 'center' }}>{tr(`${k}.actions.${a.key}`)}</AppText>
            </Pressable>
          ))}
        </View>

        {/* Recent transfers */}
        <View style={{ gap: t.spacing['spacing/12'] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <AppText variant="H3" accessibilityRole="header">{tr(`${k}.recent`)}</AppText>
            <Pressable onPress={notBuilt('History')} accessibilityRole="link" hitSlop={t.spacing['spacing/12']}>
              <AppText variant="Body Medium" color="Primary/Red">{tr(`${k}.seeAll`)}</AppText>
            </Pressable>
          </View>
          <View style={{ backgroundColor: t.colors['Neutral/Fog'], borderRadius: t.radius['radius/lg'], paddingHorizontal: t.spacing['spacing/16'] }}>
            {demoTransfers.map((tx, i) => (
              <Pressable
                key={tx.id}
                onPress={notBuilt('Transfer details')}
                accessibilityRole="button"
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], paddingVertical: t.spacing['spacing/16'],
                  borderTopWidth: i ? t.stroke['stroke/xs'] : 0, borderTopColor: t.colors['Neutral/Silver'],
                }}
              >
                <IconBadge icon={tx.method === 'cash' ? 'cash' : 'bank'} size={44} tone="white" />
                <View style={styles.flex}>
                  <AppText variant="Body Medium" numberOfLines={1}>{tr(`${k}.names.${tx.id}`)}</AppText>
                  <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.methods.${tx.method}`)} · {`${LRI}${tx.date}${PDI}`}</AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <AppText variant="Body Medium" style={getTextStyle('Body Medium', 'en')}>{`${LRI}£${tx.amount}${PDI}`}</AppText>
                  <AppText variant="Caption" color={tx.status === 'delivered' ? 'Status/Success/Default' : 'Neutral/Slate'}>
                    {tr(`${k}.status.${tx.status}`)}
                  </AppText>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom tab bar */}
      <View
        accessibilityRole="tablist"
        style={{
          flexDirection: 'row', borderTopWidth: t.stroke['stroke/xs'], borderTopColor: t.colors['Neutral/Silver'],
          backgroundColor: t.colors['Neutral/White'], paddingTop: t.spacing['spacing/8'], paddingBottom: t.spacing['spacing/24'],
        }}
      >
        {tabs.map((tab) => {
          const active = tab.key === 'home';
          return (
            <Pressable
              key={tab.key}
              onPress={active ? undefined : notBuilt(tr(`${k}.tabs.${tab.key}`))}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={{ flex: 1, alignItems: 'center', gap: t.spacing['spacing/4'], minHeight: t.sizes.touchTarget }}
            >
              <Icon name={tab.icon} color={active ? 'Primary/Red' : 'Neutral/Slate'} />
              <AppText variant="Overline" color={active ? 'Primary/Red' : 'Neutral/Slate'}>{tr(`${k}.tabs.${tab.key}`)}</AppText>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
