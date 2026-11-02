/**
 * Onboarding 1–4 — Illustrated (EN 202:6388, AR 202:6715) + "Choose language" sheet (217:16719 / 217:16909).
 *
 * Layout (Figma): Header pt spacing/8, gutter spacing/24, top bar 40 high (Logo 24 high at start, Icon Button globe
 * at end). Illustration pt spacing/16, canvas 360. Flexible spacer. Bottom: gap spacing/24 — Pagination, Text
 * (EN/AR Display title + Body Large Slate, gap spacing/8), Actions (gap spacing/12: Primary "Sign up",
 * Secondary "Log in"), pb spacing/40.
 *
 * The four slides (illustration + dots + text) swipe as a pager; the buttons stay fixed. In RTL the pager runs
 * right-to-left (slide 1 on the right) and the dots follow.
 * Sign up → Registration 1.1 (not built yet) · Log in → 7.1.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, Button, IconButton, LanguageSheet, Logo, OnboardingScene, Pagination, Screen,
  type OnboardingSceneName,
} from '../../components';
import { useLocale } from '../../i18n/LocaleProvider';
import { useTheme, type Locale } from '../../theme';
import type { RootStackParamList } from '../../navigation/routes';

const SLIDES: { key: string; scene: OnboardingSceneName }[] = [
  { key: 'slide1', scene: 'sendMoney' },
  { key: 'slide2', scene: 'rates' },
  { key: 'slide3', scene: 'receiving' },
  { key: 'slide4', scene: 'secure' },
];

export function OnboardingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width } = size;
  const [step, setStep] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const listRef = useRef<FlatList<(typeof SLIDES)[number]>>(null);

  // The list itself is always laid out LTR; in RTL the slides are reversed so slide 1 is the right-most page.
  const data = useMemo(() => (t.isRTL ? [...SLIDES].reverse() : SLIDES), [t.isRTL]);
  const indexToStep = useCallback((i: number) => (t.isRTL ? SLIDES.length - i : i + 1), [t.isRTL]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    setStep(indexToStep(Math.round(e.nativeEvent.contentOffset.x / width)));
  };

  const chooseLanguage = (next: Locale) => {
    setSheetOpen(false);
    if (next !== locale) {
      setLocale(next);
      setStep(1); // the pager is re-keyed by locale, so it restarts on Onboarding 1
    }
  };

  const g = t.layout.screenGutter;

  return (
    <Screen>
      {/* Header — top bar */}
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: g }}>
        <View style={[styles.topBar, { height: t.sizes.iconButton.size }]}>
          <Pressable
            // Development builds only: long-press the logo to open the read-only component gallery.
            onLongPress={__DEV__ ? () => navigation.navigate('dev/Gallery') : undefined}
            accessible={false}
          >
            <Logo height={t.sizes.logo.header} />
          </Pressable>
          <IconButton icon="globe" accessibilityLabel={tr('common.language')} onPress={() => setSheetOpen(true)} testID="language-button" />
        </View>
      </View>

      {/* Slides */}
      <View style={styles.flex} onLayout={(e: LayoutChangeEvent) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
        {width > 0 ? (
          <FlatList
            key={locale}
            ref={listRef}
            data={data}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            style={{ direction: 'ltr' }}
            initialScrollIndex={t.isRTL ? SLIDES.length - 1 : 0}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            onMomentumScrollEnd={onScrollEnd}
            onScrollEndDrag={onScrollEnd}
            keyExtractor={(s) => s.key}
            renderItem={({ item, index }) => (
              <View style={{ width, height: size.height, direction: t.isRTL ? 'rtl' : 'ltr' }} testID={`onboarding-${item.key}`}>
                <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g }}>
                  <OnboardingScene name={item.scene} />
                </View>
                <View style={styles.flex} />
                <View style={{ paddingHorizontal: g, gap: t.spacing['spacing/24'] }}>
                  <Pagination step={indexToStep(index)} count={SLIDES.length} />
                  <View style={{ gap: t.spacing['spacing/8'] }}>
                    <AppText variant="Display" numberOfLines={1} accessibilityRole="header">
                      {tr(`onboarding.${item.key}.title`)}
                    </AppText>
                    <AppText variant="Body Large" color="Neutral/Slate">{tr(`onboarding.${item.key}.body`)}</AppText>
                  </View>
                </View>
              </View>
            )}
          />
        ) : null}
      </View>

      {/* Actions — fixed */}
      <View style={{ paddingHorizontal: g, paddingTop: t.spacing['spacing/24'], paddingBottom: t.spacing['spacing/40'], gap: t.spacing['spacing/12'] }}>
        <Button type="primary" label={tr('onboarding.signUp')} onPress={() => navigation.navigate('NotBuilt', { screenId: '1.1' })} testID="sign-up" />
        <Button type="secondary" label={tr('onboarding.logIn')} onPress={() => navigation.navigate('7.1')} testID="log-in" />
      </View>

      {/* Choose language */}
      <LanguageSheet visible={sheetOpen} locale={locale} onClose={() => setSheetOpen(false)} onChoose={chooseLanguage} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
