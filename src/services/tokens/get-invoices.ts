import 'server-only'

import { Effect } from 'effect'
import StripeClient, { type Stripe } from 'stripe'
import { ServerEnv } from '@/env/server'
import { CreateSbClientError, GetInvoicesError, UnauthenticatedError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import { getSession } from '@/services/auth/get-session'
import type { Invoice } from '@/types/Invoice'

// Users who purchased via guest checkout before Stripe Customer ID was introduced.
// For these users a full session scan is performed, filtered by metadata.userId.
// Once they make a new purchase they get a stripe_customer_id and are removed from this set.
const LEGACY_USER_IDS = new Set([
    '092dfdcd-ee77-4e14-9e43-0d3c394724ca', // My seft to test
    'ce44755c-528f-4b05-83fb-f9a31fbf612e', // Joe Stallings III that bought a package
])

function mapSession(s: Stripe.Checkout.Session): Invoice {
    return {
        id: s.id,
        date: s.created,
        amount: s.amount_total!,
        currency: s.currency ?? 'eur',
        description: s.metadata?.credits
            ? `${s.metadata.credits} Analysis Tokens`
            : 'Token purchase',
        status: s.payment_status === 'paid' ? 'paid' : 'pending',
        paymentMethod: s.payment_method_types[0] ?? undefined,
    }
}

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

    const { data: userCredits } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('user_credits')
                .select('stripe_customer_id')
                .eq('user_id', user.id)
                .single(),
        catch: (cause) =>
            new GetInvoicesError({ cause, error_hash: ErrorCode.INVOICES_CREDITS_FETCH }),
    })

    if (!userCredits?.stripe_customer_id) {
        if (!LEGACY_USER_IDS.has(user.id)) return []

        const sessions = yield* Effect.tryPromise({
            try: () =>
                stripe.checkout.sessions
                    .list({ status: 'complete', limit: 100 })
                    .autoPagingToArray({ limit: 10_000 }),
            catch: (cause) =>
                new GetInvoicesError({ cause, error_hash: ErrorCode.INVOICES_STRIPE_FETCH }),
        })

        return sessions
            .filter((s) => s.metadata?.userId === user.id && s.amount_total)
            .map((s) => mapSession(s))
            .toSorted((a) => (a.status === 'pending' ? -1 : 1))
    }

    const allCompleted = yield* Effect.tryPromise({
        try: () =>
            stripe.checkout.sessions
                .list({
                    customer: userCredits.stripe_customer_id!,
                    status: 'complete',
                    limit: 100,
                })
                .autoPagingToArray({ limit: 10_000 }),
        catch: (cause) =>
            new GetInvoicesError({ cause, error_hash: ErrorCode.INVOICES_STRIPE_FETCH }),
    })

    return allCompleted
        .filter((s) => s.amount_total)
        .map((s) => mapSession(s))
        .toSorted((a) => (a.status === 'pending' ? -1 : 1))
})
