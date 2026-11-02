/**
 * 12.6 Language (doc p.50). Two Radio Options (English / العربية, each title in its own language's style);
 * choosing one switches the app at once (and, with the API, stores it for SMS and email — Sender_SetLanguage).
 */
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RadioOption, Screen, TopBar } from '../../components';
import { useLocale } from '../../i18n/LocaleProvider';
import { useTheme } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

export function LanguageScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '12.6'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { locale, setLocale } = useLocale();
  return (
    <Screen>
      <TopBar title={tr('account.language.title')} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter, gap: t.spacing['spacing/12'] }}>
        {(['en', 'ar'] as const).map((l) => (
          <RadioOption
            key={l}
            title={tr(`onboarding.language.${l}.title`)}
            titleLocale={l}
            selected={locale === l}
            onPress={() => setLocale(l)}
            testID={`language-${l}`}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
