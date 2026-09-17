import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminStockData } from '@/_bff/modules/admin/services/get-admin-stock-data.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createDBAdminClientMock, isAdminMock, selectAdminStockDataMock } = vi.hoisted(() => ({
    createDBAdminClientMock: vi.fn(),
    isAdminMock: vi.fn(),
    selectAdminStockDataMock: vi.fn(),
}))

vi.mock('@/_bff/core/db', () => ({
    createDBAdminClient: createDBAdminClientMock,
}))
vi.mock('@/_bff/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_bff/modules/admin/repositories/admin.repository', () => ({
    selectAdminStockData: selectAdminStockDataMock,
}))

const SUPABASE = { from: vi.fn() }

describe('getAdminStockData', () => {
    beforeEach(() => {
        createDBAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isAdminMock.mockReset().mockReturnValue(Effect.succeed(true))
        selectAdminStockDataMock.mockReset().mockReturnValue(Effect.succeed([]))
    })

    it('lists every stored ticker with its last update', async () => {
        selectAdminStockDataMock.mockReturnValue(
            Effect.succeed([
                { id: 'NRC', last_update_at: null },
                { id: 'AAPL', last_update_at: '2026-09-12T14:02:00Z' },
            ])
        )

        await expect(Effect.runPromise(getAdminStockData())).resolves.toEqual([
            { ticker: 'NRC', lastUpdateAt: null },
            { ticker: 'AAPL', lastUpdateAt: '2026-09-12T14:02:00Z' },
        ])
        expect(selectAdminStockDataMock).toHaveBeenCalledWith(SUPABASE)
    })

    it('fails with UnauthenticatedError for non-admins without querying', async () => {
        isAdminMock.mockReturnValue(Effect.succeed(false))

        const exit = await Effect.runPromiseExit(getAdminStockData())

        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(selectAdminStockDataMock).not.toHaveBeenCalled()
    })
})
