/**
 * Agreement — Figma 281:7794. Checkbox + sentence (Body, Ink) with a linked document (Body, Primary/Red, underlined),
 * gap spacing/8. Tapping the sentence toggles the box; tapping the link opens the document.
 * Documents: Privacy Policy, Fraud Warning (copy from Figma EN/AR variants).
 */
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Checkbox } from './Checkbox';
import { useTheme } from '../theme';

export type AgreementDocument = 'privacy' | 'fraud';

export type AgreementProps = {
  document: AgreementDocument;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onOpenDocument: (document: AgreementDocument) => void;
};

export function Agreement({ document, checked, onChange, onOpenDocument }: AgreementProps) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const prefix = tr(`components.agreement.${document}.prefix`);
  const link = tr(`components.agreement.${document}.link`);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
      <Checkbox checked={checked} onChange={onChange} accessibilityLabel={`${prefix}${link}`} />
      <Pressable onPress={() => onChange(!checked)} accessible={false} style={{ flex: 1 }}>
        <AppText variant="Body">
          {prefix}
          <AppText
            variant="Body"
            color="Primary/Red"
            onPress={() => onOpenDocument(document)}
            accessibilityRole="link"
            style={{ textDecorationLine: 'underline' }}
            suppressHighlighting={false}
          >
            {link}
          </AppText>
        </AppText>
      </Pressable>
    </View>
  );
}
