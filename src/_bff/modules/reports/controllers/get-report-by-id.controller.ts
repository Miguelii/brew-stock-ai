import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { getReportById } from '@/_bff/modules/reports/services/get-report-by-id.service'

export const GET_REPORT_BY_ID_PROTECTED_CONTROLLER = protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input, ctx }) =>
        runEffect(getReportById(ctx.user, input.id), 'getReportById', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('IsAdminError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetReportByIdError', () => 'NOT_FOUND' as const),
                Match.exhaustive
            )
        )
    )
