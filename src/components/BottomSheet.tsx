/**
 * Bottom sheet container — as drawn in "Onboarding — Choose language" (217:16719 / AR 217:16909):
 * Scrim Alpha/Ink 50% over the screen; sheet Neutral/White, top corners radius/xl,
 * padding spacing/16 top · spacing/24 sides · spacing/40 bottom, children gap spacing/16, starting with a Sheet Grabber.
 * Tapping the scrim dismisses. Built on RN Modal (no extra native module needed for Expo Go).
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SheetGrabber } from './SheetParts';
import { useTheme } from '../theme';

export function BottomSheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slide.setValue(0);
      Animated.timing(slide, { toValue: 1, duration: t.states.motion.sheet, useNativeDriver: true }).start();
    }
  }, [visible, slide, t.states.motion.sheet]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.fill, { direction: t.isRTL ? 'rtl' : 'ltr' }]}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: t.colors['Alpha/Ink 50%'] }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={tr('common.close')}
        />
        <Animated.View
          accessibilityViewIsModal
          style={{
            backgroundColor: t.colors['Neutral/White'],
            borderTopLeftRadius: t.radius['radius/xl'],
            borderTopRightRadius: t.radius['radius/xl'],
            paddingTop: t.spacing['spacing/16'],
            paddingHorizontal: t.layout.screenGutter,
            paddingBottom: Math.max(t.spacing['spacing/40'], insets.bottom),
            gap: t.spacing['spacing/16'],
            transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [t.layout.frame.height / 2, 0] }) }],
          }}
        >
          <SheetGrabber />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1, justifyContent: 'flex-end' } });
