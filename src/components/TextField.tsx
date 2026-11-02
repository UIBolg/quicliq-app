/**
 * Text Field — Figma 21:388. Filled field, 64 high, radius/md, padding 0/spacing/16, gap spacing/8.
 * Label (Caption) sits inside above the value (Body Large), gap spacing/2.
 * States: Default (Fog, Slate text) · Filled (Fog, Ink value) · Focused (White + Ink outline stroke/md)
 *         · Error (Failure/Light + Failure outline, red label, message below with 14 alert)
 *         · Locked (no fill, dashed Silver outline, 18 lock, read-only).
 * Trailing: eye (toggles password visibility) | calendar | chevron | none.
 * Helper sits spacing/8 below the field.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useTheme, type ColorToken } from '../theme';

export type TextFieldState = 'default' | 'filled' | 'focused' | 'error' | 'locked';
export type TextFieldTrailing = 'eye' | 'calendar' | 'chevron' | 'none';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'editable'> & {
  label: string;
  value?: string;
  helper?: string;
  /** Error message; puts the field in the Error state. */
  error?: string;
  /** Error look without a message under the field (7.3: the message is in a Banner above the form). */
  invalid?: boolean;
  locked?: boolean;
  trailing?: TextFieldTrailing;
  /** For picker fields (calendar / chevron): the field becomes a button that opens the picker. */
  onPress?: () => void;
  /** Force a visual state (component gallery only). */
  previewState?: TextFieldState;
  testID?: string;
};

/** Numbers, dates, phone numbers and masked values are never reordered in RTL (build rule 4). */
const NUMERIC = /^[\d\s/+\-.•()]+$/;
const isolateLtr = (v: string) => (NUMERIC.test(v) ? `\u2066${v}\u2069` : v);

const look: Record<TextFieldState, { bg?: ColorToken; border?: ColorToken; dashed?: boolean; label: ColorToken; value: ColorToken }> = {
  default: { bg: 'Neutral/Fog', label: 'Neutral/Slate', value: 'Neutral/Slate' },
  filled: { bg: 'Neutral/Fog', label: 'Neutral/Slate', value: 'Neutral/Ink' },
  focused: { bg: 'Neutral/White', border: 'Neutral/Ink', label: 'Neutral/Slate', value: 'Neutral/Ink' },
  error: { bg: 'Status/Failure/Light', border: 'Status/Failure/Default', label: 'Status/Failure/Default', value: 'Neutral/Ink' },
  locked: { border: 'Neutral/Silver', dashed: true, label: 'Neutral/Slate', value: 'Neutral/Slate' },
};

export function TextField({
  label, value = '', helper, error, invalid, locked, trailing = 'none', onPress, previewState, testID,
  secureTextEntry, onFocus, onBlur, placeholder, ...inputProps
}: TextFieldProps) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const state: TextFieldState =
    previewState ?? (locked ? 'locked' : error || invalid ? 'error' : focused ? 'focused' : value ? 'filled' : 'default');
  const c = look[state];
  const isPassword = trailing === 'eye';
  const iconSlop = (t.sizes.touchTarget - t.sizes.textField.icon) / 2;

  const textBlock = (
    <View style={{ flex: 1, gap: t.spacing['spacing/2'] }}>
      <AppText variant="Caption" color={c.label} numberOfLines={1}>{label}</AppText>
      {onPress || locked ? (
        <AppText variant="Body Large" color={value ? c.value : 'Neutral/Slate'} numberOfLines={1}>
          {value ? isolateLtr(value) : placeholder}
        </AppText>
      ) : (
        <TextInput
          {...inputProps}
          testID={testID}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={t.colors['Neutral/Slate']}
          secureTextEntry={isPassword ? !revealed : secureTextEntry}
          accessibilityLabel={label}
          accessibilityHint={error ?? helper}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          style={[t.text('Body Large'), styles.input, { color: t.colors[c.value], textAlign: t.isRTL ? 'right' : 'left' }]}
        />
      )}
    </View>
  );

  const box = (
    <View
      style={{
        height: t.sizes.textField.height,
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacing['spacing/8'],
        paddingHorizontal: t.spacing['spacing/16'],
        borderRadius: t.radius['radius/md'],
        backgroundColor: c.bg ? t.colors[c.bg] : undefined,
        borderWidth: c.border ? t.stroke['stroke/md'] : 0,
        borderColor: c.border ? t.colors[c.border] : undefined,
        borderStyle: c.dashed ? 'dashed' : 'solid',
        overflow: 'hidden',
      }}
    >
      {textBlock}
      {state === 'locked' ? <Icon name="lock" size={t.sizes.textField.lock} color="Neutral/Slate" /> : null}
      {isPassword && state !== 'locked' ? (
        <Pressable
          onPress={() => setRevealed((r) => !r)}
          hitSlop={iconSlop}
          accessibilityRole="button"
          accessibilityLabel={revealed ? tr('common.hidePassword') : tr('common.showPassword')}
          accessibilityState={{ selected: revealed }}
        >
          <Icon name="eye" size={t.sizes.textField.icon} color={revealed ? 'Primary/Red' : 'Neutral/Ink'} />
        </Pressable>
      ) : null}
      {trailing === 'calendar' ? <Icon name="calendar" size={t.sizes.textField.icon} /> : null}
      {trailing === 'chevron' ? <Icon name="chevronDown" size={t.sizes.textField.icon} /> : null}
    </View>
  );

  return (
    <View style={{ gap: t.spacing['spacing/8'], alignSelf: 'stretch' }}>
      {onPress && !locked ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={value ? `${label}, ${value}` : label}
          accessibilityHint={error ?? helper}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          testID={testID}
        >
          {box}
        </Pressable>
      ) : (
        <View accessibilityState={{ disabled: !!locked }} accessibilityLabel={locked ? `${label}, ${value}, ${tr('common.locked')}` : undefined} accessible={!!locked}>
          {box}
        </View>
      )}
      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
          <Icon name="alert" size={t.sizes.textField.helperIcon} color="Status/Failure/Default" />
          <AppText variant="Caption" color="Status/Failure/Default" style={styles.flex}>{error}</AppText>
        </View>
      ) : helper ? (
        <AppText variant="Caption" color="Neutral/Slate">{helper}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // Reset native/web input chrome; the field box draws all states.
  input: { padding: 0, margin: 0, outlineStyle: 'none' } as object,
});
