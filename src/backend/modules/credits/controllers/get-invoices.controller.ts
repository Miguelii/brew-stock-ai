import { Match } from 'effect'
import { runEffect } from '@/_trpc/utils'
import { protectedProcedure } from '@/_trpc/server'
import { getInvoices } from '@/backend/modules/credits/services/get-invoices.service'

export const GET_INVOICES_PROTECTED_CONTROLLER = protectedProcedure.query(({ ctx }) =>
    runEffect(getInvoices(ctx.user), 'getInvoices', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('GetInvoicesError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
