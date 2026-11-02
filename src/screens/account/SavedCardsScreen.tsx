/**
 * 12.4 Saved cards (doc p.48). Intro (Body, Slate) · Fog card (radius/lg) of rows: card thumbnail (48×32, radius/xs —
 * Visa = Neutral/Ink with "VISA" Overline, Mastercard = Primary/Red with two overlapping white circles; brand colours
 * aren't tokens) · "Visa ••••4242" (Body Medium) + "Default" Verified Tag on the first card, over "Expires 08/28"
 * (Caption, Slate) · trash button (Primary/Red icon, 44 touch area). Trash opens a confirm sheet
 * (Remove / Cancel). Footer Secondary "Add card" → 6.5a (not built yet). Empty state when no cards are left.
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, Button, Icon, IconBadge, Screen, TopBar, VerifiedTag } from '../../components';
import { demoCards } from '../../mock/account';
import { getTextStyle, useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.cards';
type Card = (typeof demoCards)[number];

export function SavedCardsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.4'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [cards, setCards] = useState<Card[]>(demoCards);
  const [removing, setRemoving] = useState<Card | null>(null);
  const label = (c: Card) => `\u2066${c.brand} ••••${c.last4}\u2069`;

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.intro`)}</AppText>
        {cards.length === 0 ? (
          <View style={{ alignItems: 'center', gap: t.spacing['spacing/12'], paddingTop: t.spacing['spacing/48'] }}>
            <IconBadge icon="card" size={56} tone="grey" />
            <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.empty`)}</AppText>
          </View>
        ) : (
          <View style={{ backgroundColor: t.colors['Neutral/Fog'], borderRadius: t.radius['radius/lg'], paddingHorizontal: t.spacing['spacing/16'] }}>
          {cards.map((c, i) => (
            <View
              key={c.id}
              accessible={false}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.spacing['spacing/12'],
                paddingVertical: t.spacing['spacing/12'],
                borderTopWidth: i > 0 ? t.stroke['stroke/xs'] : 0,
                borderTopColor: t.colors['Alpha/Ink 10%'],
              }}
            >
              <CardThumb brand={c.brand} />
              <View style={styles.flex}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
                  <AppText variant="Body Medium">{label(c)}</AppText>
                  {i === 0 ? <VerifiedTag label={tr(`${k}.default`)} /> : null}
                </View>
                <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.expires`, { date: `⁦${c.expires}⁩` })}</AppText>
              </View>
              <Pressable
                onPress={() => setRemoving(c)}
                accessibilityRole="button"
                accessibilityLabel={`${tr(`${k}.remove`)}, ${label(c)}`}
                testID={`remove-${c.id}`}
                style={({ pressed }) => ({
                  width: t.sizes.touchTarget,
                  height: t.sizes.touchTarget,
                  borderRadius: t.radius['radius/full'],
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed ? t.colors['Alpha/Red 8%'] : undefined,
                })}
              >
                <Icon name="trash" size={t.sizes.icon.md} color="Primary/Red" />
              </Pressable>
            </View>
          ))}
          </View>
        )}
      </ScrollView>
      <View style={{ paddingHorizontal: t.layout.screenGutter, paddingTop: t.spacing['spacing/16'], paddingBottom: t.layout.footerBottom }}>
        <Button type="secondary" icon="plus" label={tr(`${k}.add`)} onPress={() => navigation.navigate('NotBuilt', { screenId: '6.5a' })} testID="add-card" />
      </View>

      <BottomSheet visible={!!removing} onClose={() => setRemoving(null)}>
        <View style={{ gap: t.spacing['spacing/8'] }}>
          <AppText variant="H3" accessibilityRole="header">{tr(`${k}.sheetTitle`)}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate">{removing ? tr(`${k}.sheetBody`, { card: label(removing) }) : ''}</AppText>
        </View>
        <View style={{ gap: t.spacing['spacing/12'] }}>
          <Button
            label={tr(`${k}.confirm`)}
            onPress={() => { setCards((cs) => cs.filter((c) => c.id !== removing?.id)); setRemoving(null); }}
            testID="confirm-remove"
          />
          <Button type="secondary" label={tr(`${k}.cancel`)} onPress={() => setRemoving(null)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

/** Mini card face. Never mirrored. */
function CardThumb({ brand }: { brand: string }) {
  const t = useTheme();
  const s = t.sizes.cardThumb;
  const visa = brand === 'Visa';
  return (
    <View
      accessible={false}
      style={{ width: s.width, height: s.height, borderRadius: t.radius['radius/xs'], backgroundColor: t.colors[visa ? 'Neutral/Ink' : 'Primary/Red'], alignItems: 'center', justifyContent: 'center', flexDirection: 'row', direction: 'ltr' }}
    >
      {visa ? (
        <AppText variant="Overline" color="Neutral/White" style={getTextStyle('Overline', 'en')}>VISA</AppText>
      ) : (
        <>
          <View style={{ width: s.dot, height: s.dot, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 85%'] }} />
          <View style={{ width: s.dot, height: s.dot, borderRadius: t.radius['radius/full'], backgroundColor: t.colors['Alpha/White 50%'], marginLeft: -t.spacing['spacing/6'] }} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
