/**
 * Component gallery (dev) — every Figma component and variant, with an EN/AR switch
 * that flips the whole gallery to RTL. Sections are added group by group in Phase 2.
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import {
  AppText, Avatar, Button, DividerOr, IconBadge, IconButton, Logo, VerifiedTag,
  type ButtonType,
} from '../../components';
import { useTheme, type IconBadgeSize } from '../../theme';

function Section({ title, node, children }: { title: string; node: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: t.spacing['spacing/12'] }}>
      <View style={{ gap: t.spacing['spacing/2'] }}>
        <AppText variant="H3">{title}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">Figma {node}</AppText>
      </View>
      {children}
    </View>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <AppText variant="Overline" color="Neutral/Slate">{children}</AppText>;
}

const BUTTON_TYPES: ButtonType[] = ['primary', 'secondary', 'ghost', 'tonal', 'disabled', 'loading'];
const BADGES: { size: IconBadgeSize; tone: 'white' | 'redTint' | 'success' | 'grey'; icon: 'user' | 'type' | 'check' | 'message' | 'edit' }[] = [
  { size: 40, tone: 'white', icon: 'user' },
  { size: 32, tone: 'white', icon: 'type' },
  { size: 72, tone: 'redTint', icon: 'user' },
  { size: 20, tone: 'success', icon: 'check' },
  { size: 56, tone: 'success', icon: 'check' },
  { size: 40, tone: 'grey', icon: 'message' },
  { size: 40, tone: 'redTint', icon: 'edit' },
  { size: 44, tone: 'white', icon: 'user' },
];

export function ComponentGallery({ onToggleLocale, onShowTokens }: { onToggleLocale: () => void; onShowTokens: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const row = { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: t.spacing['spacing/12'] } as const;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: t.colors['Neutral/White'], direction: t.isRTL ? 'rtl' : 'ltr' }]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.spacing['spacing/8'],
          paddingHorizontal: t.layout.screenGutter,
          paddingVertical: t.spacing['spacing/12'],
          borderBottomWidth: t.stroke['stroke/xs'],
          borderBottomColor: t.colors['Neutral/Silver'],
        }}
      >
        <AppText variant="Title" style={styles.flex}>{tr('gallery.title')}</AppText>
        <Button size="small" type="secondary" label="Tokens" onPress={onShowTokens} />
        <Button size="small" type="primary" label={tr('gallery.switchTo')} onPress={onToggleLocale} testID="locale-toggle" />
      </View>

      <ScrollView contentContainerStyle={{ padding: t.layout.screenGutter, gap: t.spacing['spacing/40'] }}>
        <AppText variant="Overline" color="Primary/Red">GROUP 1 · BASICS</AppText>

        <Section title="Button" node="12:16">
          <Label>Size=Large</Label>
          {BUTTON_TYPES.map((type) => (
            <Button key={type} type={type} label={`${tr('gallery.button')} · ${type}`} onPress={() => {}} />
          ))}
          <Label>Size=Large · leading icon</Label>
          <Button type="secondary" icon="faceId" label={tr('gallery.continue')} onPress={() => {}} />
          <Label>Size=Small</Label>
          <View style={row}>
            {BUTTON_TYPES.map((type) => (
              <Button key={type} size="small" type={type} label={type} onPress={() => {}} />
            ))}
          </View>
          <Label>Size=Small · leading icon (“Edit”)</Label>
          <Button size="small" type="tonal" icon="edit" label={tr('common.edit')} onPress={() => {}} />
        </Section>

        <Section title="Icon Button" node="217:7015">
          <IconButton icon="globe" accessibilityLabel={tr('common.language')} onPress={() => {}} />
        </Section>

        <Section title="Logo" node="32:256">
          <Label>Tone=Brand · full / login / header</Label>
          <View style={row}>
            <Logo />
            <Logo height={t.sizes.logo.login} />
            <Logo height={t.sizes.logo.header} />
          </View>
          <Label>Tone=White</Label>
          <View style={[row, { backgroundColor: t.colors['Primary/Red'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/md'] }]}>
            <Logo tone="white" height={t.sizes.logo.login} />
          </View>
        </Section>

        <Section title="Icon Badge" node="280:6935">
          <View style={[row, { backgroundColor: t.colors['Neutral/Fog'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/md'] }]}>
            {BADGES.map((b) => (
              <View key={`${b.size}-${b.tone}`} style={{ alignItems: 'center', gap: t.spacing['spacing/4'] }}>
                <IconBadge size={b.size} tone={b.tone} icon={b.icon} />
                <AppText variant="Caption" color="Neutral/Slate">{b.size}</AppText>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Avatar" node="280:8449">
          <View style={row}>
            <Avatar initials="JC" size={56} accessibilityLabel={tr('gallery.sampleName')} />
            <Avatar initials="JC" size={44} accessibilityLabel={tr('gallery.sampleName')} />
          </View>
        </Section>

        <Section title="Divider / Or" node="280:8553">
          <DividerOr />
        </Section>

        <Section title="Verified Tag" node="282:9835">
          <VerifiedTag />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
