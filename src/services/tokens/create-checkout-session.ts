import 'server-only'

import { Effect } from 'effect'
import StripeClient from 'stripe'
import { ServerEnv } from '@/env/server'
import {
    CreateCheckoutSessionError,
    CreateSbClientError,
    UnauthenticatedError,
} from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import { getSession } from '@/services/auth/get-session'
import { ClientEnv } from '@/env/client'
import { TOKEN_PACKAGES } from '@/services/tokens/helpers/constants'

export type TokenPackageId = (typeof TOKEN_PACKAGES)[number]['id']

export const createCheckoutSession = Effect.fn('createCheckoutSession')(function* (
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
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.CHECKOUT_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.CHECKOUT_UNAUTH })
    }

    const stripe = yield* Effect.try({
        try: () => new StripeClient(ServerEnv.STRIPE_SECRET_KEY!),
        catch: (cause) =>
            new CreateCheckoutSessionError({ cause, error_hash: ErrorCode.CHECKOUT_STRIPE_INIT }),
    })

    const baseUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

    const session = yield* Effect.tryPromise({
        try: () =>
            stripe.checkout.sessions.create({
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: `${pkg.credits} Analysis Tokens — ${pkg.label}`,
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
