/**
 * 12.4 Saved cards (doc p.48). One row per card: Icon Badge 40 (card) · "Visa ••••4242" (Body Medium) over
 * "Expires 08/28" (Caption, Slate) · trash button (Primary/Red icon, 44 touch area). Trash opens a confirm sheet
 * (Remove / Cancel). Footer Secondary "Add card" → 6.5a (not built yet). Empty state when no cards are left.
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, BottomSheet, Button, Icon, IconBadge, Screen, TopBar } from '../../components';
import { demoCards } from '../../mock/account';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.cards';
type Card = (typeof demoCards)[number];

export function SavedCardsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.4'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [cards, setCards] = useState<Card[]>(demoCards);
  const [removing, setRemoving] = useState<Card | null>(null);
  const label = (c: Card) => `${c.brand} ⁦••••${c.last4}⁩`;

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter }}>
        {cards.length === 0 ? (
          <View style={{ alignItems: 'center', gap: t.spacing['spacing/12'], paddingTop: t.spacing['spacing/48'] }}>
            <IconBadge icon="card" size={56} tone="grey" />
            <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.empty`)}</AppText>
          </View>
        ) : (
          cards.map((c, i) => (
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
              <IconBadge icon="card" size={40} tone="grey" />
              <View style={styles.flex}>
                <AppText variant="Body Medium">{label(c)}</AppText>
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
          ))
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

const styles = StyleSheet.create({ flex: { flex: 1 } });
