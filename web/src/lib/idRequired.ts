/** "Verify ID and address before sending" state: set when sign-up continued with a mobile number that isn't in the
 *  user's name (no sending limit until ID + address are verified). Kept for the browser session; `?locked=1` forces it. */
const KEY = 'quicliq.idRequired';
export function setIdRequired(on: boolean) {
  try { if (on) sessionStorage.setItem(KEY, '1'); else sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
}
export function isIdRequired(search: URLSearchParams): boolean {
  if (search.get('locked') === '1') return true;
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}
