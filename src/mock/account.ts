/**
 * Demo account used until the API exists. The verification code 123456 is right for both text (7.2a) and email (7.2b);
 * any other code is wrong (7.2d). The preview keypad's "From Messages" suggestion shows the same code
 * (Figma draws 482 916 there).
 */
export const demoAccount = {
  firstName: 'James',
  fullName: 'James Carter',
  initials: 'JC',
  /** Sample GBP → JOD rate for the Home proposal. */
  rate: { jod: '0.8932' },
  /** Send-money calculator (unverified Home): GBP → JOD, no fee. */
  quote: { rate: 0.8932, fee: '0.00', defaultAmount: '500.00' },
  /** Unverified Home: ID & address steps done (of 2). */
  setupStepsDone: 0,
  setupStepsTotal: 2,
  phone: '7700 900123',
  email: 'james.carter@email.com',
  /** Any other password is wrong (7.3); 5 wrong tries pause login for 15 minutes (7.4). */
  password: 'Quicliq1!',
  loginAttempts: 5,
  lockSeconds: 15 * 60,
  code: '123456',
  codeAttempts: 3,
  resendSeconds: 59,
} as const;

/** Sample recent transfers for the Home proposal (names live in the i18n files under home.names). */
export const demoTransfers = [
  { id: 't1', amount: '250.00', date: '28 Oct', method: 'bank', status: 'delivered' },
  { id: 't2', amount: '120.00', date: '14 Oct', method: 'cash', status: 'delivered' },
  { id: 't3', amount: '75.50', date: '02 Oct', method: 'bank', status: 'processing' },
] as const;
