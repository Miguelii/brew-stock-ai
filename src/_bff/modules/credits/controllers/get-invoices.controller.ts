import { Match } from 'effect'
import { runEffect } from '@/_bff/trpc/utils'
import { protectedProcedure } from '@/_bff/trpc/server'
import { getInvoices } from '@/_bff/modules/credits/services/get-invoices.service'

export const GET_INVOICES_PROTECTED_CONTROLLER = protectedProcedure.query(({ ctx }) =>
    runEffect(getInvoices(ctx.user), 'getInvoices', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('GetInvoicesError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
