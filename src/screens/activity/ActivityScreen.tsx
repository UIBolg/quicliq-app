/**
 * 11.1 Activity (History tab) — "Quicliq API Gap Analysis" 11.1; no Figma frame yet (docs/figma-issues.md #43).
 * Page pt spacing/8 · gutter · pb spacing/32, gap spacing/16:
 *  H2 "Activity" + Icon Button filter (→ 11.2 sheet, not built) · search Text Field (trailing search; filters by name) ·
 *  month groups (Overline, Slate; gap spacing/8) of Transfer cards (→ 11.3, not built) · empty line when nothing matches.
 * Floating TabBar with History active. With the API: Transaction_LatestTransactions (paged) / Transaction_Search.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, IconButton, Screen, TabBar, TextField, TransferRow } from '../../components';
import { demoTransfers } from '../../mock/account';
import { useMainTabs } from '../../navigation/mainTabs';
import { transferCardProps } from './transferCard';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'activity';

export function ActivityScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '11.1'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const tabs = useMainTabs(navigation);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const items = demoTransfers.map((tx) => ({ tx, card: transferCardProps(tx, tr) })).filter((x) => !q || x.card.name.toLowerCase().includes(q));
  const months = [...new Set(items.map((x) => x.tx.month))];

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/32'], gap: t.spacing['spacing/16'] }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText variant="H2" accessibilityRole="header">{tr(`${k}.title`)}</AppText>
          <IconButton icon="grid" accessibilityLabel={tr(`${k}.filter`)} onPress={() => navigation.navigate('NotBuilt', { screenId: '11.2' })} testID="filter" />
        </View>
        <TextField label={tr(`${k}.search`)} value={query} onChangeText={setQuery} trailing="search" autoCapitalize="none" testID="search" />

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
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
