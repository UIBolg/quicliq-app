/**
 * 11.1 Transfers history (History tab) — "Quicliq API Gap Analysis" 11.1 ("Activity"); no Figma frame yet (#43).
 * Page pt spacing/8 · gutter · pb spacing/32, gap spacing/16:
 *  H2 "Transfers history" · search Text Field (trailing search; filters by name) ·
 *  3 dropdown Filter Chips — Status (all/processing/delivered) · Sending type (all/bank/cash) · Date (any/30/90 days);
 *  each opens a Bottom Sheet of Radio Options; active chips turn Primary/Red; they combine with search (replaces 11.2) ·
 *  month groups (Overline, Slate; gap spacing/8) of Transfer cards (→ 11.3, not built) · empty line when nothing matches.
 * Floating TabBar with History active. With the API: Transaction_LatestTransactions (paged) / Transaction_Search.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, FilterChip, RadioOption, Screen, TabBar, TextField, TransferRow } from '../../components';
import { demoToday, demoTransfers } from '../../mock/account';
import { useMainTabs } from '../../navigation/mainTabs';
import { transferCardProps } from './transferCard';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'activity';
const OPTIONS = {
  status: ['all', 'processing', 'delivered'],
  type: ['all', 'bank', 'cash'],
  date: ['all', 'days30', 'days90'],
} as const;
type Group = keyof typeof OPTIONS;
type Picked = { [G in Group]: (typeof OPTIONS)[G][number] };
const DAY = 24 * 60 * 60 * 1000;
const withinDays = (iso: string, days: number) => Date.parse(demoToday) - Date.parse(iso) <= days * DAY;

export function ActivityScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '11.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const tabs = useMainTabs(navigation);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<Picked>({ status: 'all', type: 'all', date: 'all' });
  const [open, setOpen] = useState<Group | null>(null);
  const q = query.trim().toLowerCase();
  const items = demoTransfers.map((tx) => ({ tx, card: transferCardProps(tx, tr) })).filter((x) => !q || x.card.name.toLowerCase().includes(q))
    .filter(({ tx }) => picked.status === 'all' || tx.status === picked.status)
    .filter(({ tx }) => picked.type === 'all' || tx.method === picked.type)
    .filter(({ tx }) => picked.date === 'all' || withinDays(tx.on, picked.date === 'days30' ? 30 : 90));
  const months = [...new Set(items.map((x) => x.tx.month))];

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/16'] }}
      >
        <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
        <TextField label={tr(`${k}.search`)} value={query} onChangeText={setQuery} trailing="search" autoCapitalize="none" testID="search" />
        {/* Three filters (combine with search and each other); each chip opens a sheet of options. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -t.layout.screenGutter }}
          contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/8'] }}
        >
          {(Object.keys(OPTIONS) as Group[]).map((g) => (
            <FilterChip
              key={g}
              dropdown
              label={picked[g] === 'all' ? tr(`${k}.groups.${g}`) : tr(`${k}.options.${g}.${picked[g]}`)}
              selected={picked[g] !== 'all'}
              onPress={() => setOpen(g)}
              testID={`filter-${g}`}
            />
          ))}
        </ScrollView>

        {months.length === 0 ? <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.empty`)}</AppText> : null}
        {months.map((m) => (
          <View key={m} style={{ gap: t.spacing['spacing/8'] }}>
            <AppText variant="Overline" color="Neutral/Slate" accessibilityRole="header">{tr(`${k}.months.${m}`)}</AppText>
            {items.filter((x) => x.tx.month === m).map(({ tx, card }) => (
              <TransferRow key={tx.id} {...card} onPress={() => navigation.navigate('NotBuilt', { screenId: '11.3' })} />
            ))}
          </View>
        ))}
      </ScrollView>
      <TabBar items={tabs.items} active="history" onSelect={tabs.onSelect} />
      <BottomSheet visible={!!open} onClose={() => setOpen(null)}>
        {open ? (
          <>
            <AppText variant="H3" accessibilityRole="header">{tr(`${k}.groups.${open}`)}</AppText>
            <View style={{ gap: t.spacing['spacing/8'] }}>
              {OPTIONS[open].map((o) => (
                <RadioOption
                  key={o}
                  title={tr(`${k}.options.${open}.${o}`)}
                  selected={picked[open] === o}
                  onPress={() => { setPicked((p) => ({ ...p, [open]: o })); setOpen(null); }}
                  testID={`option-${open}-${o}`}
                />
              ))}
            </View>
          </>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
