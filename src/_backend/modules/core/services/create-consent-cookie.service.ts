import 'server-only'

import { Effect } from 'effect'
import { cookies } from 'next/headers'
import { CONSENT_COOKIE, GTM_ID_WITHOUT_G } from '@/lib/constants'
import { CreateConsentCookieError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'

export const createConsentCookie = Effect.fn('createConsentCookie')(function* (
    allowAnalytics: boolean
) {
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
