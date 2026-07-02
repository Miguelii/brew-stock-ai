import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { isAdmin } from '@/_bff/modules/admin/services/is-admin.service'

const { createSbServerClientMock, checkIsAdminMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    checkIsAdminMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_bff/modules/admin/repositories/admin.repository', () => ({
    checkIsAdmin: checkIsAdminMock,
}))

const SUPABASE = { rpc: vi.fn() } as unknown as SupabaseClient

describe('isAdmin', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        checkIsAdminMock.mockReset().mockReturnValue(Effect.succeed(true))
    })

    it('creates a session client and returns the is_admin() result', async () => {
        const result = await Effect.runPromise(isAdmin())

        expect(result).toBe(true)
        expect(createSbServerClientMock).toHaveBeenCalledTimes(1)
        expect(checkIsAdminMock).toHaveBeenCalledWith(SUPABASE)
    })

    it('reuses a provided client without creating a new one', async () => {
        const existing = { rpc: vi.fn() } as unknown as SupabaseClient
        checkIsAdminMock.mockReturnValue(Effect.succeed(false))

        const result = await Effect.runPromise(isAdmin(existing))

        expect(result).toBe(false)
        expect(createSbServerClientMock).not.toHaveBeenCalled()
        expect(checkIsAdminMock).toHaveBeenCalledWith(existing)
    })
})
