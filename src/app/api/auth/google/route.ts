import { type NextRequest, NextResponse } from 'next/server'
import { Effect, Exit } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { ClientEnv } from '@/env/client'
import { CreateSbClientError, OAuthInitError } from '@/services/utils/tagged-errors'
import { AUTH_PAGE_PATH } from '@/lib/constants'

const initiateGoogleOAuth = Effect.fn('initiateGoogleOAuth')(function* (returnTo?: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'eoauthgglsbclnt' }),
    })

    const callbackUrl = new URL(`${AUTH_PAGE_PATH}/callback`, ClientEnv.NEXT_PUBLIC_WEBSITE_URL)
    if (returnTo) callbackUrl.searchParams.set('next', returnTo)

    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: callbackUrl.toString() },
            }),
        catch: (cause) => new OAuthInitError({ cause, error_hash: 'eoauthgglinit' }),
    })

    if (error || !data.url) {
        return yield* new OAuthInitError({
            cause: error ?? 'No redirect URL returned',
            error_hash: 'eoauthgglnourl',
        })
    }

    return data.url
})

const errorUrl = new URL(`${AUTH_PAGE_PATH}?error=oauth`, ClientEnv.NEXT_PUBLIC_WEBSITE_URL)

export async function GET(request: NextRequest) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') ?? undefined
    const exit = await Effect.runPromiseExit(initiateGoogleOAuth(returnTo))

    if (Exit.isFailure(exit)) {
        return NextResponse.redirect(errorUrl)
    }

    return NextResponse.redirect(exit.value)
}
