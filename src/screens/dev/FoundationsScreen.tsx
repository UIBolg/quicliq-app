/**
 * Dev-only preview of the Phase 1 foundations (tokens + EN/AR typography).
 * Will be replaced by the Component gallery in Phase 2.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, stroke, textStyles, useTheme, type ColorToken, type TextStyleName } from '../../theme';

const sample = { en: 'Send money home', ar: 'أرسل المال إلى الوطن' };

export function FoundationsScreen({ onToggleLocale }: { onToggleLocale: () => void }) {
  const t = useTheme();
  const dir = { direction: t.isRTL ? 'rtl' : 'ltr' } as const;
  return (
    <SafeAreaView style={[styles.root, dir]}>
      <View style={styles.header}>
        <Text style={[t.text('H3'), styles.ink]}>Foundations · {t.locale.toUpperCase()}</Text>
        <Pressable onPress={onToggleLocale} style={styles.toggle} accessibilityRole="button">
          <Text style={[t.text('Body Medium'), styles.onRed]}>← Gallery</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[t.text('Overline'), styles.slate]}>TYPOGRAPHY</Text>
        {(Object.keys(textStyles) as TextStyleName[]).map((name) => (
          <View key={name} style={styles.row}>
            <Text style={[t.text('Caption'), styles.slate]}>{textStyles[name][t.locale].figma}</Text>
            <Text style={[t.text(name), styles.ink]} numberOfLines={1}>
              {name.startsWith('Numeric') ? '£1,250' : sample[t.locale]}
            </Text>
          </View>
        ))}
        <Text style={[t.text('Overline'), styles.slate]}>COLOUR</Text>
        <View style={styles.swatches}>
          {(Object.keys(colors) as ColorToken[]).map((c) => (
            <View key={c} style={styles.swatchCell}>
              <View style={[styles.swatch, { backgroundColor: colors[c] }]} />
              <Text style={[t.text('Caption'), styles.slate]} numberOfLines={2}>{c}</Text>
            </View>
          ))}
        </View>
        <Text style={[t.text('Overline'), styles.slate]}>SPACING</Text>
        {(Object.entries(spacing) as [string, number][]).map(([k, v]) => (
          <View key={k} style={styles.inline}>
            <Text style={[t.text('Caption'), styles.slate, styles.label]}>{k}</Text>
            <View style={[styles.bar, { width: v }]} />
          </View>
        ))}
        <Text style={[t.text('Overline'), styles.slate]}>RADIUS</Text>
        <View style={styles.swatches}>
          {(Object.entries(radius) as [string, number][]).map(([k, v]) => (
            <View key={k} style={styles.swatchCell}>
              <View style={[styles.radiusBox, { borderRadius: v }]} />
              <Text style={[t.text('Caption'), styles.slate]}>{k}</Text>
            </View>
          ))}
        </View>
        <Text style={[t.text('Overline'), styles.slate]}>STROKE</Text>
        {(Object.entries(stroke) as [string, number][]).map(([k, v]) => (
          <View key={k} style={styles.inline}>
            <Text style={[t.text('Caption'), styles.slate, styles.label]}>{k}</Text>
            <View style={[styles.strokeLine, { height: v }]} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors['Neutral/White'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['spacing/24'],
    paddingVertical: spacing['spacing/16'],
  },
  toggle: {
    backgroundColor: colors['Primary/Red'],
    borderRadius: radius['radius/full'],
    paddingHorizontal: spacing['spacing/12'],
    paddingVertical: spacing['spacing/6'],
  },
  content: { paddingHorizontal: spacing['spacing/24'], paddingBottom: spacing['spacing/64'], gap: spacing['spacing/16'] },
  row: { gap: spacing['spacing/2'] },
  ink: { color: colors['Neutral/Ink'], textAlign: 'auto' },
  slate: { color: colors['Neutral/Slate'] },
  onRed: { color: colors['Neutral/White'] },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['spacing/12'] },
  swatchCell: { width: spacing['spacing/96'], gap: spacing['spacing/4'] },
  swatch: {
    height: spacing['spacing/48'],
    borderRadius: radius['radius/sm'],
    borderWidth: stroke['stroke/xs'],
    borderColor: colors['Alpha/Ink 10%'],
  },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing['spacing/12'] },
  label: { width: spacing['spacing/96'] },
  bar: { height: spacing['spacing/8'], backgroundColor: colors['Primary/Red'] },
  radiusBox: { height: spacing['spacing/56'], backgroundColor: colors['Neutral/Fog'], borderWidth: stroke['stroke/xs'], borderColor: colors['Neutral/Silver'] },
  strokeLine: { flex: 1, backgroundColor: colors['Neutral/Ink'] },
});
