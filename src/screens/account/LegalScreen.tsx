/**
 * 12.7 Legal (doc p.51): List Group of Privacy Policy · Fraud Warning · Terms and conditions → 12.7a document view.
 * 12.7a: TopBar with the document title; the text comes from GetHtmlFromTemplate, which isn't connected yet, so an
 * Info Banner says where it will load (no invented legal text).
 */
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Banner, ListGroup, ListRow, Screen, TopBar } from '../../components';
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

export function LegalDocumentScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, '12.7a'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <Screen>
      <TopBar title={tr(`${k}.${route.params.doc}`)} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.flex} contentContainerStyle={{ paddingHorizontal: t.layout.screenGutter }}>
        <Banner type="info" text={tr(`${k}.placeholder`)} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
