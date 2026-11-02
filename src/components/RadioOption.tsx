/**
 * Radio Option — Figma 282:9637. Selectable card: Fog, radius/lg, padding spacing/16, gap spacing/12.
 * Title Body Medium (Ink) + optional subtitle Caption (Slate); 22 radio at the end.
 * Selected = Primary/Red outline at stroke/xl, radio = red ring (stroke/6xl) with a white centre.
 * Unselected = no outline, radio = white with a Neutral/Silver ring (stroke/md).
 * Icon=On (7.2c / 7.8d code method): 40 Neutral/White badge with a 20 icon (Primary/Red when selected, Ink otherwise)
 * at the start, gap spacing/8; title + subtitle (Body, Slate) gap spacing/4.
 * `titleLocale` renders the title in another language's text style (e.g. "العربية" inside the EN sheet).
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useTheme, getTextStyle, type Locale } from '../theme';

export type RadioOptionProps = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  titleLocale?: Locale;
  subtitleLocale?: Locale;
  testID?: string;
};

export function RadioOption({ title, subtitle, selected, onPress, icon, titleLocale, subtitleLocale, testID }: RadioOptionProps) {
  const t = useTheme();
  const r = t.sizes.radioOption.radio;
  const styleFor = (locale: Locale | undefined, name: 'Body Medium' | 'Body' | 'Caption') =>
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
        gap: t.spacing[icon ? 'spacing/8' : 'spacing/12'],
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
          {icon ? (
            <View
              style={{
                width: t.sizes.radioOptionIcon.badge,
                height: t.sizes.radioOptionIcon.badge,
                borderRadius: t.radius['radius/full'],
                backgroundColor: t.colors['Neutral/White'],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={icon} size={t.sizes.radioOptionIcon.icon} color={selected ? 'Primary/Red' : 'Neutral/Ink'} />
            </View>
          ) : null}
          <View style={{ flex: 1, gap: icon ? t.spacing['spacing/4'] : 0 }}>
            <AppText variant="Body Medium" style={styleFor(titleLocale, 'Body Medium')}>{title}</AppText>
            {subtitle ? (
              <AppText variant={icon ? 'Body' : 'Caption'} color="Neutral/Slate" style={styleFor(subtitleLocale, icon ? 'Body' : 'Caption')}>
                {subtitle}
              </AppText>
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
