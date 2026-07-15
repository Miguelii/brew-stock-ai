import { type NextRequest, NextResponse } from 'next/server'
import { Effect, Exit } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { ClientEnv } from '@/env/client'
import { CreateSbClientError, OAuthInitError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { AUTH_PAGE_PATH } from '@/lib/constants'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

const errorUrl = new URL(`${AUTH_PAGE_PATH}?error=oauth`, siteUrl)

const initiateGoogleOAuth = Effect.fn('initiateGoogleOAuth')(function* (returnTo?: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.OAUTH_GOOGLE_SB_CLIENT }),
    })

    const callbackUrl = new URL(`${AUTH_PAGE_PATH}/callback`, siteUrl)
    if (returnTo) callbackUrl.searchParams.set('next', returnTo)

    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: callbackUrl.toString(),
                    queryParams: {
                        prompt: 'select_account',
                    },
                },
            }),
        catch: (cause) => new OAuthInitError({ cause, error_hash: ErrorCode.OAUTH_GOOGLE_INIT }),
    })

    if (error || !data.url) {
        return yield* new OAuthInitError({
            cause: error ?? 'No redirect URL returned',
            error_hash: ErrorCode.OAUTH_GOOGLE_NO_URL,
        })
    }

    return data.url
})

export async function GET(request: NextRequest) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') ?? undefined
    const exit = await Effect.runPromiseExit(initiateGoogleOAuth(returnTo))

    if (Exit.isFailure(exit)) {
        return NextResponse.redirect(errorUrl)
    }

    return NextResponse.redirect(exit.value)
}
