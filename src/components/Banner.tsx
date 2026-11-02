/**
 * Banner — Figma 157:626. Inline message box: padding spacing/16, gap spacing/8, radius/md; 20 icon centred in the
 * first line of Body text at the start. Text and icon share the type colour.
 *  Info     — Neutral/Fog,           Ink,                    info
 *  Success  — Status/Success/Light,  Status/Success/Dark,    check
 *  Error    — Status/Failure/Light,  Status/Failure/Dark,    alert
 *  Security — Status/Failure/Light,  Status/Failure/Dark,    lock   (7.4 overrides the icon with clock)
 *  Offline  — Neutral/Ink,           Neutral/White,          wifiOff
 */
import { View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useTheme, type ColorToken } from '../theme';

export type BannerType = 'info' | 'success' | 'error' | 'security' | 'offline';

const look: Record<BannerType, { bg: ColorToken; fg: ColorToken; icon: IconName }> = {
  info: { bg: 'Neutral/Fog', fg: 'Neutral/Ink', icon: 'info' },
  success: { bg: 'Status/Success/Light', fg: 'Status/Success/Dark', icon: 'check' },
  error: { bg: 'Status/Failure/Light', fg: 'Status/Failure/Dark', icon: 'alert' },
  security: { bg: 'Status/Failure/Light', fg: 'Status/Failure/Dark', icon: 'lock' },
  offline: { bg: 'Neutral/Ink', fg: 'Neutral/White', icon: 'wifiOff' },
};

export function Banner({ type, text, icon, testID }: { type: BannerType; text: string; icon?: IconName; testID?: string }) {
  const t = useTheme();
  const c = look[type];
  const urgent = type === 'error' || type === 'security' || type === 'offline';
  return (
    <View
      testID={testID}
      accessibilityRole={urgent ? 'alert' : 'text'}
      accessibilityLiveRegion={urgent ? 'assertive' : 'polite'}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: t.spacing['spacing/8'],
        padding: t.spacing['spacing/16'],
        borderRadius: t.radius['radius/md'],
        backgroundColor: t.colors[c.bg],
      }}
    >
      <View style={{ height: t.text('Body').lineHeight, justifyContent: 'center' }}>
        <Icon name={icon ?? c.icon} size={t.sizes.banner.icon} color={c.fg} />
      </View>
      <AppText variant="Body" color={c.fg} style={{ flex: 1 }}>{text}</AppText>
    </View>
  );
}
