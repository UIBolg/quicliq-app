/**
 * 12.4 Saved cards (doc p.48). Intro (Body, Slate) · one realistic PaymentCard per saved card (masked number, expiry,
 * brand), with a "Default" Verified Tag under the first and a red "Remove card" text button (trash icon, ≥44 touch)
 * at the end, which opens a confirm sheet (Remove / Cancel). Footer Secondary "Add card" opens the Add a card sheet (AddCardSheet, profile mode); a valid card joins the list. Empty state when no cards are left.
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, Button, Icon, IconBadge, PaymentCard, Screen, TopBar, VerifiedTag } from '../../components';
import { demoCards } from '../../mock/account';
import { AddCardSheet } from './AddCardSheet';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.cards';
type Card = { id: string; brand: string; last4: string; expires: string };

export function SavedCardsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.4'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [cards, setCards] = useState<Card[]>(demoCards);
  const [removing, setRemoving] = useState<Card | null>(null);
  const [adding, setAdding] = useState(false);
  const label = (c: Card) => `\u2066${c.brand} ••••${c.last4}\u2069`;

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/24'], gap: t.spacing['spacing/24'] }}>
        <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.intro`)}</AppText>
        {cards.length === 0 ? (
          <View style={{ alignItems: 'center', gap: t.spacing['spacing/12'], paddingTop: t.spacing['spacing/48'] }}>
            <IconBadge icon="card" size={56} tone="redTint" />
            <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.empty`)}</AppText>
          </View>
        ) : (
          cards.map((c, i) => (
            <View key={c.id} style={{ gap: t.spacing['spacing/8'] }}>
              <PaymentCard
                brand={c.brand === 'Visa' || c.brand === 'Mastercard' ? c.brand : 'Unknown'}
                number={c.last4}
                masked
                expires={c.expires}
                expiresLabel={tr(`${k}.expiresLabel`)}
                accessibilityLabel={`${label(c)}, ${tr(`${k}.expires`, { date: c.expires })}`}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {i === 0 ? <VerifiedTag label={tr(`${k}.default`)} /> : <View />}
                <Pressable
                  onPress={() => setRemoving(c)}
                  accessibilityRole="button"
                  accessibilityLabel={`${tr(`${k}.remove`)}, ${label(c)}`}
                  testID={`remove-${c.id}`}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: t.spacing['spacing/4'],
                    minHeight: t.sizes.touchTarget,
                    paddingHorizontal: t.spacing['spacing/8'],
                    borderRadius: t.radius['radius/full'],
                    backgroundColor: pressed ? t.colors['Alpha/Red 8%'] : undefined,
                  })}
                >
                  <Icon name="trash" size={t.sizes.icon.sm} color="Primary/Red" />
                  <AppText variant="Body Medium" color="Primary/Red">{tr(`${k}.remove`)}</AppText>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <View style={{ paddingHorizontal: t.layout.screenGutter, paddingTop: t.spacing['spacing/16'], paddingBottom: t.layout.footerBottom }}>
        <Button type="secondary" icon="plus" label={tr(`${k}.add`)} onPress={() => setAdding(true)} testID="add-card" />
      </View>

      <AddCardSheet
        visible={adding}
        context="profile"
        onClose={() => setAdding(false)}
        onDone={(c) => { setCards((cs) => [...cs, { id: `c${Date.now()}`, brand: c.brand, last4: c.last4, expires: c.expires }]); setAdding(false); }}
      />

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

const styles = StyleSheet.create({ flex: { flex: 1 } });
