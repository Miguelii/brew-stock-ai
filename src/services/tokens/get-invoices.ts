import 'server-only'

import { Effect } from 'effect'
import StripeClient from 'stripe'
import { ServerEnv } from '@/env/server'
import { CreateSbClientError, GetInvoicesError, UnauthenticatedError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import { getSession } from '@/services/auth/get-session'
import type { Invoice } from '@/types/Invoice'

export const getInvoices = Effect.fn('getInvoices')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.INVOICES_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.INVOICES_UNAUTH })
    }

    const stripe = yield* Effect.try({
        try: () => new StripeClient(ServerEnv.STRIPE_SECRET_KEY!),
        catch: (cause) =>
            new GetInvoicesError({ cause, error_hash: ErrorCode.INVOICES_STRIPE_INIT }),
    })

    // List completed checkout sessions and then filter by userId.
    // This covers both existing payments (metadata only on session) and future ones.
    // Stripe's API does not support filtering by metadata server-side, so we must fetch all sessions and
    // autoPagingToArray handles cursor pagination automatically — avoids the 100-item cap.
    const allSessions = yield* Effect.tryPromise({
        try: () =>
            stripe.checkout.sessions
                .list({ limit: 100, status: 'complete' })
                .autoPagingToArray({ limit: 10_000 }),
        catch: (cause) =>
            new GetInvoicesError({ cause, error_hash: ErrorCode.INVOICES_STRIPE_FETCH }),
    })

    const invoices: Invoice[] = allSessions
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
