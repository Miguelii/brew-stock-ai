import { task } from '@trigger.dev/sdk/v3'
import { Effect } from 'effect'
import { processReport } from '@/services/reports/process-report'

export const processReportTask = task({
    id: 'process-report',
    maxDuration: 180,
    retry: {
        maxAttempts: 1,
    },
    run: (payload: { reportId: string }) => Effect.runPromise(processReport(payload.reportId)),
})
