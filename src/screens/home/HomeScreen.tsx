/**
 * Home — PROPOSAL, not from Figma. The Figma file has no Home screen yet (pages: Documentation, Components,
 * Icons & Illustrations, Log in & Sign up, Forgot Password, Verify ID & Address). Built only from existing tokens and
 * components so the login flows have somewhere to land and the team can react to a direction; replace it with the
 * designer's frames once they exist (docs/figma-issues.md #30). Sample data from src/mock/account.ts.
 *
 * Two variants (route param `variant`), sharing the header and the bottom tab bar:
 *  verified   — white page: Send card (Primary/Red: corridor, today's rate, "Send money") · Quick actions ·
 *               Recent transfers.
 *  unverified — customer hasn't finished ID & address checks (Verify ID & Address 4.x). Neutral/Fog page with white
 *               cards: Setup card (Primary/Red: "Finish setting up to send money", n of 2 steps, progress bar,
 *               Inverse small "Continue setup" → 4.1 hub) · Send money card (editable "You send" GBP, "They receive"
 *               JOD, rate · fee, disabled "Verify to send") · "No transfers yet" empty state.
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Avatar, Button, Flag, Icon, IconBadge, IconButton, Screen, type IconName } from '../../components';
import { demoAccount, demoTransfers } from '../../mock/account';
import { useTheme, getTextStyle } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const LRI = '⁦';
const PDI = '⁩';
const ltr = (s: string) => `${LRI}${s}${PDI}`;
const k = 'home';

function greetingKey(date = new Date()) {
  const h = date.getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

export function HomeScreen({ navigation, route }: Props) {
  const t = useTheme();
  const unverified = route.params?.variant === 'unverified';
  const notBuilt = (screenId: string) => () => navigation.navigate('NotBuilt', { screenId });

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
      <TabBar notBuilt={notBuilt} />
    </Screen>
  );
}

type NotBuilt = (screenId: string) => () => void;

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
  const actions: { key: string; icon: IconName }[] = [
    { key: 'send', icon: 'send' },
    { key: 'recipients', icon: 'users' },
    { key: 'rates', icon: 'trendingUp' },
    { key: 'help', icon: 'help' },
  ];
  return (
    <>
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
            {ltr(demoAccount.rate.jod)}
          </AppText>
          <AppText variant="Body" color="Alpha/White 80%">{tr(`${k}.rateNote`, { gbp: ltr('£1') })}</AppText>
        </View>
        <Button type="secondary" icon="send" label={tr(`${k}.sendMoney`)} onPress={notBuilt('Send money')} testID="home-send" />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {actions.map((a) => (
          <Pressable key={a.key} onPress={notBuilt(tr(`${k}.actions.${a.key}`))} accessibilityRole="button" style={{ alignItems: 'center', gap: t.spacing['spacing/8'], flex: 1 }}>
            <IconBadge icon={a.icon} size={56} tone="redTint" />
            <AppText variant="Caption" style={{ textAlign: 'center' }}>{tr(`${k}.actions.${a.key}`)}</AppText>
          </Pressable>
        ))}
      </View>

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
                <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.methods.${tx.method}`)} · {ltr(tx.date)}</AppText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <AppText variant="Body Medium" style={getTextStyle('Body Medium', 'en')}>{ltr(`£${tx.amount}`)}</AppText>
                <AppText variant="Caption" color={tx.status === 'delivered' ? 'Status/Success/Default' : 'Neutral/Slate'}>
                  {tr(`${k}.status.${tx.status}`)}
                </AppText>
              </View>
            </Pressable>
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
  const [amount, setAmount] = useState<string>(demoAccount.quote.defaultAmount);
  const done = demoAccount.setupStepsDone;
  const total = demoAccount.setupStepsTotal;
  const value = Number.parseFloat(amount.replace(',', '.'));
  const receive = Number.isFinite(value) ? (value * demoAccount.quote.rate).toFixed(2) : '0.00';
  const card = { backgroundColor: t.colors['Neutral/White'], borderRadius: t.radius['radius/xl'], padding: t.spacing['spacing/24'], ...t.elevation.card };

  return (
    <>
      {/* Setup card */}
      <View style={{ backgroundColor: t.colors['Primary/Red'], borderRadius: t.radius['radius/xl'], padding: t.spacing['spacing/24'], gap: t.spacing['spacing/16'] }}>
        <View style={{ gap: t.spacing['spacing/4'] }}>
          <AppText variant="H3" color="Neutral/White" accessibilityRole="header">{tr(`${k}.setup.title`)}</AppText>
          <AppText variant="Body" color="Alpha/White 80%">{tr(`${k}.setup.progress`, { done, total })}</AppText>
        </View>
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: total, now: done }}
          style={{ height: t.sizes.setupProgress.height, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 25%'], overflow: 'hidden' }}
        >
          <View
            style={{
              height: '100%',
              width: done ? `${(done / total) * 100}%` : t.sizes.setupProgress.minFill,
              borderRadius: t.radius['radius/full'],
              backgroundColor: t.colors['Neutral/White'],
            }}
          />
        </View>
        <Button size="small" type="inverse" trailingIcon="chevronRight" label={tr(`${k}.setup.continue`)} onPress={notBuilt('4.1')} testID="continue-setup" />
      </View>

      {/* Send money calculator */}
      <View style={[card, { gap: t.spacing['spacing/16'] }]}>
        <AppText variant="H3" accessibilityRole="header">{tr(`${k}.calc.title`)}</AppText>
        <View style={{ gap: t.spacing['spacing/12'] }}>
          <AmountRow label={tr(`${k}.calc.youSend`)} currency="GBP" value={amount} onChangeText={setAmount} />
          <AmountRow label={tr(`${k}.calc.theyReceive`)} currency="JOD" value={receive} />
        </View>
        <AppText variant="Caption" color="Neutral/Slate">
          {ltr(`1 GBP = ${demoAccount.quote.rate} JOD`)} · {tr(`${k}.calc.fee`, { fee: ltr(demoAccount.quote.fee) })}
        </AppText>
        <Button type="disabled" label={tr(`${k}.calc.verifyToSend`)} accessibilityLabel={`${tr(`${k}.calc.verifyToSend`)}. ${tr(`${k}.calc.verifyHint`)}`} />
      </View>

      {/* Empty state */}
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

/** One "You send" / "They receive" row: Fog, radius/lg, amount (EN/H3, always LTR) + caption, currency pill at the end. */
function AmountRow({ label, currency, value, onChangeText }: { label: string; currency: string; value: string; onChangeText?: (v: string) => void }) {
  const t = useTheme();
  const amountStyle = [getTextStyle('H3', 'en'), { color: t.colors['Neutral/Ink'], textAlign: t.isRTL ? 'right' : 'left' } as const];
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

/* ───────────── Tab bar ───────────── */

function TabBar({ notBuilt }: { notBuilt: NotBuilt }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const tabs: { key: string; icon: IconName }[] = [
    { key: 'home', icon: 'home' },
    { key: 'send', icon: 'send' },
    { key: 'history', icon: 'history' },
    { key: 'profile', icon: 'user' },
  ];
  return (
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
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  input: { padding: 0, margin: 0, outlineStyle: 'none' } as object,
});
