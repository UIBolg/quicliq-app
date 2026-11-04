/**
 * 12.7 Legal (doc p.51): List Group of Privacy Policy · Fraud Warning · Terms and conditions → 12.7a document view.
 * 12.7a: see LegalDocumentScreen below (Figma "Legal" content for Privacy Policy and Fraud Warning).
 */
import type { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Banner, Button, IconBadge, ListGroup, ListRow, Screen, TopBar, type IconName } from '../../components';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.legal';
const DOCS = ['privacy', 'fraud', 'terms'] as const;
export type LegalDoc = (typeof DOCS)[number];

export function LegalScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.7'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.intro`)}</AppText>
        <ListGroup>
          {DOCS.map((d) => (
            <ListRow key={d} icon="file" title={tr(`${k}.${d}`)} onPress={() => navigation.navigate('12.7a', { doc: d })} testID={`doc-${d}`} />
          ))}
        </ListGroup>
      </ScrollView>
    </Screen>
  );
}

type Block =
  | { type: 'points' | 'do' | 'dont' | 'steps'; title: string; items: string[]; note?: string }
  | { type: 'list'; title: string; icon: IconName; items: string[] }
  | { type: 'section'; title: string; body: string; link?: string }
  | { type: 'cards'; title: string; icons: IconName[]; items: [string, string][]; after?: string; link?: string }
  | { type: 'contact'; title: string; link: string; line: string }
  | { type: 'company'; title: string; lines: string[] }
  | { type: 'banner'; text: string };
type Doc = { icon: IconName; title: string; intro: string; blocks: Block[] };

const openLink = (v: string) => { Linking.openURL(v.includes('@') ? `mailto:${v}` : `https://${v}`).catch(() => {}); };

/** Email / web address in Body Medium Primary/Red, opens mail or the browser. */
function DocLink({ value }: { value: string }) {
  const t = useTheme();
  return (
    <Pressable onPress={() => openLink(value)} accessibilityRole="link" hitSlop={t.spacing['spacing/12']} style={{ alignSelf: 'flex-start' }}>
      {({ pressed }) => <AppText variant="Body Medium" color="Primary/Red" style={pressed ? styles.underline : undefined}>{ltr(value)}</AppText>}
    </Pressable>
  );
}

/** Fog card (radius/lg, padding spacing/16, gap spacing/12) of List Items: 32 badge + Body Medium line. */
function ItemCard({ items, icon, tone }: { items: string[]; icon: (i: number) => ReactNode; tone?: 'fog' | 'white' }) {
  const t = useTheme();
  return (
    <View style={{ backgroundColor: t.colors[tone === 'white' ? 'Neutral/White' : 'Neutral/Fog'], borderRadius: t.radius['radius/lg'], padding: t.spacing['spacing/16'], gap: t.spacing['spacing/12'] }}>
      {items.map((it, i) => (
        <View key={it} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
          {icon(i)}
          <AppText variant="Body Medium" style={styles.flex}>{it}</AppText>
        </View>
      ))}
    </View>
  );
}

function DocBlock({ b }: { b: Block }) {
  const t = useTheme();
  const head = 'title' in b && b.type !== 'company' ? <AppText variant="H3" accessibilityRole="header">{b.title}</AppText> : null;
  const gap = { gap: t.spacing['spacing/12'] };
  switch (b.type) {
    case 'banner':
      return <Banner type="error" text={b.text} />;
    case 'points':
    case 'do':
    case 'dont': {
      const icon: IconName = b.type === 'dont' ? 'x' : 'check';
      return (
        <View style={gap}>
          {head}
          <ItemCard items={b.items} icon={() => <IconBadge icon={icon} size={32} tone={b.type === 'points' ? 'redTint' : 'white'} />} />
          {b.note ? <AppText variant="Body" color="Neutral/Slate">{b.note}</AppText> : null}
        </View>
      );
    }
    case 'list':
      return <View style={gap}>{head}<ItemCard items={b.items} icon={() => <IconBadge icon={b.icon} size={32} tone="white" />} /></View>;
    case 'steps':
      return (
        <View style={gap}>
          {head}
          <ItemCard items={b.items} icon={(i) => (
            <View style={{ width: t.sizes.limitStep.badge, height: t.sizes.limitStep.badge, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Primary/Red'], alignItems: 'center', justifyContent: 'center' }}>
              <AppText variant="Body Medium" color="Neutral/White">{String(i + 1)}</AppText>
            </View>
          )} />
        </View>
      );
    case 'section':
      return (
        <View style={{ gap: t.spacing['spacing/8'] }}>
          {head}
          <AppText variant="Body" color="Neutral/Slate">{b.body}</AppText>
          {b.link ? <DocLink value={b.link} /> : null}
        </View>
      );
    case 'cards':
      return (
        <View style={gap}>
          {head}
          <View style={{ gap: t.spacing['spacing/8'] }}>
            {b.items.map(([title, body], i) => (
              <View key={title} style={{ flexDirection: 'row', gap: t.spacing['spacing/12'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], borderWidth: t.stroke['stroke/xs'], borderColor: t.colors['Neutral/Dark Fog'], backgroundColor: t.colors['Neutral/Fog'] }}>
                <IconBadge icon={b.icons[i] ?? 'info'} size={32} tone="redTint" />
                <View style={[styles.flex, { gap: t.spacing['spacing/2'] }]}>
                  <AppText variant="Body Medium">{title}</AppText>
                  <AppText variant="Body" color="Neutral/Slate">{body}</AppText>
                </View>
              </View>
            ))}
          </View>
          {b.after ? <AppText variant="Body" color="Neutral/Slate">{b.after}</AppText> : null}
          {b.link ? <DocLink value={b.link} /> : null}
        </View>
      );
    case 'contact':
      return (
        <View style={gap}>
          {head}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
            <IconBadge icon="mail" size={32} tone="redTint" />
            <DocLink value={b.link} />
          </View>
          <AppText variant="Caption" color="Neutral/Slate">{b.line}</AppText>
        </View>
      );
    case 'company':
      return (
        <View style={{ gap: t.spacing['spacing/4'], paddingTop: t.spacing['spacing/16'], borderTopWidth: t.stroke['stroke/xs'], borderTopColor: t.colors['Neutral/Dark Fog'] }}>
          <AppText variant="Body Medium">{b.title}</AppText>
          {b.lines.map((l) => <AppText key={l} variant="Caption" color="Neutral/Slate">{l}</AppText>)}
        </View>
      );
  }
}

/**
 * 12.7a Legal document — Figma "Legal" (EN 153:5034 / AR 153:5049): Privacy Policy (153:4190) and Fraud Warning
 * (153:4369). TopBar · Heading (56 red-tint icon tile, H2, Body Large Slate intro) · blocks (key points, sections,
 * rights / scams cards, do / don't lists, warning signs, steps, company) · Footer Primary "Done".
 * Terms and conditions has no Figma frame yet → Info banner (loads from GetHtmlFromTemplate with the API).
 */
export function LegalDocumentScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '12.7a'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const doc = route.params.doc;
  const content = doc === 'terms' ? null : (tr(`${k}.docs.${doc}`, { returnObjects: true }) as Doc);
  const g = t.layout.screenGutter;
  return (
    <Screen>
      <TopBar title={tr(`${k}.${doc}`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/32'] }}>
        {content ? (
          <>
            <View style={{ gap: t.spacing['spacing/12'] }}>
              <IconBadge icon={content.icon} size={56} tone="redTint" />
              <AppText variant="H2" accessibilityRole="header">{content.title}</AppText>
              <AppText variant="Body Large" color="Neutral/Slate">{content.intro}</AppText>
            </View>
            {content.blocks.map((b, i) => <DocBlock key={i} b={b} />)}
          </>
        ) : (
          <Banner type="info" text={tr(`${k}.placeholder`)} />
        )}
      </ScrollView>
      {content ? (
        <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing['spacing/40'] }}>
          <Button label={tr(`${k}.done`)} onPress={() => navigation.goBack()} testID="done" />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, underline: { textDecorationLine: 'underline' } });
