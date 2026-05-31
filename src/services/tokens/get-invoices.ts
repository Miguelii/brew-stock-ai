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

    //return yield* new GetInvoicesError({ cause: 'test', error_hash: ErrorCode.INVOICES_STRIPE_INIT });

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

    // User has never purchased — skip Stripe call entirely
    if (!userCredits?.stripe_customer_id) return []

    // Query filtered by customer — Stripe only returns this user's sessions
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

    const invoices: Invoice[] = allCompleted
        .filter((s) => s.amount_total)
        .map((s) => ({
            id: s.id,
            date: s.created,
            amount: s.amount_total!,
            currency: s.currency ?? 'eur',
            description: s.metadata?.credits
                ? `${s.metadata.credits} Analysis Tokens`
                : 'Token purchase',
            status: s.payment_status === 'paid' ? 'paid' : 'pending',
            paymentMethod: s.payment_method_types[0] ?? undefined,
        }))

    return invoices.toSorted((a) => (a.status === 'pending' ? -1 : 1))
})
