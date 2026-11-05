/** Logo, onboarding scenes and Lottie illustrations shared with the Expo app. */
import LottieImport from 'lottie-react';
import { logoXml } from '@shared/assets/logo.generated';
import { onboardingXml } from '@shared/assets/onboarding.generated';
import { cn } from '@/lib/utils';
import splash from '@assets/lottie/splash.json';
import success from '@assets/lottie/success.json';
import offline from '@assets/lottie/offline.json';
import locked from '@assets/lottie/locked.json';
import idCard from '@assets/lottie/idCard.json';
import newDevice from '@assets/lottie/newDevice.json';
import faceId from '@assets/lottie/faceId.json';
import fingerprint from '@assets/lottie/fingerprint.json';
import maintenance from '@assets/lottie/maintenance.json';
import update from '@assets/lottie/update.json';
import cameraOff from '@assets/lottie/cameraOff.json';
import error from '@assets/lottie/error.json';
import message from '@assets/lottie/message.json';

// lottie-react ships CJS: the default export can arrive wrapped once more.
const Lottie = ((LottieImport as unknown as { default?: typeof LottieImport }).default ?? LottieImport) as typeof LottieImport;

const svg = (xml: string) => ({ __html: xml });

export function Logo({ height = 32, white, className }: { height?: number; white?: boolean; className?: string }) {
  return <span role="img" aria-label="Quicliq" className={cn('inline-block [&>svg]:h-full [&>svg]:w-auto', className)} style={{ height }} dangerouslySetInnerHTML={svg(logoXml[white ? 'white' : 'brand'])} />;
}

export function Scene({ name, className }: { name: keyof typeof onboardingXml | string; className?: string }) {
  return <div aria-hidden className={cn('[&>svg]:h-full [&>svg]:w-full', className)} dangerouslySetInnerHTML={svg(onboardingXml[name] ?? '')} />;
}

const lotties = { splash, success, offline, locked, idCard, newDevice, faceId, fingerprint, maintenance, update, cameraOff, error, message } as const;
export type IllustrationName = keyof typeof lotties;
export function Illustration({ name, size = 160, loop = true }: { name: keyof typeof lotties; size?: number; loop?: boolean }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return <Lottie animationData={lotties[name]} loop={loop && !reduce} autoplay={!reduce} style={{ width: size, height: size }} aria-hidden />;
}
