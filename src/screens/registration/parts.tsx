/**
 * Shared pieces of the Registration result sheets (1.5–1.7, 2.3b, 2.3d): centred Illustration 144 + Heading
 * (H3 + Body Slate, centred) and the "Things to check" list (Body Medium heading, List Items with a 32 red-tint
 * check badge, gap spacing/8). Plus the checking note (lock icon + Caption Slate) shown above the footer button.
 */
import { View } from 'react-native';
import { AppText, Icon, IconBadge, Illustration, type IllustrationName } from '../../components';
import { useTheme } from '../../theme';

export function SheetHeading({ illustration, title, body }: { illustration?: IllustrationName; title: string; body: string }) {
  const t = useTheme();
  const center = { textAlign: 'center' } as const;
  return (
    <View style={{ alignItems: 'center', gap: t.spacing['spacing/12'] }}>
      {illustration ? <Illustration name={illustration} size={t.sizes.illustration.small} /> : null}
      <View style={{ alignSelf: 'stretch', gap: t.spacing['spacing/8'] }}>
        <AppText variant="H3" accessibilityRole="header" style={center}>{title}</AppText>
        <AppText variant="Body" color="Neutral/Slate" style={center}>{body}</AppText>
      </View>
    </View>
  );
}

export function ThingsToCheck({ title, items }: { title: string; items: string[] }) {
  const t = useTheme();
  return (
    <View style={{ gap: t.spacing['spacing/8'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors['Neutral/Fog'] }}>
      <AppText variant="Body Medium">{title}</AppText>
      {items.map((it) => (
        <View key={it} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
          <IconBadge icon="check" size={32} tone="white" />
          <AppText variant="Body" style={{ flex: 1 }}>{it}</AppText>
        </View>
      ))}
    </View>
  );
}

export function FooterNote({ text }: { text: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
      <Icon name="lock" size={t.sizes.icon.sm} color="Neutral/Slate" />
      <AppText variant="Caption" color="Neutral/Slate" style={{ flex: 1 }}>{text}</AppText>
    </View>
  );
}

/** Western-digit date for the summary row, e.g. "14 March 1990" / "14 مارس 1990". */
export function longDate(locale: string, d: number, m: number, y: number) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function monthNames(locale: string) {
  const f = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { month: 'long', timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(Date.UTC(2000, i, 1))));
}

export const NAME_RE = /^[\p{L}][\p{L}\s'’-]*$/u;
