import { Match } from 'effect'
import { publicProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { createConsentCookie } from '@/_backend/modules/core/services/create-consent-cookie.service'

export const CREATE_CONSENT_COOKIE_PUBLIC_CONTROLLER = publicProcedure
    .input(z.object({ allowAnalytics: z.boolean() }))
    .mutation(({ input }) =>
        runEffect(createConsentCookie(input.allowAnalytics), 'createConsentCookie', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateConsentCookieError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
