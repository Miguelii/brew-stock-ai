import type { User } from '@supabase/supabase-js'

/**
 * Supabase stamps `created_at` and `last_sign_in_at` in the same transaction when
 * a sign-in creates the account, but not at the exact same instant, so the two
 * are compared within a tolerance instead of for equality.
 */
const NEW_USER_TOLERANCE_MS = 10_000

/** Tells a first sign-in (account just created) apart from a returning sign-in. */
export const isNewUser = (user: User | null | undefined) => {
    if (!user?.created_at || !user.last_sign_in_at) return false

    const createdAt = new Date(user.created_at).getTime()
    const lastSignInAt = new Date(user.last_sign_in_at).getTime()

    if (Number.isNaN(createdAt) || Number.isNaN(lastSignInAt)) return false

    return Math.abs(lastSignInAt - createdAt) < NEW_USER_TOLERANCE_MS
}
