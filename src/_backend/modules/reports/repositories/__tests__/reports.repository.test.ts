import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import { ReportStatus } from '@/types/ReportDTO'
import { failureTag, asClient } from '@/_backend/__tests__/utils'
import {
    insertReport,
    markReportFailed,
    selectReportById,
    selectReportForExport,
    selectReportForProcessing,
    selectStockDataByTicker,
    selectUserReports,
    updateReportWithAnalysis,
} from '@/_backend/modules/reports/repositories/reports.repository'

describe('insertReport', () => {
    const makeInsertChain = (result: { data: unknown; error: unknown }) => {
        const single = vi.fn().mockResolvedValue(result)
        const select = vi.fn(() => ({ single }))
        const insert = vi.fn(() => ({ select }))
        return { insert, supabase: asClient({ insert }) }
    }

    it('inserts a GENERATING report for the user and returns the new id', async () => {
        const { insert, supabase } = makeInsertChain({ data: { id: 'r-1' }, error: null })

        const id = await Effect.runPromise(
            insertReport(supabase, { userId: 'user-1', stock: 'AAPL', type: 'fundamental' })
        )

        expect(id).toBe('r-1')
        expect(insert).toHaveBeenCalledWith({
            created_at: 'now()',
            type: 'fundamental',
            status: ReportStatus.GENERATING,
            user_id: 'user-1',
            stock: 'AAPL',
        })
    })

    it('fails with CreateReportError when the insert returns an error', async () => {
        const { supabase } = makeInsertChain({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(
            insertReport(supabase, { userId: 'user-1', stock: 'AAPL', type: 'fundamental' })
        )
        expect(failureTag(exit)).toBe('CreateReportError')
    })

    it('fails with CreateReportError when the insert rejects', async () => {
        const single = vi.fn().mockRejectedValue(new Error('network down'))
        const supabase = asClient({ insert: () => ({ select: () => ({ single }) }) })

        const exit = await Effect.runPromiseExit(
            insertReport(supabase, { userId: 'user-1', stock: 'AAPL', type: 'fundamental' })
        )
        expect(failureTag(exit)).toBe('CreateReportError')
    })
})

describe('selectUserReports', () => {
    const makeListChain = (result: { data: unknown; error: unknown }) => {
        const order = vi.fn().mockResolvedValue(result)
        const eq = vi.fn(() => ({ order }))
        const select = vi.fn(() => ({ eq }))
        return { eq, supabase: asClient({ select }) }
    }

    it('returns the reports filtered by user id', async () => {
        const rows = [{ id: 'r-1' }, { id: 'r-2' }]
        const { eq, supabase } = makeListChain({ data: rows, error: null })

        const reports = await Effect.runPromise(selectUserReports(supabase, 'user-1'))
        expect(reports).toEqual(rows)
        expect(eq).toHaveBeenCalledWith('user_id', 'user-1')
    })

    it('fails with GetReportsError when the query returns an error', async () => {
        const { supabase } = makeListChain({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(selectUserReports(supabase, 'user-1'))
        expect(failureTag(exit)).toBe('GetReportsError')
    })
})

describe('selectReportById', () => {
    const REPORT = { id: 'r-1', user_id: 'user-1', ticker: 'AAPL' }

    const makeByIdChain = (result: { data: unknown; error: unknown }) => {
        const single = vi.fn().mockResolvedValue(result)
        const eqUser = vi.fn(() => ({ single }))
        const eqId = vi.fn(() => ({ eq: eqUser, single }))
        const select = vi.fn(() => ({ eq: eqId }))
        return { eqId, eqUser, supabase: asClient({ select }) }
    }

    it('filters by ownership when a user id is provided', async () => {
        const { eqId, eqUser, supabase } = makeByIdChain({ data: REPORT, error: null })

        const report = await Effect.runPromise(selectReportById(supabase, 'r-1', 'user-1'))
        expect(report).toEqual(REPORT)
        expect(eqId).toHaveBeenCalledWith('id', 'r-1')
        expect(eqUser).toHaveBeenCalledWith('user_id', 'user-1')
    })

    it('skips the ownership filter when no user id is provided (super admin)', async () => {
        const { eqUser, supabase } = makeByIdChain({ data: REPORT, error: null })

        const report = await Effect.runPromise(selectReportById(supabase, 'r-1'))
        expect(report).toEqual(REPORT)
        expect(eqUser).not.toHaveBeenCalled()
    })

    it('fails with GetReportByIdError when the query returns an error', async () => {
        const { supabase } = makeByIdChain({ data: null, error: { message: 'not found' } })

        const exit = await Effect.runPromiseExit(selectReportById(supabase, 'r-1', 'user-1'))
        expect(failureTag(exit)).toBe('GetReportByIdError')
    })
})

describe('selectReportForExport', () => {
    const makeExportChain = (result: { data: unknown; error: unknown }) => {
        const single = vi.fn().mockResolvedValue(result)
        const eqUser = vi.fn(() => ({ single }))
        const eqId = vi.fn(() => ({ eq: eqUser }))
        const select = vi.fn(() => ({ eq: eqId }))
        return { eqId, eqUser, supabase: asClient({ select }) }
    }

    it('returns the export row scoped to the owner', async () => {
        const row = { stock: 'AAPL', ticker: 'AAPL' }
        const { eqId, eqUser, supabase } = makeExportChain({ data: row, error: null })

        const report = await Effect.runPromise(selectReportForExport(supabase, 'r-1', 'user-1'))
        expect(report).toEqual(row)
        expect(eqId).toHaveBeenCalledWith('id', 'r-1')
        expect(eqUser).toHaveBeenCalledWith('user_id', 'user-1')
    })

    it('fails with ExportReportError when the query returns an error', async () => {
        const { supabase } = makeExportChain({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(selectReportForExport(supabase, 'r-1', 'user-1'))
        expect(failureTag(exit)).toBe('ExportReportError')
    })
})

describe('selectReportForProcessing', () => {
    const makeProcessingChain = (result: { data: unknown; error: unknown }) => {
        const single = vi.fn().mockResolvedValue(result)
        const eq = vi.fn(() => ({ single }))
        const select = vi.fn(() => ({ eq }))
        return asClient({ select })
    }

    it('returns the full report row', async () => {
        const supabase = makeProcessingChain({ data: { id: 'r-1' }, error: null })

        await expect(
            Effect.runPromise(selectReportForProcessing(supabase, 'r-1'))
        ).resolves.toEqual({ id: 'r-1' })
    })

    it('fails with FetchReportForTaskError when the report does not exist', async () => {
        const supabase = makeProcessingChain({ data: null, error: { message: 'not found' } })

        const exit = await Effect.runPromiseExit(selectReportForProcessing(supabase, 'missing'))
        expect(failureTag(exit)).toBe('FetchReportForTaskError')
    })
})

describe('selectStockDataByTicker', () => {
    const makeStockChain = (maybeSingle: () => Promise<unknown>) =>
        asClient({ select: () => ({ eq: () => ({ maybeSingle }) }) })

    it('returns the stock data row when present', async () => {
        const supabase = makeStockChain(() => Promise.resolve({ data: { id: 'AAPL' } }))

        await expect(Effect.runPromise(selectStockDataByTicker(supabase, 'AAPL'))).resolves.toEqual(
            { id: 'AAPL' }
        )
    })

    it('resolves to null when there is no row', async () => {
        const supabase = makeStockChain(() => Promise.resolve({ data: null }))

        await expect(Effect.runPromise(selectStockDataByTicker(supabase, 'AAPL'))).resolves.toBe(
            null
        )
    })

    it('resolves to null instead of failing when the query rejects', async () => {
        const supabase = makeStockChain(() => Promise.reject(new Error('network down')))

        await expect(Effect.runPromise(selectStockDataByTicker(supabase, 'AAPL'))).resolves.toBe(
            null
        )
    })
})

describe('markReportFailed', () => {
    const makeFailChain = (result: { data: unknown; error: unknown }) => {
        const maybeSingle = vi.fn().mockResolvedValue(result)
        const select = vi.fn(() => ({ maybeSingle }))
        const neq = vi.fn(() => ({ select }))
        const eq = vi.fn(() => ({ neq }))
        const update = vi.fn(() => ({ eq }))
        return { update, eq, neq, supabase: asClient({ update }) }
    }

    it('marks the report FAILED and returns the refund columns on the first transition', async () => {
        const { update, eq, neq, supabase } = makeFailChain({
            data: { user_id: 'user-1', type: 'fundamental' },
            error: null,
        })

        const result = await Effect.runPromise(markReportFailed(supabase, 'r-1'))

        expect(result).toEqual({ user_id: 'user-1', type: 'fundamental' })
        expect(update).toHaveBeenCalledWith({ status: ReportStatus.FAILED })
        expect(eq).toHaveBeenCalledWith('id', 'r-1')
        expect(neq).toHaveBeenCalledWith('status', ReportStatus.FAILED)
    })

    it('returns null when the report is already FAILED', async () => {
        const { supabase } = makeFailChain({ data: null, error: null })

        await expect(Effect.runPromise(markReportFailed(supabase, 'r-1'))).resolves.toBeNull()
    })

    it('fails with MarkReportFailedError when the update errors', async () => {
        const { supabase } = makeFailChain({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(markReportFailed(supabase, 'r-1'))
        expect(failureTag(exit)).toBe('MarkReportFailedError')
    })
})

describe('updateReportWithAnalysis', () => {
    const makeUpdateChain = (result: { error: unknown }) => {
        const eq = vi.fn().mockResolvedValue(result)
        const update = vi.fn(() => ({ eq }))
        return { update, eq, supabase: asClient({ update }) }
    }

    it('marks the report COMPLETED with the analysis payload', async () => {
        const { update, eq, supabase } = makeUpdateChain({ error: null })

        await Effect.runPromise(
            updateReportWithAnalysis(supabase, 'r-1', {
                analysis: '<p>report</p>',
                ticker: 'AAPL',
                tokenUsdCost: 0.42,
                sentiment: 7,
            })
        )

        expect(update).toHaveBeenCalledWith({
            status: ReportStatus.COMPLETED,
            ai_response: '<p>report</p>',
            sentiment: 7,
            ticker: 'AAPL',
            cost: 0.42,
        })
        expect(eq).toHaveBeenCalledWith('id', 'r-1')
    })

    it('falls back to null markers when sentiment and ticker are missing', async () => {
        const { update, supabase } = makeUpdateChain({ error: null })

        await Effect.runPromise(
            updateReportWithAnalysis(supabase, 'r-1', {
                analysis: '<p>report</p>',
                ticker: null,
                tokenUsdCost: 'N/A',
            })
        )

        expect(update).toHaveBeenCalledWith({
            status: ReportStatus.COMPLETED,
            ai_response: '<p>report</p>',
            sentiment: null,
            ticker: null,
            cost: 'N/A',
        })
    })

    it('fails with SaveAnalysisError when the update returns an error', async () => {
        const { supabase } = makeUpdateChain({ error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(
            updateReportWithAnalysis(supabase, 'r-1', {
                analysis: '<p>report</p>',
                ticker: 'AAPL',
                tokenUsdCost: 0.42,
            })
        )
        expect(failureTag(exit)).toBe('SaveAnalysisError')
    })
})
