import 'server-only'

import { createSbAdminClient } from '@/lib/utils.server'
import { type ReportDTO, ReportStatus } from '@/types/ReportDTO'
import { logger } from '@trigger.dev/sdk'
import { Effect } from 'effect'
import { getStockAnalysis } from '@/services/analysis/get-stock-analysis'
import {
    CreateSbClientError,
    FetchReportForTaskError,
    MarkReportFailedError,
} from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { sendPushNotificationToUser } from '@/services/notifications/send-push-notification'

export const processReport = Effect.fn('processReport')(function* (
    reportId: string,
    useBaseModel?: boolean
) {
    const supabase = yield* Effect.try({
        try: () => createSbAdminClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PROCESS_REPORT_SB_CLIENT }),
    })

    const { data: report, error } = yield* Effect.tryPromise({
        try: () => supabase.from('reports').select('*').eq('id', reportId).single(),
        catch: (cause) =>
            new FetchReportForTaskError({ cause, error_hash: ErrorCode.PROCESS_REPORT_FETCH }),
    })

    if (error || !report) {
        return yield* new FetchReportForTaskError({
            cause: `Report not found: ${reportId}`,
            error_hash: ErrorCode.PROCESS_REPORT_NOT_FOUND,
        })
    }

    const typedReport = report as ReportDTO

    logger.log('Processing report', {
        reportId: typedReport.id,
        stock: typedReport.stock,
        type: typedReport.type,
        userId: typedReport.user_id,
    })

    yield* getStockAnalysis(
        typedReport.stock,
        typedReport.type,
        typedReport.id,
        supabase,
        useBaseModel
    ).pipe(
        Effect.catchAll((err) =>
            Effect.tryPromise({
                try: () =>
                    supabase
                        .from('reports')
                        .update({ status: ReportStatus.FAILED })
                        .eq('id', typedReport.id),
                catch: (markCause) =>
                    new MarkReportFailedError({
                        cause: markCause,
                        error_hash: ErrorCode.PROCESS_REPORT_MARK_FAILED,
                    }),
            }).pipe(Effect.flatMap(() => Effect.fail(err)))
        )
    )

    logger.log('Report completed', { reportId: typedReport.id })

    // Non-fatal — a failed push notification must never cause the task to retry
    yield* sendPushNotificationToUser(
        typedReport.user_id,
        `${typedReport.stock} analysis ready`,
        'Your report has been generated. Tap to view it.'
    ).pipe(Effect.catchAllCause(() => Effect.void))

    return { reportId: typedReport.id }
})
