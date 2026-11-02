/**
 * Route names = Figma screen IDs (build doc rule). Screens without a number in Figma use their frame name.
 *  Splash      — "Splash — Loading" 82:11650 / AR 82:11716
 *  Onboarding  — "Onboarding 1–4 — Illustrated" + "Choose language" sheet (202:6388 / AR 202:6715)
 *  7.1         — "7.1 Login" 82:9641 (mobile) and "7.1b Login — email" 138:3251 (same screen, method param)
 *  7.2a / 7.2b — verify login, code by text (220:6506) / by email (220:6600); wrong code 7.2d (220:6739) is a state
 *  7.2c        — try another way (220:6694)
 *  NotBuilt    — temporary target for links into flows that are not built yet (shows the Figma ID)
 *  dev/*       — read-only design-system previews, registered in development builds only
 */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  '7.1': { method?: 'mobile' | 'email' } | undefined;
  '7.2a': { phone?: string; email?: string } | undefined;
  '7.2b': { phone?: string; email?: string } | undefined;
  '7.2c': { phone: string; email: string; method: 'sms' | 'email' };
  NotBuilt: { screenId: string };
  'dev/Gallery': undefined;
  'dev/Tokens': undefined;
};
