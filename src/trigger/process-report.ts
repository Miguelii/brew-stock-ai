import { processReport } from '@/services/reports/process-report'
import { task } from '@trigger.dev/sdk/v3'
import { Effect } from 'effect'

export const processReportTask = task({
    id: 'process-report',
    maxDuration: 180,
    retry: {
        maxAttempts: 1,
    },
    run: (payload: { reportId: string; useBaseModel?: boolean }) =>
        Effect.runPromise(processReport(payload.reportId, payload.useBaseModel)),
})
