/**
 * Lottie animations supplied by the product owner (assets/lottie, 160×160 @ 60fps, 2.5 s; splash 390×844).
 * Static require map so Metro bundles them. Names match the Figma illustration names.
 */
export const lottieSources = {
  cameraOff: require('../../assets/lottie/cameraOff.json'),
  error: require('../../assets/lottie/error.json'),
  faceId: require('../../assets/lottie/faceId.json'),
  fingerprint: require('../../assets/lottie/fingerprint.json'),
  idCard: require('../../assets/lottie/idCard.json'),
  locked: require('../../assets/lottie/locked.json'),
  maintenance: require('../../assets/lottie/maintenance.json'),
  message: require('../../assets/lottie/message.json'),
  newDevice: require('../../assets/lottie/newDevice.json'),
  offline: require('../../assets/lottie/offline.json'),
  success: require('../../assets/lottie/success.json'),
  update: require('../../assets/lottie/update.json'),
} as const;

export const splashLottie = require('../../assets/lottie/splash.json');
