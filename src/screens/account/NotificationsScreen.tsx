/**
 * 13.2 Notifications (doc p.54), opened from the Home bell.
 * Permission prompt (Fog card, radius/lg, padding spacing/16): bell 20 · Body text · "Allow" (Body Medium, Primary/Red,
 * ≥44 touch) — hidden once allowed (with the API: Notification_RegisterDevice).
 * Rows (Notification_List): Icon Badge 40 Grey (send / shield) · title (Body Medium) over time (Caption, Slate);
 * hairline between rows; a transfer row opens 11.3, the ID row opens 4.1 (not built yet).
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Icon, IconBadge, Screen, TopBar } from '../../components';
import { demoNotifications } from '../../mock/account';
import { formatMoney } from '../../utils/format';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const k = 'account.notifications';

export function NotificationsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '13.2'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [allowed, setAllowed] = useState(false);

  return (
    <Screen>
      <TopBar title={tr(`${k}.title`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        {allowed ? null : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], paddingStart: t.spacing['spacing/16'], paddingEnd: t.spacing['spacing/4'], paddingVertical: t.spacing['spacing/8'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
            <Icon name="bell" size={t.sizes.icon.md} />
            <AppText variant="Body" style={styles.flex}>{tr(`${k}.prompt`)}</AppText>
            <Pressable
              onPress={() => setAllowed(true)}
              accessibilityRole="button"
              testID="allow-notifications"
              style={{ minWidth: t.sizes.touchTarget, minHeight: t.sizes.touchTarget, paddingHorizontal: t.spacing['spacing/12'], alignItems: 'center', justifyContent: 'center' }}
            >
              {({ pressed }) => (
                <AppText variant="Body Medium" color="Primary/Red" style={pressed ? styles.underline : undefined}>{tr(`${k}.allow`)}</AppText>
              )}
            </Pressable>
          </View>
        )}

        <View>
          {demoNotifications.map((n, i) => {
            const title = n.kind === 'sent' ? tr(`${k}.sent`, { amount: formatMoney(n.amount, 'GBP', { decimals: 'always' }), name: n.name }) : tr(`${k}.idDone`);
            const time = n.when === 'today' ? tr(`${k}.today`, { time: n.kind === 'sent' ? `⁦${n.time}⁩` : '' }) : tr(`${k}.yesterday`);
            return (
              <Pressable
                key={n.id}
                onPress={() => navigation.navigate('NotBuilt', { screenId: n.opens })}
                accessibilityRole="button"
                accessibilityLabel={`${title}, ${time}`}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: t.spacing['spacing/12'],
                  paddingVertical: t.spacing['spacing/12'],
                  borderTopWidth: i > 0 ? t.stroke['stroke/xs'] : 0,
                  borderTopColor: t.colors['Alpha/Ink 10%'],
                  backgroundColor: pressed ? t.colors['Alpha/Ink 6%'] : undefined,
                })}
              >
                <IconBadge icon={n.kind === 'sent' ? 'send' : 'shield'} size={40} tone={n.kind === 'sent' ? 'redTint' : 'grey'} />
                <View style={styles.flex}>
                  <AppText variant="Body Medium">{title}</AppText>
                  <AppText variant="Caption" color="Neutral/Slate">{time}</AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, underline: { textDecorationLine: 'underline' } });
