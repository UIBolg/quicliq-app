/**
 * Button — Figma component set 12:16.
 * Size=Large: 56 high, full width, radius/md, padding 0/spacing/24, gap spacing/8, Title text, 20 icon.
 * Size=Small: 32 high, hugs content, radius/full, padding 0/spacing/12, gap spacing/4, Body Medium, 16 icon.
 * Secondary border = Neutral/Silver at stroke/md. Disabled = Silver fill, white label. Loading = red + spinner.
 */
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useFocusRing } from './usePressState';
import { useTheme, type ColorToken } from '../theme';

export type ButtonSize = 'large' | 'small';
export type ButtonType = 'primary' | 'secondary' | 'ghost' | 'tonal' | 'disabled' | 'loading';

const palette: Record<ButtonType, { bg?: ColorToken; fg: ColorToken; border?: ColorToken }> = {
  primary: { bg: 'Primary/Red', fg: 'Neutral/White' },
  secondary: { bg: 'Neutral/White', fg: 'Neutral/Ink', border: 'Neutral/Silver' },
  ghost: { fg: 'Primary/Red' },
  tonal: { bg: 'Alpha/Red 8%', fg: 'Primary/Red' },
  disabled: { bg: 'Neutral/Silver', fg: 'Neutral/White' },
  loading: { bg: 'Primary/Red', fg: 'Neutral/White' },
};

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  size?: ButtonSize;
  type?: ButtonType;
  /** Optional leading icon (sits on the start side, so it moves to the right in RTL). */
  icon?: IconName;
  /** Defaults to the label. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Button({ label, onPress, size = 'large', type = 'primary', icon, accessibilityLabel, style, testID }: ButtonProps) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { focused, focusProps } = useFocusRing();
  const c = palette[type];
  const large = size === 'large';
  const inactive = type === 'disabled' || type === 'loading';
  const iconSize = large ? t.sizes.button.largeIcon : t.sizes.button.smallIcon;
  // Small buttons are 32 high; extend the touch area to 44.
  const slop = large ? undefined : (t.sizes.touchTarget - t.sizes.button.smallHeight) / 2;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={inactive}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={type === 'loading' ? tr('common.loading') : (accessibilityLabel ?? label)}
      accessibilityState={{ disabled: inactive, busy: type === 'loading' }}
      {...focusProps}
      style={[
        styles.base,
        {
          height: large ? t.sizes.button.largeHeight : t.sizes.button.smallHeight,
          alignSelf: large ? 'stretch' : 'flex-start',
          borderRadius: large ? t.radius['radius/md'] : t.radius['radius/full'],
          paddingHorizontal: large ? t.spacing['spacing/24'] : t.spacing['spacing/12'],
          gap: large ? t.spacing['spacing/8'] : t.spacing['spacing/4'],
          backgroundColor: c.bg ? t.colors[c.bg] : undefined,
          borderWidth: c.border ? t.stroke['stroke/md'] : undefined,
          borderColor: c.border ? t.colors[c.border] : undefined,
        },
        focused && { outlineColor: t.colors[t.states.focusRing.color], outlineWidth: t.stroke[t.states.focusRing.width], outlineStyle: 'solid', outlineOffset: t.spacing['spacing/2'] },
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {type === 'loading' ? (
            <View style={{ width: t.sizes.button.spinner, height: t.sizes.button.spinner, justifyContent: 'center' }}>
              <ActivityIndicator color={t.colors[c.fg]} />
            </View>
          ) : (
            <>
              {icon ? <Icon name={icon} size={iconSize} color={c.fg} /> : null}
              <AppText variant={large ? 'Title' : 'Body Medium'} color={c.fg} numberOfLines={1}>
                {label}
              </AppText>
            </>
          )}
          {pressed && !inactive ? (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: large ? t.radius['radius/md'] : t.radius['radius/full'],
                  backgroundColor: t.colors[c.bg === 'Primary/Red' ? t.states.pressedOverlayOnDark : t.states.pressedOverlay],
                },
              ]}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
