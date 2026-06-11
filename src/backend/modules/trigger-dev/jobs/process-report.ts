import { task, logger, tasks } from '@trigger.dev/sdk/v3'
import { Effect } from 'effect'
import { createSbAdminClient, getIsDev } from '@/lib/utils.server'
import { ReportStatus } from '@/types/ReportDTO'
import { processReport } from '@/backend/modules/reports/processors/process-report.processor'

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
        const supabase = createSbAdminClient()
        await supabase
            .from('reports')
            .update({ status: ReportStatus.FAILED })
            .eq('id', payload.reportId)
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
