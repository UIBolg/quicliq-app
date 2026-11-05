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

/** Demo "today" for date filters. */
export const demoToday = '2026-11-03';

/** Sample transfers, newest first (Home shows the first 3; 11.1 Activity shows all, grouped by month). Names come from home.recipientNames. */
export const demoTransfers = [
  { id: 't8', on: '2026-11-03', recipient: 'r1', amount: '150.00', date: '03 Nov', month: '2026-11', method: 'bank', status: 'pending' },
  { id: 't3', on: '2026-11-02', recipient: 'r3', amount: '75.50', date: '02 Nov', month: '2026-11', method: 'bank', status: 'processing' },
  { id: 't9', on: '2026-11-01', recipient: 'r2', amount: '200.00', date: '01 Nov', month: '2026-11', method: 'cash', status: 'ready' },
  { id: 't1', on: '2026-10-28', recipient: 'r1', amount: '250.00', date: '28 Oct', month: '2026-10', method: 'bank', status: 'delivered' },
  { id: 't10', on: '2026-10-20', recipient: 'r4', amount: '500.00', date: '20 Oct', month: '2026-10', method: 'bank', status: 'rejected' },
  { id: 't2', on: '2026-10-14', recipient: 'r2', amount: '120.00', date: '14 Oct', month: '2026-10', method: 'cash', status: 'delivered' },
  { id: 't11', on: '2026-10-06', recipient: 'r5', amount: '90.00', date: '06 Oct', month: '2026-10', method: 'cash', status: 'cancelled' },
  { id: 't4', on: '2026-09-21', recipient: 'r4', amount: '300.00', date: '21 Sep', month: '2026-09', method: 'bank', status: 'delivered' },
  { id: 't5', on: '2026-09-09', recipient: 'r5', amount: '60.00', date: '09 Sep', month: '2026-09', method: 'cash', status: 'delivered' },
  { id: 't6', on: '2026-08-27', recipient: 'r1', amount: '180.00', date: '27 Aug', month: '2026-08', method: 'bank', status: 'delivered' },
  { id: 't12', on: '2026-08-18', recipient: 'r3', amount: '110.00', date: '18 Aug', month: '2026-08', method: 'cash', status: 'cancelled' },
  { id: 't7', on: '2026-08-11', recipient: 'r2', amount: '95.00', date: '11 Aug', month: '2026-08', method: 'cash', status: 'delivered' },
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

/** Last 5 recipients, most recent first (names live in the i18n files under home.recipientNames). */
export const demoRecipients = [
  { id: 'r1', initials: 'LH' },
  { id: 'r2', initials: 'OK' },
  { id: 'r3', initials: 'RS' },
  { id: 'r4', initials: 'YN' },
  { id: 'r5', initials: 'HA' },
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
/** Registration (2.1): the mobile number the ownership check says is registered in the user's name. Demo value. */
export const demoRegistration = { ownedMobile: '7700900123' } as const;

/** Verify ID and address (4.x): what the ID scan reads, the postcode lookup result and demo uploads. Demo values. */
export const demoIdScan = { title: 'Mr', first: 'James', middle: 'Robert', last: 'Carter', birthCountry: 'United Kingdom', birthDate: '14 Mar 1990', idType: 'Passport', idNumber: '533412891', issuer: 'United Kingdom', expiry: '22 Aug 2031' } as const;
export const demoAddress = { postcode: 'SW1A 1AA', country: 'United Kingdom', county: 'Greater London', city: 'London', line1: '10 Downing Street' } as const;
export const demoUploads = { id: { name: 'passport-photo-page.jpg', size: '2.4 MB' }, address: { name: 'british-gas-bill-oct.pdf', size: '1.2 MB' } } as const;

/** System screens (9.1 / 9.2): app versions, store link and maintenance end time from the API. Demo values. */
export const demoSystem = { version: '2.4.0', latest: '3.0.0', storeUrl: 'https://apps.apple.com', backBy: '14:00' } as const;

/** Support contacts from the build doc (7.7c). */
export const supportContacts = { phone: '+442080731090', phoneDisplay: '+44 208 073 10 90', email: 'info@levexpress.co.uk', office: 'Chiswick Park, London W4 5YA', articlesUrl: 'https://example.com/help' };

/** New-device check (7.8): details that match the demo ID (date as DDMMYYYY digits); 3 tries. Demo values only. */
export const demoIdentity = { first: 'James', middle: 'Robert', last: 'Carter', dob: '14031990', attempts: 3 } as const;

/** Notifications (13.2); `opens` = the screen the row leads to. */
export const demoNotifications = [
  { id: 'n1', kind: 'sent', amount: 100, name: 'Sarah Ahmed', time: '09:41', when: 'today', opens: '11.3' },
  { id: 'n2', kind: 'idDone', when: 'yesterday', opens: '4.1' },
] as const;
