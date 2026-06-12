import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import type { User } from '@supabase/supabase-js'
import { getInvoices } from '@/backend/modules/credits/services/get-invoices.service'

const { createSbServerClientMock, selectStripeCustomerIdMock, sessionsListMock } = vi.hoisted(
    () => ({
        createSbServerClientMock: vi.fn(),
        selectStripeCustomerIdMock: vi.fn(),
        sessionsListMock: vi.fn(),
    })
)

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/env/server', () => ({ ServerEnv: { STRIPE_SECRET_KEY: 'sk_test' } }))
vi.mock('@/backend/modules/credits/repositories/credits.repository', () => ({
    selectStripeCustomerId: selectStripeCustomerIdMock,
}))
vi.mock('stripe', () => ({
    default: class StripeClientMock {
        checkout = { sessions: { list: sessionsListMock } }
    },
}))

// Pre-customer-id era user, hardcoded in the service's LEGACY_USER_IDS set
const LEGACY_USER_ID = '092dfdcd-ee77-4e14-9e43-0d3c394724ca'
const USER = { id: 'user-1' } as User

const PAID_SESSION = {
    id: 'cs_1',
    created: 1700000000,
    amount_total: 990,
    currency: 'eur',
    metadata: { credits: '15', userId: 'user-1' },
    payment_status: 'paid',
    payment_method_types: ['card'],
}

const listResolving = (sessions: unknown[]) =>
    sessionsListMock.mockReturnValue({ autoPagingToArray: () => Promise.resolve(sessions) })

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

describe('getInvoices', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue({ from: vi.fn() })
        selectStripeCustomerIdMock.mockReset().mockReturnValue(Effect.succeed(null))
        sessionsListMock.mockReset()
        listResolving([])
    })

    it('returns an empty list for users without a customer id that are not legacy', async () => {
        const invoices = await Effect.runPromise(getInvoices(USER))

        expect(invoices).toEqual([])
        expect(sessionsListMock).not.toHaveBeenCalled()
    })

    it('scans all completed sessions filtered by metadata for legacy users', async () => {
        listResolving([
            { ...PAID_SESSION, metadata: { credits: '15', userId: LEGACY_USER_ID } },
            { ...PAID_SESSION, id: 'cs_other', metadata: { userId: 'someone-else' } },
        ])

        const invoices = await Effect.runPromise(getInvoices({ id: LEGACY_USER_ID } as User))

        expect(sessionsListMock).toHaveBeenCalledWith({ status: 'complete', limit: 100 })
        expect(invoices).toHaveLength(1)
        expect(invoices[0]).toEqual({
            id: 'cs_1',
            date: 1700000000,
            amount: 990,
            currency: 'eur',
            description: '15 Analysis Tokens',
            status: 'paid',
            paymentMethod: 'card',
        })
    })

    it('lists sessions by customer id when the user has one', async () => {
        selectStripeCustomerIdMock.mockReturnValue(Effect.succeed('cus_123'))
        listResolving([PAID_SESSION])

        const invoices = await Effect.runPromise(getInvoices(USER))

        expect(sessionsListMock).toHaveBeenCalledWith({
            customer: 'cus_123',
            status: 'complete',
            limit: 100,
        })
        expect(invoices).toHaveLength(1)
    })

    it('swallows the Stripe live/test mode conflict and returns an empty list', async () => {
        selectStripeCustomerIdMock.mockReturnValue(Effect.succeed('cus_123'))
        sessionsListMock.mockReturnValue({
            autoPagingToArray: () =>
                Promise.reject(
                    new Error(
                        'No such customer: a similar object exists in live mode, but a test mode key was used to make this request.'
                    )
                ),
        })

        await expect(Effect.runPromise(getInvoices(USER))).resolves.toEqual([])
    })

    it('fails with GetInvoicesError on any other Stripe failure', async () => {
        selectStripeCustomerIdMock.mockReturnValue(Effect.succeed('cus_123'))
        sessionsListMock.mockReturnValue({
            autoPagingToArray: () => Promise.reject(new Error('stripe is down')),
        })

        const exit = await Effect.runPromiseExit(getInvoices(USER))
        expect(failureTag(exit)).toBe('GetInvoicesError')
    })
})
