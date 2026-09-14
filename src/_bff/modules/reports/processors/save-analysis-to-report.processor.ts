import { Effect } from 'effect'
import type { ReportDTO } from '@/types/ReportDTO'
import type { SupabaseClient } from '@supabase/supabase-js'
import { updateReportWithAnalysis } from '@/_bff/modules/reports/repositories/reports.repository'

export const saveAnalysisToReport = Effect.fn('saveAnalysisToReport')(function* (
    reportId: ReportDTO['id'],
    analysis: string,
    ticker: string | null,
    tokenUsdCost: number | 'N/A',
    sentiment: number | undefined,
    supabase: SupabaseClient
) {
    yield* updateReportWithAnalysis(supabase, reportId, {
        analysis,
        ticker,
        tokenUsdCost,
        sentiment,
    })
})
