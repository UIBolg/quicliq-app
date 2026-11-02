/**
 * 6-digit code input — the "Code" row of the code-entry screens (2.4, 7.2a/b/d, 7.9/7.9b, 7.10; e.g. 220:6752):
 * 6 OTP Digits, gap spacing/8, a 12×2 Neutral/Silver separator after the third digit, centred.
 * Always LTR (digits are never mirrored). One hidden TextInput drives all boxes so the OS can autofill the SMS code
 * (iOS textContentType="oneTimeCode", Android autoComplete="sms-otp") and the native number pad is used —
 * the Figma Keypad (281:8115) is a design mock only.
 * Calls onComplete when all digits are entered (auto-submit). `status` paints every box error or success.
 */
import { useRef, useState, type ElementRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { OtpDigit, type OtpDigitState } from './OtpDigit';
import { useTheme } from '../theme';

export type CodeInputProps = {
  value: string;
  onChangeText: (v: string) => void;
  onComplete?: (code: string) => void;
  length?: number;
  status?: 'error' | 'success';
  autoFocus?: boolean;
  editable?: boolean;
  /** Draw the focused box even without keyboard focus (device-frame preview with the Keypad mock). */
  forceFocus?: boolean;
  testID?: string;
};

export function CodeInput({ value, onChangeText, onComplete, length = 6, status, autoFocus = true, editable = true, forceFocus = false, testID }: CodeInputProps) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const input = useRef<ElementRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);
  const half = Math.ceil(length / 2);

  const change = (raw: string) => {
    const next = raw.replace(/[^0-9]/g, '').slice(0, length);
    onChangeText(next);
    if (next.length === length && next !== value) onComplete?.(next);
  };

  const stateAt = (i: number): OtpDigitState => {
    if (status) return status;
    if ((focused || forceFocus) && editable && i === Math.min(value.length, length - 1) && value.length < length) return 'focused';
    return value[i] ? 'filled' : 'empty';
  };

  const boxes = Array.from({ length }, (_, i) => <OtpDigit key={i} state={stateAt(i)} value={value[i]} />);

  return (
    <Pressable
      onPress={() => input.current?.focus()}
      accessible={false}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: t.spacing['spacing/8'], direction: 'ltr' }}
    >
      {boxes.slice(0, half)}
      <View
        style={{
          width: t.sizes.codeSeparator.width,
          height: t.sizes.codeSeparator.height,
          borderRadius: t.radius['radius/full'],
          backgroundColor: t.colors['Neutral/Silver'],
        }}
      />
      {boxes.slice(half)}
      <TextInput
        ref={input}
        testID={testID}
        value={value}
        onChangeText={change}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        editable={editable}
        maxLength={length}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        accessibilityLabel={tr('components.codeInput.label', { count: length })}
        accessibilityHint={value ? tr('components.codeInput.entered', { digits: value.split('').join(' ') }) : undefined}
        // Covers the whole row so taps/long-press (paste) land on the real input; visually hidden.
        style={[StyleSheet.absoluteFill, styles.hidden]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({ hidden: { opacity: 0, color: 'transparent' } });
