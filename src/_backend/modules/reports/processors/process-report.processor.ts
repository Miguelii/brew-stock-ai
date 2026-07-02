import { createSbAdminClient } from '@/lib/utils.server'
import { logger } from '@trigger.dev/sdk'
import { Effect } from 'effect'
import { CreateSbClientError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { getStockAnalysis } from '@/_backend/modules/analysis/processors/get-stock-analysis.processor'
import { sendPushNotificationToUser } from '@/_backend/modules/core/processors/send-push-notification-to-user.processor'
import { selectReportForProcessing } from '@/_backend/modules/reports/repositories/reports.repository'

export const processReport = Effect.fn('processReport')(function* (
    reportId: string,
    useBaseModel?: boolean
) {
    const supabase = yield* Effect.try({
        try: () => createSbAdminClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PROCESS_REPORT_SB_CLIENT }),
    })

    const report = yield* selectReportForProcessing(supabase, reportId)

    logger.log('Processing report', {
        reportId: report.id,
        stock: report.stock,
        type: report.type,
        userId: report.user_id,
    })

    // On failure the error propagates to the job, whose onFailure owns the
    // GENERATING → FAILED transition and the credit refund.
    yield* getStockAnalysis(report.stock, report.type, report.id, supabase, useBaseModel)

    logger.log('Report completed', { reportId: report.id })

    // Non-fatal — a failed push notification must never cause the task to retry
    yield* sendPushNotificationToUser(
        report.user_id,
        `${report.stock} analysis ready`,
        'Your report has been generated. Tap to view it.'
    ).pipe(Effect.catchAllCause(() => Effect.void))

    return { reportId: report.id }
})
