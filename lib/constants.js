// ── Business constants ─────────────────────────────────────────────────────
// Single source of truth. Change here → reflects everywhere.

/** Maximum capsules a guest (no account) may create per IP */
export const GUEST_LIMIT = 3

/** Maximum capsules a free authenticated user may create */
export const FREE_USER_LIMIT = 10

/** Maximum character length of a capsule message */
export const MAX_MESSAGE_LENGTH = 5000

/** Local-storage / session-storage key for the write-flow draft */
export const DRAFT_STORAGE_KEY = 'tc_draft'
