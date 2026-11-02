/**
 * Keypad — Figma 281:8115 (iOS number pad, Autofill=On shows the "From Messages" suggestion).
 * The real app uses the phone's own number pad (CodeInput). This mock is only drawn in the web device-frame
 * preview, where there is no phone keyboard, so the code screens can be reviewed as drawn and still be used.
 * System/Keyboard background, pt/px spacing/8, pb spacing/32, gap spacing/8; keys Neutral/White, 46 high, radius/sm,
 * digit EN/H3 + letters EN/Overline. Always LTR.
 */
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useTheme, getTextStyle } from '../theme';

const KEYS: [string, string][][] = [
  [['1', ''], ['2', 'ABC'], ['3', 'DEF']],
  [['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO']],
  [['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']],
];

export type KeypadProps = {
  onDigit: (d: string) => void;
  onDelete: () => void;
  /** Autofill suggestion (e.g. the SMS code); tapping it fills the whole code. */
  suggestion?: string;
  onSuggestion?: (code: string) => void;
};

export function Keypad({ onDigit, onDelete, suggestion, onSuggestion }: KeypadProps) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const h = t.sizes.keypad.keyHeight;
  const key = (label: string, letters: string) => (
    <Pressable
      key={label}
      onPress={() => onDigit(label)}
      accessibilityRole="keyboardkey"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flex: 1,
        height: h,
        borderRadius: t.radius['radius/sm'],
        backgroundColor: t.colors[pressed ? 'Neutral/Silver' : 'Neutral/White'],
        alignItems: 'center',
        justifyContent: 'center',
        ...t.elevation.keypadKey,
      })}
    >
      <AppText variant="H3" style={[getTextStyle('H3', 'en'), { textAlign: 'center' }]}>{label}</AppText>
      {letters ? <AppText variant="Overline" style={[getTextStyle('Overline', 'en'), { textAlign: 'center' }]}>{letters}</AppText> : null}
    </Pressable>
  );
  const row = { flexDirection: 'row', gap: t.spacing['spacing/8'] } as const;
  return (
    <View
      style={{
        backgroundColor: t.colors['System/Keyboard'],
        paddingTop: t.spacing['spacing/8'],
        paddingHorizontal: t.spacing['spacing/8'],
        paddingBottom: t.spacing['spacing/32'],
        gap: t.spacing['spacing/8'],
        direction: 'ltr',
      }}
    >
      {suggestion ? (
        <Pressable
          onPress={() => onSuggestion?.(suggestion)}
          accessibilityRole="button"
          accessibilityLabel={`${tr('components.keypad.fromMessages')} ${suggestion}`}
          style={{ alignItems: 'center', paddingVertical: t.spacing['spacing/8'] }}
        >
          <AppText variant="Caption" color="Neutral/Slate" style={{ textAlign: 'center' }}>{tr('components.keypad.fromMessages')}</AppText>
          <AppText variant="Title" style={[getTextStyle('Title', 'en'), { textAlign: 'center' }]}>
            {`${suggestion.slice(0, 3)} ${suggestion.slice(3)}`}
          </AppText>
        </Pressable>
      ) : null}
      {KEYS.map((r, i) => (
        <View key={i} style={row}>{r.map(([d, l]) => key(d, l))}</View>
      ))}
      <View style={row}>
        <View style={{ flex: 1, height: h }} />
        {key('0', '')}
        <Pressable
          onPress={onDelete}
          accessibilityRole="keyboardkey"
          accessibilityLabel={tr('components.keypad.delete')}
          style={({ pressed }) => ({
            flex: 1, height: h, borderRadius: t.radius['radius/sm'], alignItems: 'center', justifyContent: 'center',
            backgroundColor: pressed ? t.colors['Neutral/Silver'] : undefined,
          })}
        >
          <Icon name="backspace" mirror={false} />
        </Pressable>
      </View>
    </View>
  );
}
