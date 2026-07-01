import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { getReports } from '@/_backend/modules/reports/services/get-reports.service'

export const GET_REPORTS_PROTECTED_CONTROLLER = protectedProcedure.query(({ ctx }) =>
    runEffect(getReports(ctx.user), 'getReports', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('GetReportsError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
