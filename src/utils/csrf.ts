/**
 * Client-side CSRF token utilities.
 *
 * Generates a per-session random token stored in sessionStorage and provides
 * a helper that attaches it as the X-CSRF-Token header on state-mutating
 * requests. The backend must validate this header against the value it set
 * in the session. Without such a header, a cross-site form submission carries
 * no distinguishing marker and cannot be rejected.
 */

const CSRF_TOKEN_KEY = 'csrf_token';

/**
 * Return the existing session CSRF token, creating one if absent.
 * The token is a 32-byte hex string generated via Web Crypto.
 */
export function getCsrfToken(): string {
  const existing = sessionStorage.getItem(CSRF_TOKEN_KEY);
  if (existing) return existing;

  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  const token = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  return token;
}

/**
 * Return an axios-compatible headers object that includes the CSRF token.
 * Spread this into the headers of any POST / PUT / PATCH / DELETE request.
 *
 * @example
 * axios.post(url, body, { headers: csrfHeaders() });
 */
export function csrfHeaders(): Record<string, string> {
  return { 'X-CSRF-Token': getCsrfToken() };
}
