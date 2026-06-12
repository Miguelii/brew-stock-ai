import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { exportReport } from '@/backend/modules/reports/services/export-report.service'

export const EXPORT_REPORT_PROTECTED_CONTROLLER = protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ input, ctx }) =>
        runEffect(exportReport(ctx.user, input.id), 'exportReport', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('ExportReportError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
