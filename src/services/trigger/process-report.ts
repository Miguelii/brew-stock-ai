import { processReport } from '@/services/reports/process-report'
import { task, logger } from '@trigger.dev/sdk/v3'
import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { ReportStatus } from '@/types/ReportDTO'

export const processReportTask = task({
    id: 'process-report',
    maxDuration: 180,
    retry: {
        maxAttempts: 1,
    },
    onFailure: async ({ payload, error }) => {
        logger.error('processReportTask failed — marking report as FAILED', {
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
