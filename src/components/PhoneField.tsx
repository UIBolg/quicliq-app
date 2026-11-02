/**
 * Mobile number row (Figma "Phone" frame, e.g. 71:1158 / AR 71:2025): Country Prefix + Text Field, gap spacing/8.
 * Figma keeps this row LTR in Arabic (+44 stays on the left of the number), so the row is never mirrored;
 * the field's own label/helper still follow the locale.
 */
import { View } from 'react-native';
import { CountryPrefix } from './CountryPrefix';
import { TextField, type TextFieldProps } from './TextField';
import { useTheme } from '../theme';

export function PhoneField(props: Omit<TextFieldProps, 'trailing'>) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: t.spacing['spacing/8'], direction: 'ltr' }}>
      <CountryPrefix />
      <View style={{ flex: 1, direction: t.isRTL ? 'rtl' : 'ltr' }}>
        <TextField keyboardType="phone-pad" textContentType="telephoneNumber" autoComplete="tel" {...props} />
      </View>
    </View>
  );
}
