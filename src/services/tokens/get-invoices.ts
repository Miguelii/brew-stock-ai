import 'server-only'

import { Effect } from 'effect'
import StripeClient from 'stripe'
import { ServerEnv } from '@/env/server'
import { CreateSbClientError, GetInvoicesError, UnauthenticatedError } from '@/services/errors'
import { createSbServerClient } from '@/lib/utils.server'
import { getSession } from '@/services/auth/get-session'
import type { Invoice } from '@/types/Invoice'

export const getInvoices = Effect.fn('getInvoices')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'egtinvsbclnt' }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: 'egtinvunauthd' })
    }

    const stripe = yield* Effect.try({
        try: () => new StripeClient(ServerEnv.STRIPE_SECRET_KEY!),
        catch: (cause) => new GetInvoicesError({ cause, error_hash: 'egtinvstrpinit' }),
    })

    // List completed checkout sessions and filter by userId metadata client-side.
    // This covers both existing payments (metadata only on session) and future ones.
    const sessions = yield* Effect.tryPromise({
        try: () =>
            stripe.checkout.sessions.list({
                limit: 100,
                status: 'complete',
            }),
        catch: (cause) => new GetInvoicesError({ cause, error_hash: 'egtinvstrpfetch' }),
    })

    const invoices: Invoice[] = sessions.data
        .filter((s) => s.metadata?.userId === user.id && s.amount_total)
        .map((s) => ({
            id: s.id,
            date: s.created,
            amount: s.amount_total!,
            currency: s.currency ?? 'eur',
            description: s.metadata?.credits
                ? `${s.metadata.credits} Analysis Tokens`
                : 'Token purchase',
        }))

    return invoices
})
