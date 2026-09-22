import { task, logger, tasks } from '@trigger.dev/sdk'
import { Effect } from 'effect'
import { getIsDev } from '@/_bff/core/utils/env.utils'
import { Logger } from '@/_bff/lib/server-logger'
import { processReport } from '@/_bff/modules/reports/processors/process-report.processor'
import { markReportFailedAndRefund } from '@/_bff/modules/reports/services/mark-report-failed-and-refund.service'

const JOB_ID = 'process-report'

const processReportBackgroundJob = task({
    id: JOB_ID,
    maxDuration: 300,
    retry: {
        maxAttempts: 1,
    },
    onFailure: async ({ payload, error }) => {
        logger.error('processReportBackgroundJob failed, marking report as FAILED', {
            reportId: payload.reportId,
            error: String(error),
        })

        const refunded = await Effect.runPromise(
            markReportFailedAndRefund(payload.reportId).pipe(
                Effect.catchAll((err) =>
                    Effect.sync(() => {
                        logger.error('markReportFailedAndRefund failed', {
                            reportId: payload.reportId,
                            error: String(err),
                        })
                        return null
                    })
                )
            )
        )

        if (refunded) {
            logger.log('refunded credits for failed report', {
                reportId: payload.reportId,
                userId: refunded.userId,
                refund: refunded.refund,
            })
        }
    },
    run: (payload: { reportId: string; mockAnalysis?: boolean }) =>
        Effect.runPromise(processReport(payload.reportId, payload.mockAnalysis)),
})

// Never fails, so the report id is always returned to the client. When queueing
// fails, the report is marked FAILED and refunded instead of staying GENERATING forever.
export const enqueueReportProcessing = (reportId: string) =>
    Effect.tryPromise({
        try: () =>
            tasks.trigger<typeof processReportBackgroundJob>(
                JOB_ID,
                { reportId, mockAnalysis: getIsDev() },
                // One run per report: a duplicate trigger never pays for a second generation
                { idempotencyKey: reportId }
            ),
        catch: (cause) => cause,
    }).pipe(
        Effect.asVoid,
        Effect.catchAll((error) =>
            Effect.sync(() =>
                Logger({
                    level: 'error',
                    prefix: 'enqueueReportProcessing',
                    message: 'Failed to enqueue report, marking it as FAILED',
                    error,
                    metadata: { reportId },
                })
            ).pipe(
                Effect.zipRight(markReportFailedAndRefund(reportId)),
                Effect.asVoid,
                Effect.catchAll((refundError) =>
                    Effect.sync(() =>
                        Logger({
                            level: 'error',
                            prefix: 'enqueueReportProcessing',
                            message: 'markReportFailedAndRefund failed',
                            error: refundError,
                            metadata: { reportId },
                        })
                    )
                )
            )
        )
    )
