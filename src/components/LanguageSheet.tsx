/**
 * Choose language sheet — "Onboarding — Choose language" (217:16719 / AR 217:16909), shared by Onboarding and Account.
 * Bottom Sheet: Sheet Header (title, Primary/Red subtitle, close) · Radio Options (current language first, as in Figma),
 * gap spacing/8. Each language title uses its own locale's text style.
 */
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from './BottomSheet';
import { RadioOption } from './RadioOption';
import { SheetHeader } from './SheetParts';
import { useTheme, type Locale } from '../theme';

export function LanguageSheet({ visible, locale, onClose, onChoose }: {
  visible: boolean;
  locale: Locale;
  onClose: () => void;
  onChoose: (locale: Locale) => void;
}) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <SheetHeader title={tr('onboarding.language.title')} subtitle={tr('onboarding.language.subtitle')} onClose={onClose} />
      <View style={{ gap: t.spacing['spacing/8'] }}>
        {(locale === 'en' ? (['en', 'ar'] as const) : (['ar', 'en'] as const)).map((l) => (
          <RadioOption
            key={l}
            testID={`language-${l}`}
            title={tr(`onboarding.language.${l}.title`)}
            subtitle={l === locale ? undefined : tr(`onboarding.language.${l}.subtitle`)}
            titleLocale={l}
            selected={l === locale}
            onPress={() => onChoose(l)}
          />
        ))}
      </View>
    </BottomSheet>
  );
}
