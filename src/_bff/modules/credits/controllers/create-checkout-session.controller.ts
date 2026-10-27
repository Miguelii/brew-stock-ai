import { Match } from 'effect'
import { protectedProcedure } from '@/_bff/trpc/server'
import { runEffect } from '@/_bff/trpc/utils'
import { z } from 'zod'
import { createCheckoutSession } from '@/_bff/modules/credits/services/create-checkout-session.service'

export const CREATE_CHECKOUT_SESSION_PROTECTED_CONTROLLER = protectedProcedure
    .input(z.object({ packageId: z.enum(['starter', 'pro', 'expert']) }))
    .mutation(({ input, ctx }) =>
        runEffect(
            createCheckoutSession(ctx.user, input.packageId),
            'createCheckoutSession',
            (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('CreateCheckoutSessionError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
        )
    )
