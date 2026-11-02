/**
 * Demo account used until the API exists. The verification code is the one drawn in Figma's Keypad
 * "From Messages" suggestion (281:7943), so the preview's autofill tap succeeds; any other code is wrong (7.2d).
 */
export const demoAccount = {
  phone: '7700 900123',
  email: 'james.carter@email.com',
  code: '482916',
  codeAttempts: 3,
  resendSeconds: 59,
} as const;
