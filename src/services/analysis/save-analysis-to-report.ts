import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SaveAnalysisError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import { ReportStatus } from '@/types/ReportDTO'
import type { SupabaseClient } from '@supabase/supabase-js'

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

    const response = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .update({
                    status: ReportStatus.COMPLETED,
                    ai_response: analysis,
                    sentiment: sentiment ?? 'NULL',
                    ticker: ticker ?? 'NULL',
                    cost: tokenUsdCost ?? 'N/A',
                })
                .eq('id', reportId),
        catch: (cause) =>
            new SaveAnalysisError({ cause, error_hash: ErrorCode.SAVE_ANALYSIS_UPDATE }),
    })

    if (response.error) {
        return yield* new SaveAnalysisError({
            cause: response.error,
            error_hash: ErrorCode.SAVE_ANALYSIS_UPDATE_ERR,
        })
    }
})
