/**
 * Masking for numbers and emails shown outside the field the user typed into (build doc, Login).
 * Phone: "+44 •••• ••0123" (last 4 digits). Email: "j•••••@email.com" (first letter + domain).
 * Output is wrapped in LTR isolates so it is never reordered inside Arabic text.
 */
const LRI = '⁦';
const PDI = '⁩';

export function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const last4 = digits.slice(-4).padStart(4, '•');
  return `${LRI}+44 •••• ••${last4}${PDI}`;
}

export function maskEmail(raw: string): string {
  const [name, domain] = raw.split('@');
  if (!name || !domain) return `${LRI}${raw}${PDI}`;
  return `${LRI}${name[0]}•••••@${domain}${PDI}`;
}
