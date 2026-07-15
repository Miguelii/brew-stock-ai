import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { saveAnalysisToReport } from '@/_bff/modules/reports/processors/save-analysis-to-report.processor'

const { createSbServerClientMock, updateReportWithAnalysisMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    updateReportWithAnalysisMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_bff/modules/reports/repositories/reports.repository', () => ({
    updateReportWithAnalysis: updateReportWithAnalysisMock,
}))

const PREBUILT = { from: vi.fn() } as unknown as SupabaseClient
const CREATED = { from: vi.fn() } as unknown as SupabaseClient

describe('saveAnalysisToReport', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(CREATED)
        updateReportWithAnalysisMock.mockReset().mockReturnValue(Effect.void)
    })

    it('reuses the prebuilt client when one is provided (Trigger.dev runtime)', async () => {
        await Effect.runPromise(
            saveAnalysisToReport('r-1', '<p>report</p>', 'AAPL', 0.42, 7, PREBUILT)
        )

        expect(createSbServerClientMock).not.toHaveBeenCalled()
        expect(updateReportWithAnalysisMock).toHaveBeenCalledWith(PREBUILT, 'r-1', {
            analysis: '<p>report</p>',
            ticker: 'AAPL',
            tokenUsdCost: 0.42,
            sentiment: 7,
        })
    })

    it('creates a server client when none is provided', async () => {
        await Effect.runPromise(saveAnalysisToReport('r-1', '<p>report</p>', null, 'N/A'))

        expect(createSbServerClientMock).toHaveBeenCalled()
        expect(updateReportWithAnalysisMock).toHaveBeenCalledWith(CREATED, 'r-1', {
            analysis: '<p>report</p>',
            ticker: null,
            tokenUsdCost: 'N/A',
            sentiment: undefined,
        })
    })
})
