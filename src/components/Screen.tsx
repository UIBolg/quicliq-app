/**
 * Screen root: background colour, safe areas and layout direction from the locale.
 * The app flips layout with the `direction` style (no app reload), so every screen starts here.
 */
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme, type ColorToken } from '../theme';

export function Screen({
  children, background = 'Neutral/White', edges = ['top', 'bottom'], statusBar = 'dark',
}: { children: ReactNode; background?: ColorToken; edges?: Edge[]; statusBar?: 'dark' | 'light' }) {
  const t = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.fill, { backgroundColor: t.colors[background], direction: t.isRTL ? 'rtl' : 'ltr' }]}>
      <StatusBar style={statusBar} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
