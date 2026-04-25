import { task, logger } from '@trigger.dev/sdk/v3'
import { Effect } from 'effect'
import { getStockAnalysis } from '@/services/analysis/get-stock-analysis'
import { createSbAdminClient } from '@/lib/utils.server'
import { ReportStatus } from '@/types/ReportDTO'
import type { ReportDTO } from '@/types/ReportDTO'
import { FetchReportForTaskError, MarkReportFailedError } from '@/services/utils/constants'

const processReport = Effect.fn('processReport')(function* (reportId: string) {
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

export const processReportTask = task({
    id: 'process-report',
    maxDuration: 180,
    retry: {
        maxAttempts: 1,
    },
    run: (payload: { reportId: string }) => Effect.runPromise(processReport(payload.reportId)),
})
