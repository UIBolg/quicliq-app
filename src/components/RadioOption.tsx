/**
 * Radio Option — Figma 282:9637. Selectable card: Fog, radius/lg, padding spacing/16, gap spacing/12.
 * Title Body Medium (Ink) + optional subtitle Caption (Slate); 22 radio at the end.
 * Selected = Primary/Red outline at stroke/xl, radio = red ring (stroke/6xl) with a white centre.
 * Unselected = no outline, radio = white with a Neutral/Silver ring (stroke/md).
 * `titleLocale` renders the title in another language's text style (e.g. "العربية" inside the EN sheet).
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme, getTextStyle, type Locale } from '../theme';

export type RadioOptionProps = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  titleLocale?: Locale;
  subtitleLocale?: Locale;
  testID?: string;
};

export function RadioOption({ title, subtitle, selected, onPress, titleLocale, subtitleLocale, testID }: RadioOptionProps) {
  const t = useTheme();
  const r = t.sizes.radioOption.radio;
  const styleFor = (locale: Locale | undefined, name: 'Body Medium' | 'Caption') =>
    locale && locale !== t.locale
      ? // Font/line height from the other language, but alignment follows the current reading direction.
        { ...getTextStyle(name, locale), textAlign: getTextStyle(name, t.locale).textAlign }
      : undefined;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      style={() => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacing['spacing/12'],
        padding: t.spacing['spacing/16'],
        borderRadius: t.radius['radius/lg'],
        backgroundColor: t.colors['Neutral/Fog'],
        overflow: 'hidden',
        borderWidth: t.stroke['stroke/xl'],
        borderColor: selected ? t.colors['Primary/Red'] : 'transparent',
      })}
    >
      {({ pressed }) => (
        <>
          {pressed ? (
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.colors['Alpha/Ink 6%'] }]} />
          ) : null}
          <View style={{ flex: 1 }}>
            <AppText variant="Body Medium" style={styleFor(titleLocale, 'Body Medium')}>{title}</AppText>
            {subtitle ? (
              <AppText variant="Caption" color="Neutral/Slate" style={styleFor(subtitleLocale, 'Caption')}>{subtitle}</AppText>
            ) : null}
          </View>
          <View
            style={{
              width: r,
              height: r,
              borderRadius: t.radius['radius/full'],
              backgroundColor: t.colors['Neutral/White'],
              borderWidth: t.stroke[selected ? 'stroke/6xl' : 'stroke/md'],
              borderColor: t.colors[selected ? 'Primary/Red' : 'Neutral/Silver'],
            }}
          />
        </>
      )}
    </Pressable>
  );
}
