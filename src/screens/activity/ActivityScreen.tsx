/**
 * 11.1 Transfers history (History tab) — "Quicliq API Gap Analysis" 11.1 / 11.2; no Figma frame yet (#43, #50).
 * Hybrid filter (chosen on the "Quicliq Home options" canvas, board "Transfers history · Hybrid filter"):
 *  H2 title · search Text Field + filter button (Primary/Red, radius/md, text-field height; Ink count badge when active) ·
 *  active-filter tags (Alpha/Red 8%, Primary/Red, ✕ removes one) + "Clear all" ·
 *  month groups (Overline) of Transfer cards (→ 11.3, not built) · result count / empty line.
 * Filter sheet (11.2): title + Clear all · Status (multi) · Sending type (multi) · Date (one of 7/30/90 days or a custom
 * range; "Custom range" shows the DateRangeCalendar inline) · Primary "Show N transfers" with a live count of the draft.
 * Floating TabBar with History active. With the API: Transaction_LatestTransactions (paged) / Transaction_Search.
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, Button, DateRangeCalendar, FilterChip, Icon, Screen, TabBar, TextField, TransferRow, formatRange } from '../../components';
import { demoToday, demoTransfers } from '../../mock/account';
import { useMainTabs } from '../../navigation/mainTabs';
import { transferCardProps } from './transferCard';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'activity';
const STATUSES = ['processing', 'delivered'] as const;
const TYPES = ['bank', 'cash'] as const;
const PRESETS = { d7: 7, d30: 30, d90: 90 } as const;
type Status = (typeof STATUSES)[number];
type SendType = (typeof TYPES)[number];
type DateFilter = { preset: keyof typeof PRESETS } | { from: string; to?: string } | null;
type Filters = { status: Status[]; type: SendType[]; date: DateFilter };
const EMPTY: Filters = { status: [], type: [], date: null };

const DAY = 24 * 60 * 60 * 1000;
const inDate = (on: string, d: DateFilter) => {
  if (!d) return true;
  if ('preset' in d) return Date.parse(demoToday) - Date.parse(on) <= PRESETS[d.preset] * DAY;
  return on >= d.from && on <= (d.to ?? d.from);
};
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function ActivityScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '11.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const tabs = useMainTabs(navigation);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [sheet, setSheet] = useState(false);
  const [custom, setCustom] = useState(false);
  const [month, setMonth] = useState(`${demoToday.slice(0, 7)}-01`);

  const q = query.trim().toLowerCase();
  const all = demoTransfers.map((tx) => ({ tx, card: transferCardProps(tx, tr) }));
  const apply = (f: Filters) =>
    all
      .filter((x) => !q || x.card.name.toLowerCase().includes(q))
      .filter(({ tx }) => !f.status.length || f.status.includes(tx.status))
      .filter(({ tx }) => !f.type.length || f.type.includes(tx.method))
      .filter(({ tx }) => inDate(tx.on, f.date));
  const items = apply(filters);
  const months = [...new Set(items.map((x) => x.tx.month))];
  const count = filters.status.length + filters.type.length + (filters.date ? 1 : 0);
  const dateLabel = (d: NonNullable<DateFilter>) => ('preset' in d ? tr(`${k}.date.${d.preset}`) : formatRange(t.locale, d.from, d.to));

  const openSheet = () => {
    setDraft(filters);
    setCustom(!!filters.date && !('preset' in filters.date));
    setMonth(`${(filters.date && 'from' in filters.date ? filters.date.from : demoToday).slice(0, 7)}-01`);
    setSheet(true);
  };
  const tags = [
    ...filters.status.map((s) => ({ key: `s-${s}`, label: tr(`${k}.options.status.${s}`), remove: () => setFilters((f) => ({ ...f, status: f.status.filter((x) => x !== s) })) })),
    ...filters.type.map((s) => ({ key: `t-${s}`, label: tr(`${k}.options.type.${s}`), remove: () => setFilters((f) => ({ ...f, type: f.type.filter((x) => x !== s) })) })),
    ...(filters.date ? [{ key: 'date', label: dateLabel(filters.date), remove: () => setFilters((f) => ({ ...f, date: null })) }] : []),
  ];
  const draftCount = apply(draft).length;
  const btn = t.sizes.textField.height;

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/16'] }}
      >
        <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
        <View style={{ flexDirection: 'row', gap: t.spacing['spacing/8'] }}>
          <View style={styles.flex}>
            <TextField label={tr(`${k}.search`)} value={query} onChangeText={setQuery} trailing="search" autoCapitalize="none" testID="search" />
          </View>
          <Pressable
            onPress={openSheet}
            accessibilityRole="button"
            accessibilityLabel={count ? `${tr(`${k}.filter`)}, ${count}` : tr(`${k}.filter`)}
            testID="filter"
            style={({ pressed }) => ({ width: btn, height: btn, borderRadius: t.radius['radius/md'], backgroundColor: t.colors['Primary/Red'], alignItems: 'center', justifyContent: 'center', opacity: 1, overflow: 'visible' })}
          >
            {({ pressed }) => (
              <>
                {/* Filter glyph: three bars of decreasing width (no filter icon in the Figma set). */}
                <View style={{ alignItems: 'center', gap: t.spacing['spacing/4'] }}>
                  {[1, 0.66, 0.33].map((w) => (
                    <View key={w} style={{ width: t.sizes.icon.default * w, height: t.stroke['stroke/xl'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Neutral/White'] }} />
                  ))}
                </View>
                {pressed ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: t.radius['radius/md'], backgroundColor: t.colors[t.states.pressedOverlayOnDark] }]} /> : null}
                {count ? (
                  <View style={{ position: 'absolute', top: -t.spacing['spacing/6'], [t.isRTL ? 'left' : 'right']: -t.spacing['spacing/6'], minWidth: t.sizes.badge.count, height: t.sizes.badge.count, paddingHorizontal: t.spacing['spacing/4'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Neutral/Ink'], borderWidth: t.stroke['stroke/xl'], borderColor: t.colors['Neutral/White'], alignItems: 'center', justifyContent: 'center' }}>
                    <AppText variant="Overline" color="Neutral/White">{String(count)}</AppText>
                  </View>
                ) : null}
              </>
            )}
          </Pressable>
        </View>

        {tags.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
            {tags.map((tag) => (
              <Pressable
                key={tag.key}
                onPress={tag.remove}
                accessibilityRole="button"
                accessibilityLabel={`${tr(`${k}.remove`)}: ${tag.label}`}
                hitSlop={t.spacing['spacing/6']}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/6'], paddingVertical: t.spacing['spacing/6'], paddingHorizontal: t.spacing['spacing/12'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors[pressed ? 'Alpha/Red 12%' : 'Alpha/Red 8%'] })}
              >
                <AppText variant="Caption" color="Primary/Red">{tag.label}</AppText>
                <Icon name="x" size={t.sizes.icon.xxs} color="Primary/Red" />
              </Pressable>
            ))}
            <Pressable onPress={() => setFilters(EMPTY)} accessibilityRole="button" hitSlop={t.spacing['spacing/8']} testID="clear-all">
              <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.clearAll`)}</AppText>
            </Pressable>
          </View>
        ) : null}

        {count || q ? <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.matches`, { count: items.length })}</AppText> : null}
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

      {/* 11.2 Filter sheet */}
      <BottomSheet visible={sheet} onClose={() => setSheet(false)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText variant="H3" accessibilityRole="header">{tr(`${k}.sheetTitle`)}</AppText>
          <Pressable onPress={() => { setDraft(EMPTY); setCustom(false); }} accessibilityRole="button" hitSlop={t.spacing['spacing/12']} testID="sheet-clear">
            <AppText variant="Body Medium" color="Primary/Red">{tr(`${k}.clearAll`)}</AppText>
          </Pressable>
        </View>
        <Section title={tr(`${k}.groups.status`)}>
          {STATUSES.map((s) => (
            <FilterChip key={s} label={tr(`${k}.options.status.${s}`)} selected={draft.status.includes(s)} onPress={() => setDraft((d) => ({ ...d, status: toggle(d.status, s) }))} testID={`f-status-${s}`} />
          ))}
        </Section>
        <Section title={tr(`${k}.groups.type`)}>
          {TYPES.map((s) => (
            <FilterChip key={s} label={tr(`${k}.options.type.${s}`)} selected={draft.type.includes(s)} onPress={() => setDraft((d) => ({ ...d, type: toggle(d.type, s) }))} testID={`f-type-${s}`} />
          ))}
        </Section>
        <Section title={tr(`${k}.groups.date`)}>
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((p) => {
            const on = !!draft.date && 'preset' in draft.date && draft.date.preset === p;
            return <FilterChip key={p} label={tr(`${k}.date.${p}`)} selected={on} onPress={() => { setCustom(false); setDraft((d) => ({ ...d, date: on ? null : { preset: p } })); }} testID={`f-date-${p}`} />;
          })}
          <FilterChip
            label={draft.date && !('preset' in draft.date) ? formatRange(t.locale, draft.date.from, draft.date.to) : tr(`${k}.date.custom`)}
            selected={custom}
            onPress={() => { setCustom((c) => !c); if (draft.date && 'preset' in draft.date) setDraft((d) => ({ ...d, date: null })); }}
            testID="f-date-custom"
          />
        </Section>
        {custom ? (
          <DateRangeCalendar
            month={month}
            onMonth={setMonth}
            from={draft.date && 'from' in draft.date ? draft.date.from : undefined}
            to={draft.date && 'from' in draft.date ? draft.date.to : undefined}
            onChange={(from, to) => setDraft((d) => ({ ...d, date: from ? { from, to } : null }))}
            max={demoToday}
            prevLabel={tr(`${k}.prevMonth`)}
            nextLabel={tr(`${k}.nextMonth`)}
          />
        ) : null}
        <Button
          type={draftCount ? 'primary' : 'disabled'}
          label={tr(`${k}.show`, { count: draftCount })}
          onPress={() => { setFilters(draft); setSheet(false); }}
          testID="apply-filters"
        />
      </BottomSheet>
    </Screen>
  );
}

/** Section title (Body Medium) over a wrapping row of Filter Chips, gap spacing/8. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: t.spacing['spacing/8'] }}>
      <AppText variant="Body Medium" accessibilityRole="header">{title}</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing['spacing/8'] }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
