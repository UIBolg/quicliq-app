/**
 * Home — PROPOSAL, not from Figma (docs/figma-issues.md #30). Layout = option B2 chosen on the "Quicliq Home options"
 * canvas. Built only from tokens and shared components; sample data from src/mock/account.ts.
 *
 * Neutral/White page, pt spacing/8 · gutter · pb spacing/32:
 *   top group (gap spacing/16): greeting row (Avatar brand · Caption Slate + Title · IconButton bell) ·
 *     "Verify your ID and address" Action Banner (alert) → 4.1 · Limit Card (red, plane artwork) · Primary "Send money".
 *   then (gap spacing/24): Recent recipients (5 tiles, rotating avatar tones) · Recent transfers (TransferRows on Fog).
 * Composition only: every repeated pattern lives in src/components; every string in src/i18n.
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActionBanner, AppText, Avatar, Button, IconButton, LimitCard, RecipientTile, Screen, SectionHeader,
  TabBar, TransferRow, type AvatarTone, type TabBarItem,
} from '../../components';
import { demoAccount, demoLimit, demoRecipients, demoTransfers } from '../../mock/account';
import { formatMoney, ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type NotBuilt = (screenId: string) => () => void;

const k = 'home';
/** Recipient avatars cycle through these tones so the row reads as distinct people. */
const recipientTones: AvatarTone[] = ['brand', 'success', 'ink', 'tint', 'success'];

export function HomeScreen({ navigation }: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const notBuilt: NotBuilt = (screenId) => () => navigation.navigate('NotBuilt', { screenId });
  const tabs: TabBarItem[] = [
    { key: 'home', icon: 'home', label: tr(`${k}.tabs.home`) },
    { key: 'send', icon: 'send', label: tr(`${k}.tabs.send`) },
    { key: 'history', icon: 'history', label: tr(`${k}.tabs.history`) },
    { key: 'profile', icon: 'user', label: tr(`${k}.tabs.profile`) },
  ];

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/24'] }}
      >
        <Header notBuilt={notBuilt} />
        <View style={{ gap: t.spacing['spacing/24'] }}>
          <Recipients notBuilt={notBuilt} />
          <Transfers notBuilt={notBuilt} />
        </View>
      </ScrollView>
      <TabBar items={tabs} active="home" onSelect={(key) => notBuilt(tabs.find((x) => x.key === key)?.label ?? key)()} />
    </Screen>
  );
}

function Header({ notBuilt }: { notBuilt: NotBuilt }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { total, sent } = demoLimit;
  const left = Math.max(0, total - sent);

  return (
    <View style={{ gap: t.spacing['spacing/16'] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }}>
        <Avatar initials={demoAccount.initials} size={44} accessibilityLabel={demoAccount.fullName} />
        <View style={styles.flex}>
          <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.greeting`)}</AppText>
          <AppText variant="Title" accessibilityRole="header">{demoAccount.firstName}</AppText>
        </View>
        <IconButton icon="bell" accessibilityLabel={tr(`${k}.notifications`)} onPress={notBuilt('Notifications')} />
      </View>

      <ActionBanner
        icon="idCard"
        title={tr(`${k}.verify.title`)}
        message={tr(`${k}.verify.body`, { amount: formatMoney(demoAccount.verifiedLimit) })}
        onPress={notBuilt('4.1')}
        testID="verify-banner"
      />

      <LimitCard
        label={tr(`${k}.limit.title`)}
        amount={formatMoney(left)}
        caption={tr(`${k}.limit.caption`, { total: formatMoney(total) })}
        value={sent}
        max={total}
        progressLabel={tr(`${k}.limit.a11y`, { used: formatMoney(sent), total: formatMoney(total) })}
      />

      <Button icon="send" label={tr(`${k}.sendMoney`)} onPress={notBuilt('Send money')} testID="home-send" />
    </View>
  );
}

function Recipients({ notBuilt }: { notBuilt: NotBuilt }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View style={{ gap: t.spacing['spacing/12'] }}>
      <SectionHeader title={tr(`${k}.recipients`)} actionLabel={tr(`${k}.seeAll`)} onAction={notBuilt('Recipients')} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {demoRecipients.map((r, i) => (
          <RecipientTile
            key={r.id}
            initials={r.initials}
            tone={recipientTones[i % recipientTones.length]}
            shortName={tr(`${k}.recipientShort.${r.id}`)}
            fullName={tr(`${k}.recipientNames.${r.id}`)}
            actionLabel={tr(`${k}.sendMoney`)}
            onPress={notBuilt('Send money')}
          />
        ))}
      </View>
    </View>
  );
}

function Transfers({ notBuilt }: { notBuilt: NotBuilt }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View style={{ gap: t.spacing['spacing/12'] }}>
      <SectionHeader title={tr(`${k}.recent`)} actionLabel={tr(`${k}.seeAll`)} onAction={notBuilt('History')} />
      <View style={{ backgroundColor: t.colors['Neutral/Fog'], borderRadius: t.radius['radius/lg'], paddingHorizontal: t.spacing['spacing/16'], overflow: 'hidden' }}>
        {demoTransfers.map((tx, i) => (
          <TransferRow
            key={tx.id}
            divider={i > 0}
            name={tr(`${k}.names.${tx.id}`)}
            method={tx.method}
            methodLabel={tr(`${k}.methods.${tx.method}`)}
            date={ltr(tx.date)}
            amount={formatMoney(Number(tx.amount), 'GBP', { decimals: 'always' })}
            status={tx.status}
            statusLabel={tr(`${k}.status.${tx.status}`)}
            onPress={notBuilt('Transfer details')}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
