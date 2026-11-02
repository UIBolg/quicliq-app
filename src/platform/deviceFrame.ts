/**
 * True when the web build runs inside the Figma-style device-frame preview (the review artifact sets
 * window.__QUICLIQ_DEVICE_FRAME__ before loading the bundle). Never true on iOS/Android or on the GitHub Pages site.
 */
import { Platform } from 'react-native';

export const inDeviceFrame: boolean =
  Platform.OS === 'web' && typeof window !== 'undefined' && Boolean((window as unknown as { __QUICLIQ_DEVICE_FRAME__?: boolean }).__QUICLIQ_DEVICE_FRAME__);
