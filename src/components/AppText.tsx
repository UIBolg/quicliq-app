import { Text, type TextProps } from 'react-native';
import { useTheme, type ColorToken, type TextStyleName } from '../theme';

export type AppTextProps = TextProps & {
  /** Figma text style name; the EN or AR variant is picked from the locale. */
  variant?: TextStyleName;
  color?: ColorToken;
};

/** Text that always uses a Figma text style + colour token. */
export function AppText({ variant = 'Body', color = 'Neutral/Ink', style, ...rest }: AppTextProps) {
  const t = useTheme();
  return <Text {...rest} style={[t.text(variant), { color: t.colors[color] }, style]} />;
}
