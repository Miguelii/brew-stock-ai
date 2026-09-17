import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { refreshStockData } from '@/_bff/modules/admin/services/refresh-stock-data.service'
import { failureTag } from '@/_bff/lib/tests-utils'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'

const {
    createDBAdminClientMock,
    isAdminMock,
    getYahooDataWithFallbackServiceMock,
    saveYahooDataMock,
    revalidateStockDataCacheMock,
} = vi.hoisted(() => ({
    createDBAdminClientMock: vi.fn(),
    isAdminMock: vi.fn(),
    getYahooDataWithFallbackServiceMock: vi.fn(),
    saveYahooDataMock: vi.fn(),
    revalidateStockDataCacheMock: vi.fn(),
}))

vi.mock('@/_bff/core/db', () => ({
    createDBAdminClient: createDBAdminClientMock,
}))
vi.mock('@/_bff/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_bff/modules/yahoo/services/get-yahoo-data-with-fallback.service', () => ({
    getYahooDataWithFallbackService: getYahooDataWithFallbackServiceMock,
}))
vi.mock('@/_bff/modules/yahoo/processors/save-yahoo-data.processor', () => ({
    saveYahooData: saveYahooDataMock,
}))
vi.mock('@/_bff/modules/reports/services/revalidate-stock-data-cache.service', () => ({
    revalidateStockDataCache: revalidateStockDataCacheMock,
}))

const SUPABASE = { from: vi.fn() }

const DATA: GetYahooDataResult = {
    scores: null,
    sigDev: null,
    financials: null,
    fundamentals: null,
    reports: [
        {
            title: 'Apple: With Launch of Foldable iPhone Duo',
            provider: 'Morningstar',
            reportDate: '2026-09-11T23:27:26.000Z',
            reportTitle: 'Apple is among the largest companies in the world.',
        },
        {
            title: 'US Large Cap Pick List - September 2026',
            provider: 'Morningstar',
            reportDate: '2026-09-09T17:00:41.000Z',
            reportTitle: 'This pick list highlights large caps.',
        },
    ],
}

describe('refreshStockData', () => {
    beforeEach(() => {
        createDBAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isAdminMock.mockReset().mockReturnValue(Effect.succeed(true))
        getYahooDataWithFallbackServiceMock
            .mockReset()
            .mockReturnValue(Effect.succeed({ ticker: 'AAPL', data: DATA, isFresh: true }))
        saveYahooDataMock.mockReset().mockReturnValue(Effect.void)
        revalidateStockDataCacheMock.mockReset().mockReturnValue(Effect.void)
    })

    it('saves fresh data, drops the page cache and reports the count', async () => {
        await expect(Effect.runPromise(refreshStockData('AAPL'))).resolves.toEqual({
            ticker: 'AAPL',
            reportsCount: 2,
        })

        expect(getYahooDataWithFallbackServiceMock).toHaveBeenCalledWith('AAPL', SUPABASE)
        expect(saveYahooDataMock).toHaveBeenCalledWith('AAPL', DATA, SUPABASE)
        expect(revalidateStockDataCacheMock).toHaveBeenCalledWith('AAPL')
    })

    it('fails with ForbiddenError for non-admins without calling Yahoo', async () => {
        isAdminMock.mockReturnValue(Effect.succeed(false))

        const exit = await Effect.runPromiseExit(refreshStockData('AAPL'))

        expect(failureTag(exit)).toBe('ForbiddenError')
        expect(getYahooDataWithFallbackServiceMock).not.toHaveBeenCalled()
    })

    it('fails without saving when Yahoo returned nothing fresh', async () => {
        getYahooDataWithFallbackServiceMock.mockReturnValue(
            Effect.succeed({ ticker: 'AAPL', data: DATA, isFresh: false })
        )

        const exit = await Effect.runPromiseExit(refreshStockData('AAPL'))

        expect(failureTag(exit)).toBe('StockDataRefreshError')
        expect(saveYahooDataMock).not.toHaveBeenCalled()
        expect(revalidateStockDataCacheMock).not.toHaveBeenCalled()
    })

    it('fails without saving when there is neither Yahoo nor stored data', async () => {
        getYahooDataWithFallbackServiceMock.mockReturnValue(Effect.succeed(null))

        const exit = await Effect.runPromiseExit(refreshStockData('AAPL'))

        expect(failureTag(exit)).toBe('StockDataRefreshError')
        expect(saveYahooDataMock).not.toHaveBeenCalled()
    })
})
