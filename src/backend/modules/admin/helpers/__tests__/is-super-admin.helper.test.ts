import { describe, it, expect } from 'vitest'
import { isSuperAdmin } from '@/backend/modules/admin/helpers/is-super-admin.helper'

describe('isSuperAdmin', () => {
    it('returns true only for the configured admin email', () => {
        expect(isSuperAdmin('andremcga3@gmail.com')).toBe(true)
    })

    it('returns false for any other email', () => {
        expect(isSuperAdmin('user@example.com')).toBe(false)
        expect(isSuperAdmin('ANDREMCGA3@GMAIL.COM')).toBe(false)
    })

    it('returns false when the email is missing', () => {
        // oxlint-disable-next-line unicorn/no-useless-undefined
        expect(isSuperAdmin(undefined)).toBe(false)
        expect(isSuperAdmin('')).toBe(false)
    })
})
