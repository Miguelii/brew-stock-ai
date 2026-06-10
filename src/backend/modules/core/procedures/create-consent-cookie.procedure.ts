import 'server-only'

import { Effect, Match } from 'effect'
import { cookies } from 'next/headers'
import { CONSENT_COOKIE, GTM_ID_WITHOUT_G } from '@/lib/constants'
import { CreateConsentCookieError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { publicProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'

const createConsentCookie = Effect.fn('createConsentCookie')(function* (allowAnalytics: boolean) {
    yield* Effect.tryPromise({
        try: async () => {
            const cookieStore = await cookies()

            cookieStore.set({
                name: CONSENT_COOKIE,
                value: allowAnalytics ? 'true' : 'false',
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            })

            if (!allowAnalytics) {
                cookieStore.delete('stats_ga')
                cookieStore.delete(`stats_ga_${GTM_ID_WITHOUT_G}`)
            }
        },
        catch: (cause) =>
            new CreateConsentCookieError({ cause, error_hash: ErrorCode.CONSENT_COOKIE_CREATE }),
    })
})

export const CREATE_CONSENT_COOKIE_PUBLIC_PROCEDURE = publicProcedure
    .input(z.object({ allowAnalytics: z.boolean() }))
    .mutation(({ input }) =>
        runEffect(createConsentCookie(input.allowAnalytics), 'createConsentCookie', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateConsentCookieError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
