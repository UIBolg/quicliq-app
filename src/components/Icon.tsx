/**
 * Figma icon (page "Icons & Illustrations" 79:2) rendered from the exported SVG.
 * Directional icons are mirrored in RTL. If the SVG has not been exported yet
 * (see assets/icons/README.md), a neutral placeholder of the same size is shown.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { iconXml } from '../assets/icons.generated';
import { useTheme, type ColorToken } from '../theme';

export const iconNames = [
  'arrowLeft', 'arrowRight', 'arrowUp', 'arrowUpRight', 'check', 'chevronRight', 'chevronLeft', 'chevronDown', 'x', 'swap',
  'bank', 'cash', 'shield', 'send', 'download', 'wrench', 'lock', 'scan', 'edit', 'hand',
  'sun', 'idCard', 'alert', 'alertTriangle', 'focus', 'cameraOff', 'info', 'home', 'file', 'camera',
  'image', 'refresh', 'trash', 'clock', 'wifiOff', 'smartphone', 'phoneCall', 'user', 'users', 'message',
  'faceId', 'fingerprint', 'bell', 'help', 'anchor', 'search', 'briefcase', 'tag', 'activity', 'gift', 'grid',
  'card', 'zap', 'pin', 'plus', 'wallet', 'bookmark', 'type', 'calendar', 'backspace', 'trendingUp', 'globe',
  'eye', 'mail', 'laptop', 'history', 'link', 'droplet',
] as const;
export type IconName = (typeof iconNames)[number];

/** Icons that point in a reading direction and must flip in RTL. */
const DIRECTIONAL: ReadonlySet<IconName> = new Set([
  'arrowLeft', 'arrowRight', 'arrowUpRight', 'chevronLeft', 'chevronRight', 'send', 'backspace', 'trendingUp',
]);

export type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorToken;
  /** Override automatic RTL mirroring. */
  mirror?: boolean;
};

export function Icon({ name, size, color = 'Neutral/Ink', mirror }: IconProps) {
  const t = useTheme();
  const dim = size ?? t.sizes.icon.default;
  const flip = mirror ?? (t.isRTL && DIRECTIONAL.has(name));
  const xml = iconXml[name];
  const transform = flip ? [{ scaleX: -1 }] : undefined;
  if (!xml) {
    return (
      <View
        accessible={false}
        style={{
          width: dim,
          height: dim,
          borderRadius: t.radius['radius/full'],
          borderWidth: t.stroke['stroke/xs'],
          borderStyle: 'dashed',
          borderColor: t.colors[color],
          transform,
        }}
      />
    );
  }
  return (
    <View style={{ transform }} accessible={false}>
      <SvgXml xml={xml} width={dim} height={dim} color={t.colors[color]} />
    </View>
  );
}
