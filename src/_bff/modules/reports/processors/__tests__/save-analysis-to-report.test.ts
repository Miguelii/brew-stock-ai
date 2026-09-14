import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { saveAnalysisToReport } from '@/_bff/modules/reports/processors/save-analysis-to-report.processor'

const { updateReportWithAnalysisMock } = vi.hoisted(() => ({
    updateReportWithAnalysisMock: vi.fn(),
}))

vi.mock('@/_bff/modules/reports/repositories/reports.repository', () => ({
    updateReportWithAnalysis: updateReportWithAnalysisMock,
}))

const SUPABASE = { from: vi.fn() } as unknown as SupabaseClient

describe('saveAnalysisToReport', () => {
    beforeEach(() => {
        updateReportWithAnalysisMock.mockReset().mockReturnValue(Effect.void)
    })

    it('updates the report with the analysis payload using the given client', async () => {
        await Effect.runPromise(
            saveAnalysisToReport('r-1', '<p>report</p>', 'AAPL', 0.42, 7, SUPABASE)
        )

        expect(updateReportWithAnalysisMock).toHaveBeenCalledWith(SUPABASE, 'r-1', {
            analysis: '<p>report</p>',
            ticker: 'AAPL',
            tokenUsdCost: 0.42,
            sentiment: 7,
        })
    })

    it('passes missing ticker and sentiment through unchanged', async () => {
        await Effect.runPromise(
            saveAnalysisToReport('r-1', '<p>report</p>', null, 'N/A', undefined, SUPABASE)
        )

        expect(updateReportWithAnalysisMock).toHaveBeenCalledWith(SUPABASE, 'r-1', {
            analysis: '<p>report</p>',
            ticker: null,
            tokenUsdCost: 'N/A',
            sentiment: undefined,
        })
    })
})
