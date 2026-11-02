/**
 * Home — PROPOSAL, not from Figma. The Figma file has no Home screen yet (pages: Documentation, Components,
 * Icons & Illustrations, Log in & Sign up, Forgot Password, Verify ID & Address). Built only from existing tokens and
 * shared components so the login flows have somewhere to land; replace with the designer's frames once they exist
 * (docs/figma-issues.md #30). Sample data from src/mock/account.ts. Design-system audit: docs/design-system-audit-home.md.
 *
 * Two variants (route param `variant`), sharing the header and the TabBar:
 *  verified   — white page: sending-limit card (Fog, Numeric L amount, ProgressBar md) · Primary "Send money" ·
 *               Recent recipients (last 5 RecipientTiles) · Recent transfers (TransferRows on Fog).
 *  unverified — Neutral/Fog page with white cards: setup card (Primary/Red, ProgressBar sm onBrand, Inverse small
 *               "Continue setup" → 4.1) · Send money calculator (You send GBP / They receive JOD, rate · fee,
 *               disabled "Verify to send") · "No transfers yet" empty state.
 * Composition only: every repeated pattern lives in src/components; every string in src/i18n.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, Avatar, Button, IconBadge, IconButton, ProgressBar, RecipientTile, Screen, SectionHeader, TabBar, TransferRow,
  type TabBarItem,
} from '../../components';
import { demoAccount, demoLimit, demoRecipients, demoTransfers } from '../../mock/account';
import { formatAmount, formatMoney, ltr } from '../../utils/format';
import { useTheme, getTextStyle } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type NotBuilt = (screenId: string) => () => void;

const k = 'home';

function greetingKey(date = new Date()) {
  const h = date.getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

export function HomeScreen({ navigation, route }: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const unverified = route.params?.variant === 'unverified';
  const notBuilt: NotBuilt = (screenId) => () => navigation.navigate('NotBuilt', { screenId });
  const tabs: TabBarItem[] = [
    { key: 'home', icon: 'home', label: tr(`${k}.tabs.home`) },
    { key: 'send', icon: 'send', label: tr(`${k}.tabs.send`) },
    { key: 'history', icon: 'history', label: tr(`${k}.tabs.history`) },
    { key: 'profile', icon: 'user', label: tr(`${k}.tabs.profile`) },
  ];

  return (
    <Screen edges={['top']} background={unverified ? 'Neutral/Fog' : 'Neutral/White'}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingTop: t.spacing['spacing/8'],
          paddingHorizontal: t.layout.screenGutter,
          paddingBottom: t.spacing['spacing/32'],
          gap: t.spacing[unverified ? 'spacing/16' : 'spacing/24'],
        }}
      >
        <Header unverified={unverified} onBell={notBuilt('Notifications')} />
        {unverified ? <UnverifiedBody notBuilt={notBuilt} /> : <VerifiedBody notBuilt={notBuilt} />}
      </ScrollView>
      <TabBar items={tabs} active="home" onSelect={(key) => notBuilt(tabs.find((x) => x.key === key)?.label ?? key)()} />
    </Screen>
  );
}

function Header({ unverified, onBell }: { unverified: boolean; onBell: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }}>
      <Avatar initials={demoAccount.initials} size={44} accessibilityLabel={demoAccount.fullName} />
      <View style={styles.flex}>
        <AppText variant="Caption" color="Neutral/Slate">
          {unverified ? tr(`${k}.greetings.${greetingKey()}`) : tr(`${k}.greeting`)}
        </AppText>
        <AppText variant="Title" accessibilityRole="header">{demoAccount.firstName}</AppText>
      </View>
      <IconButton icon="bell" surface={unverified} accessibilityLabel={tr(`${k}.notifications`)} onPress={onBell} />
    </View>
  );
}

/* ───────────── Verified ───────────── */

function VerifiedBody({ notBuilt }: { notBuilt: NotBuilt }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { total, sent } = demoLimit;
  const left = Math.max(0, total - sent);

  return (
    <>
      <View style={{ backgroundColor: t.colors['Neutral/Fog'], borderRadius: t.radius['radius/xl'], padding: t.spacing['spacing/24'], gap: t.spacing['spacing/8'] }}>
        <AppText variant="Body Large" color="Neutral/Slate">{tr(`${k}.limit.title`)}</AppText>
        <AppText variant="Numeric L" style={[getTextStyle('Numeric L', 'en'), startAlign(t.isRTL)]}>{formatMoney(left)}</AppText>
        <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.limit.left`, { total: formatMoney(total) })}</AppText>
        <View style={{ paddingTop: t.spacing['spacing/8'] }}>
          <ProgressBar value={sent} max={total} accessibilityLabel={tr(`${k}.limit.a11y`, { used: formatMoney(sent), total: formatMoney(total) })} />
        </View>
      </View>

      <Button label={tr(`${k}.sendMoney`)} onPress={notBuilt('Send money')} testID="home-send" />

      <View style={{ gap: t.spacing['spacing/12'] }}>
        <SectionHeader title={tr(`${k}.recipients`)} actionLabel={tr(`${k}.seeAll`)} onAction={notBuilt('Recipients')} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {demoRecipients.map((r) => (
            <RecipientTile
              key={r.id}
              initials={r.initials}
              shortName={tr(`${k}.recipientShort.${r.id}`)}
              fullName={tr(`${k}.recipientNames.${r.id}`)}
              actionLabel={tr(`${k}.sendMoney`)}
              onPress={notBuilt('Send money')}
            />
          ))}
        </View>
      </View>

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
    </>
  );
}

/* ───────────── Unverified ───────────── */

function UnverifiedBody({ notBuilt }: { notBuilt: NotBuilt }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { quote } = demoAccount;
  const [amount, setAmount] = useState<string>(quote.defaultAmount);
  const done = demoAccount.setupStepsDone;
  const total = demoAccount.setupStepsTotal;
  const value = Number.parseFloat(amount.replace(',', '.'));
  const receive = formatAmount(Number.isFinite(value) ? value * quote.rate : 0);
  const progressText = tr(`${k}.setup.progress`, { done, total });
  const card = { backgroundColor: t.colors['Neutral/White'], borderRadius: t.radius['radius/xl'], ...t.elevation.card };

  return (
    <>
      <View style={{ backgroundColor: t.colors['Primary/Red'], borderRadius: t.radius['radius/xl'], padding: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
        <View style={{ gap: t.spacing['spacing/4'] }}>
          <AppText variant="H3" color="Neutral/White" accessibilityRole="header">{tr(`${k}.setup.title`)}</AppText>
          <AppText variant="Body" color="Alpha/White 80%">{progressText}</AppText>
        </View>
        <ProgressBar value={done} max={total} size="sm" tone="onBrand" accessibilityLabel={progressText} />
        <Button size="small" type="inverse" trailingIcon="chevronRight" label={tr(`${k}.setup.continue`)} onPress={notBuilt('4.1')} testID="continue-setup" />
      </View>

      <View style={[card, { padding: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }]}>
        <AppText variant="H3" accessibilityRole="header">{tr(`${k}.calc.title`)}</AppText>
        <View style={{ gap: t.spacing['spacing/12'] }}>
          <AmountRow label={tr(`${k}.calc.youSend`)} currency="GBP" value={amount} onChangeText={setAmount} />
          <AmountRow label={tr(`${k}.calc.theyReceive`)} currency="JOD" value={receive} />
        </View>
        <AppText variant="Caption" color="Neutral/Slate">
          {tr(`${k}.calc.rateLine`, { rate: ltr(`1 GBP = ${quote.rate} JOD`), fee: formatMoney(Number(quote.fee), 'GBP', { decimals: 'always' }) })}
        </AppText>
        <Button type="disabled" label={tr(`${k}.calc.verifyToSend`)} accessibilityLabel={`${tr(`${k}.calc.verifyToSend`)}. ${tr(`${k}.calc.verifyHint`)}`} />
      </View>

      <View style={[card, { padding: t.spacing['spacing/16'], flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'] }]}>
        <IconBadge icon="clock" size={44} tone="grey" />
        <View style={styles.flex}>
          <AppText variant="Body Medium">{tr(`${k}.empty.title`)}</AppText>
          <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.empty.body`)}</AppText>
        </View>
      </View>
    </>
  );
}

/** "You send" / "They receive" row: Fog, radius/lg, amount (EN/H3, LTR) + Caption label, currency label at the end. */
function AmountRow({ label, currency, value, onChangeText }: { label: string; currency: 'GBP' | 'JOD'; value: string; onChangeText?: (v: string) => void }) {
  const t = useTheme();
  const amountStyle = [getTextStyle('H3', 'en'), { color: t.colors['Neutral/Ink'] }, startAlign(t.isRTL)];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], backgroundColor: t.colors['Neutral/Fog'], borderRadius: t.radius['radius/lg'], padding: t.spacing['spacing/16'] }}>
      <View style={styles.flex}>
        {onChangeText ? (
          <TextInput
            value={value}
            onChangeText={(v) => onChangeText(v.replace(/[^0-9.,]/g, ''))}
            keyboardType="decimal-pad"
            inputMode="decimal"
            accessibilityLabel={`${label}, ${currency}`}
            style={[amountStyle, styles.input]}
            testID="you-send"
          />
        ) : (
          <AppText variant="H3" style={amountStyle} accessibilityLabel={`${label}, ${value} ${currency}`}>{ltr(value)}</AppText>
        )}
        <AppText variant="Caption" color="Neutral/Slate">{label}</AppText>
      </View>
      <View style={{ backgroundColor: t.colors['Neutral/White'], borderRadius: t.radius['radius/full'], paddingVertical: t.spacing['spacing/8'], paddingHorizontal: t.spacing['spacing/16'] }}>
        <AppText variant="Body Medium" style={getTextStyle('Body Medium', 'en')}>{currency}</AppText>
      </View>
    </View>
  );
}

/** Text that uses an EN style inside an RTL screen still starts at the reading start. */
const startAlign = (isRTL: boolean) => ({ textAlign: isRTL ? ('right' as const) : ('left' as const) });

const styles = StyleSheet.create({
  flex: { flex: 1 },
  input: { padding: 0, margin: 0, outlineStyle: 'none' } as object,
});
