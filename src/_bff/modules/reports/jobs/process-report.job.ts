import { task, logger, tasks } from '@trigger.dev/sdk/v3'
import { Effect } from 'effect'
import { getIsDev } from '@/lib/utils.server'
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
        logger.error('processReportBackgroundJob failed — marking report as FAILED', {
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
    run: (payload: { reportId: string; useBaseModel?: boolean }) =>
        Effect.runPromise(processReport(payload.reportId, payload.useBaseModel)),
})

export const enqueueReportProcessing = (reportId: string) =>
    Effect.tryPromise({
        try: () =>
            tasks.trigger<typeof processReportBackgroundJob>(JOB_ID, {
                reportId,
                useBaseModel: getIsDev(),
            }),
        catch: (cause) => cause,
    }).pipe(Effect.orElse(() => Effect.void))
