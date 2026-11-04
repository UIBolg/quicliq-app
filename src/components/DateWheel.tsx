/**
 * Date wheel — 1.1b "Date of birth picker" (EN 86:1491): three snapping columns (day · month · year) of
 * `sizes.wheel.item` rows, `sizes.wheel.rows` visible, with a Neutral/Fog radius/md selection band behind the middle row.
 * Selected row Title Ink, others Body Slate. Tapping a row selects it too (screen readers). Columns stay day–month–year
 * in both languages; digits Western.
 */
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme';

export type DateParts = { d: number; m: number; y: number };

function Column({ items, index, onIndex, label }: { items: string[]; index: number; onIndex: (i: number) => void; label: string }) {
  const t = useTheme();
  const h = t.sizes.wheel.item;
  const pad = h * Math.floor(t.sizes.wheel.rows / 2);
  const ref = useRef<ScrollViewInstance>(null);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => { ref.current?.scrollTo({ y: index * h, animated: false }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(settle.current), []);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const i = Math.max(0, Math.min(items.length - 1, Math.round(y / h)));
      if (i !== index) onIndex(i);
    }, 120);
  };
  return (
    <ScrollView
      ref={ref}
      style={styles.flex}
      accessibilityLabel={label}
      showsVerticalScrollIndicator={false}
      snapToInterval={h}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={32}
      contentContainerStyle={{ paddingVertical: pad }}
    >
      {items.map((it, i) => (
        <Pressable
          key={it + i}
          onPress={() => { onIndex(i); ref.current?.scrollTo({ y: i * h, animated: true }); }}
          accessibilityRole="button"
          accessibilityState={{ selected: i === index }}
          style={{ height: h, alignItems: 'center', justifyContent: 'center' }}
        >
          <AppText variant={i === index ? 'Title' : 'Body'} color={i === index ? 'Neutral/Ink' : 'Neutral/Slate'}>{it}</AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function DateWheel({ value, onChange, years, monthNames, labels }: {
  value: DateParts;
  onChange: (v: DateParts) => void;
  /** Oldest → newest. */
  years: number[];
  monthNames: string[];
  labels: { day: string; month: string; year: string };
}) {
  const t = useTheme();
  const h = t.sizes.wheel.item;
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  return (
    <View style={{ height: h * t.sizes.wheel.rows, flexDirection: 'row', direction: 'ltr' }}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: h * Math.floor(t.sizes.wheel.rows / 2), height: h, borderRadius: t.radius['radius/md'], backgroundColor: t.colors['Neutral/Fog'] }} />
      <Column items={days} index={value.d - 1} onIndex={(i) => onChange({ ...value, d: i + 1 })} label={labels.day} />
      <Column items={monthNames} index={value.m - 1} onIndex={(i) => onChange({ ...value, m: i + 1 })} label={labels.month} />
      <Column items={years.map(String)} index={Math.max(0, years.indexOf(value.y))} onIndex={(i) => onChange({ ...value, y: years[i] })} label={labels.year} />
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
