import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminUsers } from '@/backend/modules/admin/services/get-admin-users.service'
import { failureTag } from '@/backend/__tests__/utils'

const { createSbAdminClientMock, isSuperAdminMock, listUsersMock } = vi.hoisted(() => ({
    createSbAdminClientMock: vi.fn(),
    isSuperAdminMock: vi.fn(),
    listUsersMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/backend/modules/admin/helpers/is-super-admin.helper', () => ({
    isSuperAdmin: isSuperAdminMock,
}))
vi.mock('@/backend/modules/admin/repositories/admin.repository', () => ({
    listUsers: listUsersMock,
}))

describe('getAdminUsers', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue({ from: vi.fn() })
        isSuperAdminMock.mockReset().mockReturnValue(true)
        listUsersMock.mockReset().mockReturnValue(Effect.succeed([]))
    })

    it('maps the raw users into the admin view shape with fallbacks', async () => {
        listUsersMock.mockReturnValue(
            Effect.succeed([
                {
                    id: 'u-1',
                    email: 'user@example.com',
                    created_at: '2026-01-01',
                    last_sign_in_at: '2026-06-01',
                    app_metadata: { provider: 'email' },
                },
                { id: 'u-2', email: undefined, created_at: '2026-02-01', app_metadata: {} },
            ])
        )

        const users = await Effect.runPromise(getAdminUsers('andremcga3@gmail.com'))

        expect(users).toEqual([
            {
                id: 'u-1',
                email: 'user@example.com',
                created_at: '2026-01-01',
                last_sign_in_at: '2026-06-01',
                provider: 'email',
            },
            {
                id: 'u-2',
                email: '—',
                created_at: '2026-02-01',
                last_sign_in_at: null,
                provider: null,
            },
        ])
    })

    it('fails with UnauthenticatedError for non-admin callers', async () => {
        isSuperAdminMock.mockReturnValue(false)

        const exit = await Effect.runPromiseExit(getAdminUsers('user@example.com'))
        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(listUsersMock).not.toHaveBeenCalled()
    })
})
