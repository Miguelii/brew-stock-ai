import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { getReportById } from '@/_bff/modules/reports/services/get-report-by-id.service'

const { createSbServerClientMock, isAdminMock, selectReportByIdMock, selectStockDataMock } =
    vi.hoisted(() => ({
        createSbServerClientMock: vi.fn(),
        isAdminMock: vi.fn(),
        selectReportByIdMock: vi.fn(),
        selectStockDataMock: vi.fn(),
    }))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_bff/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_bff/modules/reports/repositories/reports.repository', () => ({
    selectReportById: selectReportByIdMock,
    selectStockDataByTicker: selectStockDataMock,
}))

const USER = { id: 'user-1', email: 'user@example.com' } as User
const REPORT = { id: 'r-1', ticker: 'AAPL' }
const STOCK_DATA = { id: 'AAPL', scores: null }
const SUPABASE = { from: vi.fn() }

describe('getReportById', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        isAdminMock.mockReset().mockReturnValue(Effect.succeed(false))
        selectReportByIdMock.mockReset().mockReturnValue(Effect.succeed(REPORT))
        selectStockDataMock.mockReset().mockReturnValue(Effect.succeed(STOCK_DATA))
    })

    it('scopes the lookup to the owner for regular users', async () => {
        const result = await Effect.runPromise(getReportById(USER, 'r-1'))

        expect(result).toEqual({ report: REPORT, stockData: STOCK_DATA })
        expect(selectReportByIdMock).toHaveBeenCalledWith(SUPABASE, 'r-1', 'user-1')
        expect(selectStockDataMock).toHaveBeenCalledWith(SUPABASE, 'AAPL')
    })

    it('skips the ownership filter for super admins', async () => {
        isAdminMock.mockReturnValue(Effect.succeed(true))

        await Effect.runPromise(getReportById(USER, 'r-1'))
        expect(isAdminMock).toHaveBeenCalledWith(SUPABASE)
        expect(selectReportByIdMock).toHaveBeenCalledWith(SUPABASE, 'r-1', undefined)
    })

    it('still returns the report when stock data resolves to null', async () => {
        selectStockDataMock.mockReturnValue(Effect.succeed(null))

        const result = await Effect.runPromise(getReportById(USER, 'r-1'))
        expect(result).toEqual({ report: REPORT, stockData: null })
    })
})
