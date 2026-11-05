/**
 * 11.1 Transfers history (History tab) — "Quicliq API Gap Analysis" 11.1 ("Activity"); no Figma frame yet (#43).
 * Page pt spacing/8 · gutter · pb spacing/32, gap spacing/16:
 *  H2 "Transfers history" · search Text Field (trailing search; filters by name) ·
 *  3 dropdown Filter Chips — Status (all/processing/delivered) · Sending type (all/bank/cash) (Bottom Sheet of Radio Options) ·
 *  Date (Bottom Sheet with a DateRangeCalendar, Clear / Apply; chip shows the range); active chips turn Primary/Red; they combine with search (replaces 11.2) ·
 *  month groups (Overline, Slate; gap spacing/8) of Transfer cards (→ 11.3, not built) · empty line when nothing matches.
 * Floating TabBar with History active. With the API: Transaction_LatestTransactions (paged) / Transaction_Search.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, Button, DateRangeCalendar, FilterChip, Screen, TabBar, TextField, TransferRow, formatRange } from '../../components';
import { demoToday, demoTransfers } from '../../mock/account';
import { useMainTabs } from '../../navigation/mainTabs';
import { transferCardProps } from './transferCard';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'activity';
const OPTIONS = {
  status: ['all', 'processing', 'delivered'],
  type: ['all', 'bank', 'cash'],
} as const;
type Group = keyof typeof OPTIONS;
type Picked = { [G in Group]: (typeof OPTIONS)[G][number] };
type Range = { from: string; to?: string } | null;

export function ActivityScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '11.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const tabs = useMainTabs(navigation);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<Picked>({ status: 'all', type: 'all' });
  const [open, setOpen] = useState<Group | 'date' | null>(null);
  const [range, setRange] = useState<Range>(null);
  // Draft range + shown month while the date sheet is open; applied on "Apply".
  const [draft, setDraft] = useState<Range>(null);
  const [month, setMonth] = useState(`${demoToday.slice(0, 7)}-01`);
  const openDate = () => { setDraft(range); setMonth(`${(range?.from ?? demoToday).slice(0, 7)}-01`); setOpen('date'); };
  const q = query.trim().toLowerCase();
  const items = demoTransfers.map((tx) => ({ tx, card: transferCardProps(tx, tr) })).filter((x) => !q || x.card.name.toLowerCase().includes(q))
    .filter(({ tx }) => picked.status === 'all' || tx.status === picked.status)
    .filter(({ tx }) => picked.type === 'all' || tx.method === picked.type)
    .filter(({ tx }) => !range || (tx.on >= range.from && tx.on <= (range.to ?? range.from)));
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
          <FilterChip
            dropdown
            label={range ? formatRange(t.locale, range.from, range.to) : tr(`${k}.groups.date`)}
            selected={!!range}
            onPress={openDate}
            testID="filter-date"
          />
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
      {/* Date range sheet */}
      <BottomSheet visible={open === 'date'} onClose={() => setOpen(null)}>
        <AppText variant="H3" accessibilityRole="header">{tr(`${k}.groups.date`)}</AppText>
        <DateRangeCalendar
          month={month}
          onMonth={setMonth}
          from={draft?.from}
          to={draft?.to}
          onChange={(from, to) => setDraft(from ? { from, to } : null)}
          max={demoToday}
          prevLabel={tr(`${k}.prevMonth`)}
          nextLabel={tr(`${k}.nextMonth`)}
        />
        <AppText variant="Body" color="Neutral/Slate" style={{ textAlign: 'center' }}>
          {draft ? formatRange(t.locale, draft.from, draft.to) : tr(`${k}.pickRange`)}
        </AppText>
        <View style={{ flexDirection: 'row', gap: t.spacing['spacing/12'] }}>
          <View style={styles.flex}>
            <Button type="secondary" label={tr(`${k}.clear`)} onPress={() => { setRange(null); setDraft(null); setOpen(null); }} testID="date-clear" />
          </View>
          <View style={styles.flex}>
            <Button type={draft ? 'primary' : 'disabled'} label={tr(`${k}.apply`)} onPress={() => { setRange(draft); setOpen(null); }} testID="date-apply" />
          </View>
        </View>
      </BottomSheet>

      <BottomSheet visible={!!open && open !== 'date'} onClose={() => setOpen(null)}>
        {open && open !== 'date' ? (
          <>
            <AppText variant="H3" accessibilityRole="header">{tr(`${k}.filters`)}</AppText>
            {(Object.keys(OPTIONS) as Group[]).map((g) => (
              <View key={g} style={{ gap: t.spacing['spacing/8'] }}>
                <AppText variant="Body Medium">{tr(`${k}.groups.${g}`)}</AppText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing['spacing/8'] }}>
                  {OPTIONS[g].map((o) => (
                    <FilterChip
                      key={o}
                      label={tr(`${k}.options.${g}.${o}`)}
                      selected={picked[g] === o}
                      onPress={() => setPicked((p) => ({ ...p, [g]: o }))}
                      testID={`option-${g}-${o}`}
                    />
                  ))}
                </View>
              </View>
            ))}
          </>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
