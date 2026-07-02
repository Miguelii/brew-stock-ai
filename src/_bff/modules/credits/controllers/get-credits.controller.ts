import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { getCredits } from '@/_bff/modules/credits/services/get-credits.service'

export const GET_CREDITS_PROTECTED_CONTROLLER = protectedProcedure.query(({ ctx }) =>
    runEffect(getCredits(ctx.user), 'getCredits', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('GetCreditsError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
