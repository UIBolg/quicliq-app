/**
 * Shared formatting. Amounts, rates, dates and masked values are wrapped in LTR isolates so they are never
 * reordered inside Arabic text, and always use Western digits (CLAUDE.md RTL rules).
 */
export const LRI = '⁦';
export const PDI = '⁩';

/** Keep a value left-to-right inside any paragraph direction. */
export const ltr = (s: string) => `${LRI}${s}${PDI}`;

/** "£700", "£1,250.50" — GBP by default, Western digits in both languages. Whole amounts drop the decimals. */
export function formatMoney(amount: number, currency: 'GBP' | 'JOD' = 'GBP', opts: { decimals?: 'auto' | 'always' } = {}): string {
  const whole = Number.isInteger(amount) && opts.decimals !== 'always';
  return ltr(
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: whole ? 0 : 2,
    }).format(amount),
  );
}

/** Plain number with two decimals and thousands separators: "1,250.00". */
export const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
