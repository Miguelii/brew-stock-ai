import 'server-only'

import { Effect } from 'effect'
import StripeClient from 'stripe'
import { ServerEnv } from '@/env/server'
import { CreateCheckoutSessionError, CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import type { User } from '@supabase/supabase-js'
import { ClientEnv } from '@/env/client'
import { Logger } from '@/_bff/lib/server-logger'
import { TOKEN_PACKAGES } from '@/_bff/modules/credits/constants'

export type TokenPackageId = (typeof TOKEN_PACKAGES)[number]['id']

const baseUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export const createCheckoutSession = Effect.fn('createCheckoutSession')(function* (
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
    if (!ServerEnv.STRIPE_SECRET_KEY) {
        return yield* new CreateCheckoutSessionError({
            cause: 'STRIPE ERROR',
            error_hash: ErrorCode.CHECKOUT_NO_STRIPE_SECRET_KEY,
        })
    }
    if (!ServerEnv.STRIPE_WEBHOOK_SECRET) {
        return yield* new CreateCheckoutSessionError({
            cause: 'STRIPE ERROR',
            error_hash: ErrorCode.CHECKOUT_NO_STRIPE_WEBHOOK_KEY,
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
