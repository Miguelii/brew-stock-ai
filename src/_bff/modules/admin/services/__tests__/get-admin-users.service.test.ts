import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminUsers } from '@/_bff/modules/admin/services/get-admin-users.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbAdminClientMock, isAdminMock, listUsersMock, selectAllUserCreditsMock } =
    vi.hoisted(() => ({
        createSbAdminClientMock: vi.fn(),
        isAdminMock: vi.fn(),
        listUsersMock: vi.fn(),
        selectAllUserCreditsMock: vi.fn(),
    }))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/_bff/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_bff/modules/admin/repositories/admin.repository', () => ({
    listUsers: listUsersMock,
    selectAllUserCredits: selectAllUserCreditsMock,
}))

describe('getAdminUsers', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue({ from: vi.fn() })
        isAdminMock.mockReset().mockReturnValue(Effect.succeed(true))
        listUsersMock.mockReset().mockReturnValue(Effect.succeed([]))
        selectAllUserCreditsMock.mockReset().mockReturnValue(Effect.succeed([]))
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
        selectAllUserCreditsMock.mockReturnValue(Effect.succeed([{ user_id: 'u-1', credits: 7 }]))

        const users = await Effect.runPromise(getAdminUsers())

        expect(users).toEqual([
            {
                id: 'u-1',
                email: 'user@example.com',
                created_at: '2026-01-01',
                last_sign_in_at: '2026-06-01',
                provider: 'email',
                credits: 7,
            },
            {
                id: 'u-2',
                email: '—',
                created_at: '2026-02-01',
                last_sign_in_at: null,
                provider: null,
                credits: 0,
            },
        ])
    })

    it('fails with UnauthenticatedError for non-admin callers', async () => {
        isAdminMock.mockReturnValue(Effect.succeed(false))

        const exit = await Effect.runPromiseExit(getAdminUsers())
        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(listUsersMock).not.toHaveBeenCalled()
    })
})
