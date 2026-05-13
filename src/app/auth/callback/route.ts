import { type NextRequest, NextResponse } from 'next/server'
import { Effect, Exit } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { ClientEnv } from '@/env/client'
import { CreateSbClientError, OAuthCallbackError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { AUTH_PAGE_PATH } from '@/lib/constants'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

const errorUrl = new URL(`${AUTH_PAGE_PATH}?error=oauth`, siteUrl)

const handleOAuthCallback = Effect.fn('handleOAuthCallback')(function* (code: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.OAUTH_CALLBACK_SB_CLIENT }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.auth.exchangeCodeForSession(code),
        catch: (cause) =>
            new OAuthCallbackError({ cause, error_hash: ErrorCode.OAUTH_CALLBACK_EXCHANGE }),
    })

    if (error) {
        return yield* new OAuthCallbackError({
            cause: error,
            error_hash: ErrorCode.OAUTH_CALLBACK_SESSION,
        })
    }
})

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (!code) {
        return NextResponse.redirect(errorUrl)
    }

    const exit = await Effect.runPromiseExit(handleOAuthCallback(code))

    if (Exit.isFailure(exit)) {
        return NextResponse.redirect(errorUrl)
    }

    return NextResponse.redirect(new URL(next, siteUrl))
}
