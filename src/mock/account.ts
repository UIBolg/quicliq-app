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
  /** Demo login (7.1): mobile 123456789 or this email, with password 123456. Any other pair is wrong (7.3);
   *  5 wrong tries pause login for 15 minutes (7.4). Log in with both fields empty goes straight to Home (demo shortcut).
   *  Demo values only — never real credentials. */
  phone: '123456789',
  email: 'james.carter@email.com',
  password: '123456',
  loginAttempts: 5,
  lockSeconds: 15 * 60,
  code: '123456',
  codeAttempts: 3,
  resendSeconds: 59,
} as const;

/** Sample recent transfers for the Home proposal (names live in the i18n files under home.names). */
export const demoTransfers = [
  { id: 't1', recipient: 'r1', amount: '250.00', date: '28 Oct', method: 'bank', status: 'delivered' },
  { id: 't2', recipient: 'r2', amount: '120.00', date: '14 Oct', method: 'cash', status: 'delivered' },
  { id: 't3', recipient: 'r3', amount: '75.50', date: '02 Oct', method: 'bank', status: 'processing' },
] as const;

/** Demo credential check for 7.1 (mobile compared on digits only, email case-insensitive). */
export function isDemoLogin(method: 'mobile' | 'email', id: string, password: string): boolean {
  const idOk = method === 'mobile'
    ? id.replace(/\D/g, '') === demoAccount.phone
    : id.trim().toLowerCase() === demoAccount.email;
  return idOk && password === demoAccount.password;
}

/** Sending limit for the verified Home: lifetime limit and how much has been sent so far (GBP). */
/**
 * Sending-limit levels (product rules):
 *  1 account        — account created and mobile, name and birth date match the same person → £800 lifetime.
 *  2 idAddress      — ID and address verified → £12,000.
 *  3 sourceOfFunds  — proof of source of funds uploaded → over £12,000 (no fixed figure).
 * `route` is where "Raise my limit" / the banner goes to reach that level (NotBuilt screen IDs until built).
 */
export type LimitLevel = 1 | 2 | 3;
export type LimitLevelDef = { key: 'account' | 'idAddress' | 'sourceOfFunds'; icon: 'user' | 'idCard' | 'file'; total: number | null; route: string | null };
export const limitLevels: readonly LimitLevelDef[] = [
  { key: 'account', icon: 'user', total: 800, route: null },
  { key: 'idAddress', icon: 'idCard', total: 12000, route: '4.1' },
  { key: 'sourceOfFunds', icon: 'file', total: null, route: 'Source of funds' },
];

/** The level that comes after `level` (what the banner and "Raise my limit" point to); undefined at level 3. */
export const nextLevel = (level: LimitLevel): LimitLevelDef | undefined => limitLevels[level];

/** Demo user: level 1 (preview menu can open Home at level 2 or 3), £100 sent so far. */
export const demoLimit = { level: 1 as LimitLevel, sent: 100 };

/** Lifetime limit at a level; level 3 has no fixed cap, so it reports the level-2 figure it goes beyond. */
export const limitTotal = (level: LimitLevel): number => limitLevels[level - 1].total ?? limitLevels[1].total ?? 0;

/** Last 5 recipients, most recent first; `tone` = avatar colour, shared by Recent recipients and Recent transfers (names live in the i18n files under home.recipientNames). */
export const demoRecipients = [
  { id: 'r1', initials: 'LH', tone: 'brand' },
  { id: 'r2', initials: 'OK', tone: 'success' },
  { id: 'r3', initials: 'RS', tone: 'ink' },
  { id: 'r4', initials: 'YN', tone: 'tint' },
  { id: 'r5', initials: 'HA', tone: 'success' },
] as const;

/** Personal details (12.2) — name and date of birth come from the ID check and are locked. */
export const demoProfile = { dob: '12 March 1990', mobile: '7700 900123', address: '10 High Street, London' };

/** Saved cards (12.4). */
export const demoCards = [
  { id: 'c1', brand: 'Visa', last4: '4242', expires: '08/28' },
  { id: 'c2', brand: 'Mastercard', last4: '4444', expires: '11/27' },
];

/** Active device (12.5) — only one device can be active. */
export const demoDevice = { name: 'iPhone 15' };

/** Help contacts (13.1). PLACEHOLDERS — replace with Quicliq's real support phone, email and help page. */
export const supportContacts = { phone: '+440000000000', phoneDisplay: '+44 00 0000 0000', email: 'support@example.com', articlesUrl: 'https://example.com/help' };

/** Notifications (13.2); `opens` = the screen the row leads to. */
export const demoNotifications = [
  { id: 'n1', kind: 'sent', amount: 100, name: 'Sarah Ahmed', time: '09:41', when: 'today', opens: '11.3' },
  { id: 'n2', kind: 'idDone', when: 'yesterday', opens: '4.1' },
] as const;
