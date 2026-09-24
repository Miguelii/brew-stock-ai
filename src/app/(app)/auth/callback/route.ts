import { type NextRequest, NextResponse } from 'next/server'
import { Effect, Exit } from 'effect'
import { createDBServerClient } from '@/_bff/core/db'
import { safeRedirectUrl } from '@/lib/utils.server'
import { ClientEnv } from '@/env/client'
import { CreateSbClientError, OAuthCallbackError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { AUTH_PAGE_PATH } from '@/lib/constants'
import {
    ANALYTICS_EVENTS,
    AUTH_EVENT_PARAMS,
    AUTH_METHODS,
} from '@/_bff/core/constants/analytics.constants'
import { isNewUser } from '@/_bff/modules/auth/helpers/is-new-user.helper'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

const errorUrl = new URL(`${AUTH_PAGE_PATH}?error=oauth`, siteUrl)

const handleOAuthCallback = Effect.fn('handleOAuthCallback')(function* (code: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createDBServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.OAUTH_CALLBACK_SB_CLIENT }),
    })

    const { data, error } = yield* Effect.tryPromise({
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

    return isNewUser(data?.user)
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

    const redirectUrl = safeRedirectUrl(next, siteUrl)

    redirectUrl.searchParams.set(
        AUTH_EVENT_PARAMS.EVENT,
        exit.value ? ANALYTICS_EVENTS.SIGN_UP : ANALYTICS_EVENTS.LOGIN
    )
    redirectUrl.searchParams.set(AUTH_EVENT_PARAMS.METHOD, AUTH_METHODS.GOOGLE)

    return NextResponse.redirect(redirectUrl)
}
