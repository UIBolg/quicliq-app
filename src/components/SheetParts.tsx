/**
 * Bottom sheet parts.
 *  - Sheet Grabber — Figma 280:8504: 40×4 Neutral/Silver handle, centred.
 *  - Sheet Header — Figma 282:9973: title (H3, Ink) + supporting text (Body, Primary/Red as drawn in Figma —
 *    see docs/figma-issues.md #21) + 32 Fog close button with a 16 x icon; gap spacing/16, titles gap spacing/2.
 */
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useTheme } from '../theme';

export function SheetGrabber() {
  const t = useTheme();
  return (
    <View style={{ alignItems: 'center' }} accessible={false}>
      <View
        style={{
          width: t.sizes.sheetGrabber.width,
          height: t.sizes.sheetGrabber.height,
          borderRadius: t.radius['radius/full'],
          backgroundColor: t.colors['Neutral/Silver'],
        }}
      />
    </View>
  );
}

export function SheetHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const d = t.sizes.sheetHeader.close;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'] }}>
      <View style={{ flex: 1, gap: t.spacing['spacing/2'] }}>
        <AppText variant="H3" accessibilityRole="header">{title}</AppText>
        {subtitle ? <AppText variant="Body" color="Primary/Red">{subtitle}</AppText> : null}
      </View>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={tr('common.close')}
        hitSlop={(t.sizes.touchTarget - d) / 2}
        style={({ pressed }) => ({
          width: d,
          height: d,
          borderRadius: t.radius['radius/full'],
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors[pressed ? 'Neutral/Silver' : 'Neutral/Fog'],
        })}
      >
        <Icon name="x" size={t.sizes.sheetHeader.closeIcon} />
      </Pressable>
    </View>
  );
}
