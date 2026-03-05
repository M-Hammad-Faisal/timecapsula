// ── Delivery date computation ──────────────────────────────────────────────
// Pure function — no I/O, easy to unit-test.
// Used by: POST /api/capsules, and any future cron / admin tooling.

const YEAR_MAP = {
  '1y': 1,
  '2y': 2,
  '3y': 3,
  '5y': 5,
  '10y': 10,
  '25y': 25,
  '30y': 30,
  '50y': 50,
}

/**
 * Compute the delivery Date from a `when` shorthand and optional custom date.
 *
 * @param {string} when   - e.g. '1w', '1m', '3m', '6m', '1y', 'custom'
 * @param {string} [customDate] - ISO date string, required when when === 'custom'
 * @returns {Date|null}   - null if the input is invalid
 */
export function computeDeliveryDate(when, customDate) {
  const now = new Date()

  if (when === 'custom') {
    if (!customDate) return null
    const d = new Date(customDate)
    return isNaN(d.getTime()) ? null : d
  }

  const target = new Date(now)

  if (when === '1w') {
    target.setDate(now.getDate() + 7)
    return target
  }
  if (when === '1m') {
    target.setMonth(now.getMonth() + 1)
    return target
  }
  if (when === '3m') {
    target.setMonth(now.getMonth() + 3)
    return target
  }
  if (when === '6m') {
    target.setMonth(now.getMonth() + 6)
    return target
  }

  const years = YEAR_MAP[when]
  if (!years) return null
  target.setFullYear(now.getFullYear() + years)
  return target
}
