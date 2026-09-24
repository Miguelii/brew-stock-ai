import { describe, it, expect } from 'vitest'
import type { User } from '@supabase/supabase-js'
import { isNewUser } from '@/_bff/modules/auth/helpers/is-new-user.helper'

const CREATED_AT = '2026-09-23T10:00:00.000Z'

const user = (createdAt: string | null, lastSignInAt: string | null) =>
    ({ id: 'user-1', created_at: createdAt, last_sign_in_at: lastSignInAt }) as unknown as User

/** `CREATED_AT` shifted by `ms`, to sit either side of the tolerance window. */
const afterCreation = (ms: number) => new Date(Date.parse(CREATED_AT) + ms).toISOString()

describe('isNewUser', () => {
    it('treats a sign-in that created the account as new', () => {
        expect(isNewUser(user(CREATED_AT, CREATED_AT))).toBe(true)
        expect(isNewUser(user(CREATED_AT, afterCreation(1_000)))).toBe(true)
    })

    it('treats a later sign-in as returning', () => {
        expect(isNewUser(user(CREATED_AT, '2026-09-30T10:00:00.000Z'))).toBe(false)
        expect(isNewUser(user('2026-04-23T10:00:00.000Z', CREATED_AT))).toBe(false)
    })

    it('draws the line at the tolerance window', () => {
        expect(isNewUser(user(CREATED_AT, afterCreation(9_999)))).toBe(true)
        expect(isNewUser(user(CREATED_AT, afterCreation(10_000)))).toBe(false)
    })

    it('ignores the direction of the gap, so clock skew does not flip the answer', () => {
        expect(isNewUser(user(CREATED_AT, afterCreation(-1_000)))).toBe(true)
        expect(isNewUser(user(CREATED_AT, afterCreation(-20_000)))).toBe(false)
    })

    it('is not new when there is no user', () => {
        expect(isNewUser(null)).toBe(false)
        // oxlint-disable-next-line unicorn/no-useless-undefined
        expect(isNewUser(undefined)).toBe(false)
    })

    it('is not new when either timestamp is missing', () => {
        // Supabase leaves `last_sign_in_at` null for an account that has never signed in.
        expect(isNewUser(user(CREATED_AT, null))).toBe(false)
        expect(isNewUser(user(null, CREATED_AT))).toBe(false)
        expect(isNewUser(user(null, null))).toBe(false)
    })

    it('is not new when a timestamp cannot be parsed', () => {
        expect(isNewUser(user(CREATED_AT, 'not-a-date'))).toBe(false)
        expect(isNewUser(user('not-a-date', CREATED_AT))).toBe(false)
    })
})
