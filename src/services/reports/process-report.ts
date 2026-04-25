import 'server-only'

import { createSbAdminClient } from '@/lib/utils.server'
import { type ReportDTO, ReportStatus } from '@/types/ReportDTO'
import { logger } from '@trigger.dev/sdk'
import { Effect } from 'effect'
import { getStockAnalysis } from '../analysis/get-stock-analysis'
import { FetchReportForTaskError, MarkReportFailedError } from '../utils/constants'

export const processReport = Effect.fn('processReport')(function* (reportId: string) {
    const supabase = createSbAdminClient()

    const { data: report, error } = yield* Effect.tryPromise({
        try: () => supabase.from('reports').select('*').eq('id', reportId).single(),
        catch: (cause) => new FetchReportForTaskError({ cause, error_hash: 'eprcrptfetch' }),
    })

    if (error || !report) {
        return yield* Effect.fail(new Error(`Report not found: ${reportId}`))
    }

    const typedReport = report as ReportDTO

    logger.log('Processing report', {
        reportId: typedReport.id,
        stock: typedReport.stock,
        type: typedReport.type,
        userId: typedReport.user_id,
    })

    yield* getStockAnalysis(typedReport.stock, typedReport.type, typedReport.id, supabase).pipe(
        Effect.catchAll((err) =>
            Effect.tryPromise({
                try: () =>
                    supabase
                        .from('reports')
                        .update({ status: ReportStatus.FAILED })
                        .eq('id', typedReport.id),
                catch: (markCause) =>
                    new MarkReportFailedError({ cause: markCause, error_hash: 'eprcrptmrkfld' }),
            }).pipe(Effect.flatMap(() => Effect.fail(err)))
        )
    )

    logger.log('Report completed', { reportId: typedReport.id })

    return { reportId: typedReport.id }
})
