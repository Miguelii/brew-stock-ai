import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import type { SupabaseClient } from '@supabase/supabase-js'
import { updateReportWithAnalysis } from '@/backend/modules/reports/repositories/reports.repository'

export const saveAnalysisToReport = Effect.fn('saveAnalysisToReport')(function* (
    reportId: ReportDTO['id'],
    analysis: string,
    ticker: string | null,
    tokenUsdCost: number | 'N/A',
    sentiment?: number,
    prebuiltClient?: SupabaseClient
) {
    const supabase =
        prebuiltClient ??
        (yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) =>
                new CreateSbClientError({ cause, error_hash: ErrorCode.SAVE_ANALYSIS_SB_CLIENT }),
        }))

    yield* updateReportWithAnalysis(supabase, reportId, {
        analysis,
        ticker,
        tokenUsdCost,
        sentiment,
    })
})
