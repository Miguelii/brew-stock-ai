import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SaveAnalysisError } from '@/services/utils/constants'
import type { ReportDTO } from '@/types/ReportDTO'
import { ReportStatus } from '@/types/ReportDTO'

export const saveAnalysisToReport = Effect.fn('saveAnalysisToReport')(function* (
    reportId: ReportDTO['id'],
    analysis: string,
    sentiment?: number
) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'esaveanlysbclnt' }),
    })

    const response = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .update({
                    status: ReportStatus.COMPLETED,
                    ai_response: analysis,
                    sentiment: sentiment ?? 'NULL',
                })
                .eq('id', reportId),
        catch: (cause) => new SaveAnalysisError({ cause, error_hash: 'esaveanlyupdt' }),
    })

    if (response.error) {
        return yield* new SaveAnalysisError({
            cause: response.error,
            error_hash: 'esaveanlyupdterr',
        })
    }
})
