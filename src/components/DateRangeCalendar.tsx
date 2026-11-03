/**
 * Date range calendar — code addition (Transfers history date filter; no Figma component yet, docs/figma-issues.md #46).
 * Month header (Title, centred) between prev/next Icon Buttons (chevrons mirror in RTL) · weekday row (Caption, Slate) ·
 * 6×7 day grid, 44 cells. Tap a day to start the range, tap another to end it (earlier day = new start); a third tap
 * starts over. Start/end = Primary/Red circle + White digits; days between = Alpha/Red 8% band; today = Primary/Red digits;
 * days after `max` are disabled (Silver). Digits stay Western; the grid follows the reading direction.
 * Dates are ISO strings (YYYY-MM-DD).
 */
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { useTheme } from '../theme';

const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const intlLocale = (l: string) => (l === 'ar' ? 'ar-u-nu-latn' : 'en-GB');

export function DateRangeCalendar({ month, onMonth, from, to, onChange, max, prevLabel, nextLabel }: {
  /** First day of the shown month, ISO. */
  month: string;
  onMonth: (month: string) => void;
  from?: string;
  to?: string;
  onChange: (from?: string, to?: string) => void;
  /** Last selectable day (today), ISO. */
  max: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const t = useTheme();
  const loc = intlLocale(t.locale);
  const [y, m] = month.split('-').map(Number);
  const m0 = m - 1;
  const first = new Date(Date.UTC(y, m0, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first
  const days = new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(loc, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i))));
  const title = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
  const shift = (n: number) => { const d = new Date(Date.UTC(y, m0 + n, 1)); onMonth(iso(d.getUTCFullYear(), d.getUTCMonth(), 1)); };
  const canNext = new Date(Date.UTC(y, m0 + 1, 1)).toISOString().slice(0, 10) <= max;

  const pick = (d: string) => {
    if (!from || (from && to)) return onChange(d, undefined);
    if (d < from) return onChange(d, from);
    onChange(from, d);
  };
  const cell = t.sizes.touchTarget;

  return (
    <View style={{ gap: t.spacing['spacing/8'] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon="chevronLeft" accessibilityLabel={prevLabel} onPress={() => shift(-1)} testID="cal-prev" />
        <AppText variant="Title" accessibilityRole="header">{title}</AppText>
        <IconButton icon="chevronRight" accessibilityLabel={nextLabel} onPress={() => shift(1)} disabled={!canNext} testID="cal-next" />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {weekdays.map((w, i) => (
          <AppText key={i} variant="Caption" color="Neutral/Slate" style={{ flex: 1, textAlign: 'center' }}>{w}</AppText>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, i) => {
          if (d == null) return <View key={`e${i}`} style={{ width: `${100 / 7}%`, height: cell }} />;
          const day = iso(y, m0, d);
          const disabled = day > max;
          const isEnd = day === from || day === to;
          const between = !!from && !!to && day > from && day < to;
          const label = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m0, d)));
          return (
            <Pressable
              key={day}
              disabled={disabled}
              onPress={() => pick(day)}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: isEnd || between, disabled }}
              testID={`day-${day}`}
              style={{ width: `${100 / 7}%`, height: cell, alignItems: 'center', justifyContent: 'center', backgroundColor: between ? t.colors['Alpha/Red 8%'] : undefined }}
            >
              {({ pressed }) => (
                <View style={{ width: cell - t.spacing['spacing/4'], height: cell - t.spacing['spacing/4'], borderRadius: t.radius['radius/full'], alignItems: 'center', justifyContent: 'center', backgroundColor: isEnd ? t.colors['Primary/Red'] : pressed ? t.colors['Alpha/Ink 6%'] : undefined }}>
                  <AppText variant="Body Medium" color={isEnd ? 'Neutral/White' : disabled ? 'Neutral/Silver' : day === max ? 'Primary/Red' : 'Neutral/Ink'}>{String(d)}</AppText>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** "1 Oct – 28 Oct 2026" style label for a range (Western digits, locale month names). */
export function formatRange(locale: string, from: string, to?: string) {
  const f = new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const d = (s: string) => new Date(`${s}T00:00:00Z`);
  return to && to !== from ? `${f.format(d(from))} – ${f.format(d(to))}` : f.format(d(from));
}
