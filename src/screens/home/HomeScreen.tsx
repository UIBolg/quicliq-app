/**
 * Home — PROPOSAL, not from Figma. The Figma file has no Home screen yet (docs/figma-issues.md #30); built only from
 * existing tokens and shared components. Sample data from src/mock/account.ts. Audit: docs/design-system-audit-home.md.
 *
 * Header (Primary/Red, light status bar, bottom corners radius/xl; pt spacing/8 · gutter · pb spacing/24, gap spacing/24):
 *   greeting row (Avatar onBrand · Caption White 80% + Title White · IconButton onBrand bell) ·
 *   "Verify your ID and address" Action Banner → 4.1 ·
 *   sending limit (Body Large White 80% · Numeric L White · Body White 80% · ProgressBar md onBrand) ·
 *   Inverse "Send money" with the send icon.
 * Body (Neutral/White, pt spacing/24 · gutter, gap spacing/24):
 *   today's rate card (Status/Success/Light: UK + JO flags, Overline Success/Dark, Title rate, trendingUp) ·
 *   Recent recipients (last 5 RecipientTiles in rotating avatar tones) · Recent transfers (TransferRows on Fog).
 * Composition only: every repeated pattern lives in src/components; every string in src/i18n.
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActionBanner, AppText, Avatar, Button, Flag, Icon, IconButton, ProgressBar, RecipientTile, Screen, SectionHeader,
  TabBar, TransferRow, type AvatarTone, type TabBarItem,
} from '../../components';
import { demoAccount, demoLimit, demoRecipients, demoTransfers } from '../../mock/account';
import { formatMoney, ltr } from '../../utils/format';
import { useTheme, getTextStyle } from '../../theme';
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
    <Screen edges={['top']} background="Primary/Red" statusBar="light">
      <ScrollView style={[styles.flex, { backgroundColor: t.colors['Neutral/White'] }]} contentContainerStyle={{ paddingBottom: t.spacing['spacing/32'] }}>
        <Header notBuilt={notBuilt} />
        <View style={{ paddingTop: t.spacing['spacing/24'], paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/24'] }}>
          <RateCard />
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
    <View
      style={{
        backgroundColor: t.colors['Primary/Red'],
        borderBottomLeftRadius: t.radius['radius/xl'],
        borderBottomRightRadius: t.radius['radius/xl'],
        paddingTop: t.spacing['spacing/8'],
        paddingHorizontal: t.layout.screenGutter,
        paddingBottom: t.spacing['spacing/24'],
        gap: t.spacing['spacing/24'],
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }}>
        <Avatar initials={demoAccount.initials} size={44} tone="onBrand" accessibilityLabel={demoAccount.fullName} />
        <View style={styles.flex}>
          <AppText variant="Caption" color="Alpha/White 80%">{tr(`${k}.greeting`)}</AppText>
          <AppText variant="Title" color="Neutral/White" accessibilityRole="header">{demoAccount.firstName}</AppText>
        </View>
        <IconButton icon="bell" onBrand accessibilityLabel={tr(`${k}.notifications`)} onPress={notBuilt('Notifications')} />
      </View>

      <ActionBanner
        icon="idCard"
        title={tr(`${k}.verify.title`)}
        subtitle={tr(`${k}.verify.body`, { amount: formatMoney(demoAccount.verifiedLimit) })}
        onPress={notBuilt('4.1')}
        testID="verify-banner"
      />

      <View style={{ gap: t.spacing['spacing/8'] }}>
        <AppText variant="Body Large" color="Alpha/White 80%">{tr(`${k}.limit.title`)}</AppText>
        <AppText variant="Numeric L" color="Neutral/White" style={[getTextStyle('Numeric L', 'en'), { color: t.colors['Neutral/White'] }, startAlign(t.isRTL)]}>
          {formatMoney(left)}
        </AppText>
        <AppText variant="Body" color="Alpha/White 80%">{tr(`${k}.limit.left`, { total: formatMoney(total) })}</AppText>
        <View style={{ paddingTop: t.spacing['spacing/8'] }}>
          <ProgressBar value={sent} max={total} tone="onBrand" accessibilityLabel={tr(`${k}.limit.a11y`, { used: formatMoney(sent), total: formatMoney(total) })} />
        </View>
      </View>

      <Button type="inverse" icon="send" label={tr(`${k}.sendMoney`)} onPress={notBuilt('Send money')} testID="home-send" />
    </View>
  );
}

function RateCard() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const rate = ltr(`1 GBP = ${demoAccount.rate.jod} JOD`);
  return (
    <View
      accessible
      accessibilityLabel={`${tr(`${k}.rateLabel`)}, ${tr(`${k}.corridor`)}: ${rate}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacing['spacing/12'],
        backgroundColor: t.colors['Status/Success/Light'],
        borderRadius: t.radius['radius/lg'],
        padding: t.spacing['spacing/16'],
      }}
    >
      {/* Flags stay in UK → JO order in both languages (never mirrored). */}
      <View style={{ flexDirection: 'row', direction: 'ltr', gap: t.spacing['spacing/2'] }}>
        <Flag country="UK" />
        <Flag country="JO" />
      </View>
      <View style={styles.flex}>
        <AppText variant="Overline" color="Status/Success/Dark">{tr(`${k}.rateLabel`)}</AppText>
        <AppText variant="Title" style={[getTextStyle('Title', 'en'), { color: t.colors['Neutral/Ink'] }, startAlign(t.isRTL)]}>{rate}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.corridor`)}</AppText>
      </View>
      <Icon name="trendingUp" size={t.sizes.icon.default} color="Status/Success/Default" />
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

/** Text that uses an EN style inside an RTL screen still starts at the reading start. */
const startAlign = (isRTL: boolean) => ({ textAlign: isRTL ? ('right' as const) : ('left' as const) });

const styles = StyleSheet.create({ flex: { flex: 1 } });
