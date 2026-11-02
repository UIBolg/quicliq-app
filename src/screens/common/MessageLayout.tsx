/**
 * Centred message screen used by 7.5 Offline (82:9735), 7.6 ID expired (82:9762), 7.8c, 7.11:
 * Content flex, centred, gutter spacing/24, gap spacing/24 — illustration, Heading (H2 + Body Large Slate, centred,
 * gap spacing/8). Footer pt spacing/16, gutter spacing/24, gap spacing/16, pb per frame (spacing/40 or spacing/32).
 */
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText, Screen } from '../../components';
import { useTheme, type SpacingToken } from '../../theme';

export function MessageLayout({
  illustration, title, body, footer, contentPadTop = 'spacing/0', contentPadBottom = 'spacing/0', footerPadBottom = 'spacing/40',
}: {
  illustration: ReactNode;
  title: string;
  body: string;
  footer: ReactNode;
  contentPadTop?: SpacingToken;
  contentPadBottom?: SpacingToken;
  footerPadBottom?: SpacingToken;
}) {
  const t = useTheme();
  const g = t.layout.screenGutter;
  const center = { textAlign: 'center' } as const;
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: g, paddingTop: t.spacing[contentPadTop], paddingBottom: t.spacing[contentPadBottom], gap: t.spacing['spacing/24'] }}>
        {illustration}
        <View style={{ alignSelf: 'stretch', gap: t.spacing['spacing/8'] }}>
          <AppText variant="H2" accessibilityRole="header" style={center}>{title}</AppText>
          <AppText variant="Body Large" color="Neutral/Slate" style={center}>{body}</AppText>
        </View>
      </View>
      <View style={{ paddingTop: t.spacing['spacing/16'], paddingHorizontal: g, paddingBottom: t.spacing[footerPadBottom], gap: t.spacing['spacing/16'] }}>
        {footer}
      </View>
    </Screen>
  );
}
