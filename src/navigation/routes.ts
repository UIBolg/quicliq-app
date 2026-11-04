/**
 * Route names = Figma screen IDs (build doc rule). Screens without a number in Figma use their frame name.
 *  Splash      — "Splash — Loading" 82:11650 / AR 82:11716
 *  Onboarding  — "Onboarding 1–4 — Illustrated" + "Choose language" sheet (202:6388 / AR 202:6715)
 *  7.0         — welcome back, returning customer (139:3333 / AR 139:3887); 7.0a–7.0i are states
 *  7.1         — "7.1 Login" 82:9641 (mobile) and "7.1b Login — email" 138:3251 (same screen, method param)
 *  7.2a / 7.2b — verify login, code by text (220:6506) / by email (220:6600); wrong code 7.2d (220:6739) is a state
 *  7.2c        — try another way (220:6694)
 *  7.5 / 7.6   — offline (82:9735) / ID expired (82:9762); 7.3 and 7.4 are states of 7.1
 *  7.7–7.11    — new device (New Designs "Login — English (LTR)" 57:28130): 7.7 new device · 7.7c contact support ·
 *                7.8 details (7.8b mismatch is a state) · 7.8c locked · 7.8d code method · 7.9 / 7.9b code (7.10 wrong code
 *                is a state) · 7.11 device verified
 *  Home        — proposal (no Figma frame yet), see src/screens/home/HomeScreen.tsx
 *  11.1        — Activity (History tab): transfer cards grouped by month
 *  12.1–12.8   — Account (Profile tab) and its inner pages, from "Quicliq API Gap Analysis" pp.45–52 (no Figma frames):
 *                12.2 personal details · 12.3 change password · 12.4 saved cards · 12.5 security · 12.6 language ·
 *                12.7 legal (12.7a document) · 12.8 log out is a sheet on 12.1
 *  13.1 / 13.2 — help / notifications (doc pp.53–54)
 *  9.1 / 9.2   — system: update required / maintenance (158:4856 / AR 158:4860)
 *  NotBuilt    — temporary target for links into flows that are not built yet (shows the Figma ID)
 *  dev/*       — read-only design-system previews, registered in development builds only
 */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  /** 7.0 Welcome back (returning customer); biometric the user enabled at sign-up (7.0i = both). */
  '7.0': { biometric?: 'faceId' | 'fingerprint' | 'both' } | undefined;
  /** previewState: open directly in the 7.3 / 7.4 state (device-frame preview menu only). */
  '7.1': { method?: 'mobile' | 'email'; previewState?: 'incorrect' | 'locked' } | undefined;
  '7.2a': { phone?: string; email?: string; previewState?: 'wrongCode' } | undefined;
  '7.2b': { phone?: string; email?: string; previewState?: 'wrongCode' } | undefined;
  '7.2c': { phone: string; email: string; method: 'sms' | 'email' };
  '7.7': undefined;
  '7.7c': undefined;
  '7.8': undefined;
  '7.8c': undefined;
  '7.8d': { phone?: string; email?: string; method?: 'sms' | 'email' } | undefined;
  '7.9': { phone?: string; email?: string; previewState?: 'wrongCode' } | undefined;
  '7.9b': { phone?: string; email?: string; previewState?: 'wrongCode' } | undefined;
  '7.11': undefined;
  '7.5': undefined;
  '7.6': undefined;
  /** level: sending-limit level to show (preview menu); defaults to the demo account's level. */
  Home: { level?: 1 | 2 | 3 } | undefined;
  '11.1': undefined;
  '12.1': undefined;
  '12.2': undefined;
  '12.3': undefined;
  '12.4': undefined;
  '12.5': undefined;
  '12.6': undefined;
  '12.7': undefined;
  '12.7a': { doc: 'privacy' | 'fraud' | 'terms' };
  '13.1': undefined;
  '13.2': undefined;
  '9.1': undefined;
  '9.2': undefined;
  NotBuilt: { screenId: string };
  'dev/Gallery': undefined;
  'dev/Tokens': undefined;
};
