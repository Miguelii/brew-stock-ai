import 'server-only'

import { Effect } from 'effect'
import StripeClient from 'stripe'
import { ServerEnv } from '@/env/server'
import { ClientEnv } from '@/env/client'
import {
    CreateCheckoutSessionError,
    CreateSbClientError,
    UnauthenticatedError,
} from '@/services/utils/tagged-errors'
import { createSbServerClient } from '@/lib/utils.server'
import { getSession } from '@/services/supabase/get-session'

export const TOKEN_PACKAGES = [
    { id: 'starter', credits: 5, amount: 250, label: 'Starter' },
    { id: 'pro', credits: 15, amount: 599, label: 'Pro' },
    { id: 'expert', credits: 50, amount: 1499, label: 'Expert' },
] as const

export type TokenPackageId = (typeof TOKEN_PACKAGES)[number]['id']

export const createCheckoutSession = Effect.fn('createCheckoutSession')(function* (
    packageId: TokenPackageId
) {
    const pkg = TOKEN_PACKAGES.find((p) => p.id === packageId)

    if (!pkg) {
        return yield* new CreateCheckoutSessionError({
            cause: `Unknown package: ${packageId}`,
            error_hash: 'ecktchksssnpkg',
        })
    }

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'ecktchksssnclnt' }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: 'ecktchksssunath' })
    }

    const stripe = new StripeClient(ServerEnv.STRIPE_SECRET_KEY)
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
                success_url: `${baseUrl}/tokens?success=true`,
                cancel_url: `${baseUrl}/tokens?canceled=true`,
            }),
        catch: (cause) => new CreateCheckoutSessionError({ cause, error_hash: 'ecktchksssncrt' }),
    })

    return session.url as string
})
