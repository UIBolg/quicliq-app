/**
 * Status Bar — Figma 12:58 (Tone=Dark) / 12:69 (Tone=Light). Design mock only (build doc component 22):
 * 47 high, pt spacing/8, px spacing/32, "9:41" in System/Status Bar + 68×12 indicators. Always LTR.
 * Rendered only in the device-frame preview so screens line up with the Figma frames; real devices show the OS bar.
 */
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { AppText } from './AppText';
import { statusBarXml } from '../assets/statusbar.generated';
import { useTheme, getTextStyle } from '../theme';

export function StatusBarMock({ tone }: { tone: 'dark' | 'light' }) {
  const t = useTheme();
  const s = t.sizes.statusBar;
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{
        height: s.height,
        paddingTop: t.spacing['spacing/8'],
        paddingHorizontal: t.spacing['spacing/32'],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        direction: 'ltr',
      }}
    >
      <AppText variant="System/Status Bar" color={tone === 'dark' ? 'Neutral/Ink' : 'Neutral/White'} style={getTextStyle('System/Status Bar', 'en')}>
        9:41
      </AppText>
      <SvgXml xml={statusBarXml[tone]} width={s.indicatorsWidth} height={s.indicatorsHeight} />
    </View>
  );
}
