// ── Validation utilities ───────────────────────────────────────────────────

/** Shared email regex used by API routes and client-side forms */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Returns true if the string is a structurally valid email address.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim())
}
