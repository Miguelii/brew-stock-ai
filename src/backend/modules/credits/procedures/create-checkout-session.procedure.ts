import 'server-only'

import { Effect, Match } from 'effect'
import { cookies } from 'next/headers'
import StripeClient from 'stripe'
import { ServerEnv } from '@/env/server'
import { CreateCheckoutSessionError, CreateSbClientError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import type { User } from '@supabase/supabase-js'
import { ClientEnv } from '@/env/client'
import { Logger } from '@/lib/logger'
import { protectedProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'
import { z } from 'zod'
import { TOKEN_PACKAGES } from '../constants'

type TokenPackageId = (typeof TOKEN_PACKAGES)[number]['id']

const baseUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

const createCheckoutSession = Effect.fn('createCheckoutSession')(function* (
    user: User,
    packageId: TokenPackageId
) {
    const pkg = TOKEN_PACKAGES.find((p) => p.id === packageId)

    if (!pkg) {
        return yield* new CreateCheckoutSessionError({
            cause: `Unknown package: ${packageId}`,
            error_hash: ErrorCode.CHECKOUT_INVALID_PKG,
        })
    }

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(true),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.CHECKOUT_SB_CLIENT }),
    })

    const stripe = yield* Effect.try({
        try: () => new StripeClient(ServerEnv.STRIPE_SECRET_KEY!),
        catch: (cause) =>
            new CreateCheckoutSessionError({ cause, error_hash: ErrorCode.CHECKOUT_STRIPE_INIT }),
    })

    const userCreditsSelectResponse = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('user_credits')
                .select('stripe_customer_id')
                .eq('user_id', user.id)
                .single(),
        catch: (cause) =>
            new CreateCheckoutSessionError({
                cause,
                error_hash: ErrorCode.CHECKOUT_CREDITS_FETCH,
            }),
    })

    if (userCreditsSelectResponse.error) {
        Logger({
            prefix: 'createCheckoutSession',
            level: 'error',
            message: 'userCreditsSelectResponse error',
            metadata: { error: JSON.stringify(userCreditsSelectResponse.error) },
            userId: user?.id ?? undefined,
        })
    }

    const userCredits = userCreditsSelectResponse.data

    let stripeCustomerId = userCredits?.stripe_customer_id ?? null

    if (!stripeCustomerId) {
        const customer = yield* Effect.tryPromise({
            try: () => stripe.customers.create({ email: user.email ?? undefined }),
            catch: (cause) =>
                new CreateCheckoutSessionError({
                    cause,
                    error_hash: ErrorCode.CHECKOUT_CUSTOMER_CREATE,
                }),
        })

        stripeCustomerId = customer.id

        const userCreditsUpdateResponse = yield* Effect.tryPromise({
            try: () =>
                supabase
                    .from('user_credits')
                    .update({ stripe_customer_id: stripeCustomerId })
                    .eq('user_id', user.id),
            catch: (cause) =>
                new CreateCheckoutSessionError({
                    cause,
                    error_hash: ErrorCode.CHECKOUT_CUSTOMER_SAVE,
                }),
        })

        if (userCreditsUpdateResponse.error) {
            Logger({
                prefix: 'createCheckoutSession',
                level: 'error',
                message: 'userCreditsUpdateResponse error',
                metadata: { error: JSON.stringify(userCreditsUpdateResponse.error) },
                userId: user?.id ?? undefined,
            })
        }
    }

    // DataFast attribution cookies are best-effort: never fail checkout if
    // they are missing or unreadable — just omit them from the metadata.
    const datafast = yield* Effect.tryPromise({
        try: async () => {
            const cookieStore = await cookies()
            return {
                visitorId: cookieStore.get('datafast_visitor_id')?.value,
                sessionId: cookieStore.get('datafast_session_id')?.value,
            }
        },
        catch: (cause) =>
            new CreateCheckoutSessionError({
                cause,
                error_hash: ErrorCode.CHECKOUT_DATAFAST_COOKIES,
            }),
    }).pipe(Effect.orElseSucceed(() => ({ visitorId: undefined, sessionId: undefined })))

    const session = yield* Effect.tryPromise({
        try: () =>
            stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: `${pkg.credits} Analysis Credits — ${pkg.label}`,
                            },
                            unit_amount: pkg.amount,
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId: user.id,
                    credits: String(pkg.credits),
                    ...(datafast.visitorId && { datafast_visitor_id: datafast.visitorId }),
                    ...(datafast.sessionId && { datafast_session_id: datafast.sessionId }),
                },
                payment_intent_data: {
                    metadata: {
                        userId: user.id,
                        credits: String(pkg.credits),
                    },
                },
                success_url: `${baseUrl}/tokens?success=true`,
                cancel_url: `${baseUrl}/tokens?canceled=true`,
            }),
        catch: (cause) =>
            new CreateCheckoutSessionError({ cause, error_hash: ErrorCode.CHECKOUT_STRIPE_CREATE }),
    })

    return session.url as string
})

export const CREATE_CHECKOUT_SESSION_PROTECTED_PROCEDURE = protectedProcedure
    .input(z.object({ packageId: z.enum(['starter', 'pro', 'expert']) }))
    .mutation(({ input, ctx }) =>
        runEffect(
            createCheckoutSession(ctx.user, input.packageId as TokenPackageId),
            'createCheckoutSession',
            (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('CreateCheckoutSessionError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
        )
    )
