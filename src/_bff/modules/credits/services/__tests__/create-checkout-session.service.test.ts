import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { createCheckoutSession } from '@/_bff/modules/credits/services/create-checkout-session.service'
import { TOKEN_PACKAGES } from '@/_bff/modules/credits/constants'
import { failureTag } from '@/_bff/__tests__/utils'

const {
    createSbServerClientMock,
    cookiesMock,
    loggerMock,
    customersCreateMock,
    sessionsCreateMock,
} = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    cookiesMock: vi.fn(),
    loggerMock: vi.fn(),
    customersCreateMock: vi.fn(),
    sessionsCreateMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/env/server', () => ({ ServerEnv: { STRIPE_SECRET_KEY: 'sk_test' } }))
vi.mock('@/env/client', () => ({ ClientEnv: { NEXT_PUBLIC_WEBSITE_URL: 'https://test.local' } }))
vi.mock('@/_bff/lib/server-logger', () => ({ Logger: loggerMock }))
vi.mock('next/headers', () => ({ cookies: cookiesMock }))
vi.mock('stripe', () => ({
    default: class StripeClientMock {
        customers = { create: customersCreateMock }
        checkout = { sessions: { create: sessionsCreateMock } }
    },
}))

const USER = { id: 'user-1', email: 'user@example.com' } as User
const PKG = TOKEN_PACKAGES[0]

const makeSupabase = (selectResult: { data: unknown; error: unknown }) => {
    const single = vi.fn().mockResolvedValue(selectResult)
    const selectEq = vi.fn(() => ({ single }))
    const select = vi.fn(() => ({ eq: selectEq }))
    const updateEq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq: updateEq }))
    return { update, supabase: { from: () => ({ select, update }) } }
}

describe('createCheckoutSession', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset()
        // oxlint-disable-next-line unicorn/no-useless-undefined
        cookiesMock.mockReset().mockResolvedValue({ get: () => undefined })
        loggerMock.mockReset()
        customersCreateMock.mockReset().mockResolvedValue({ id: 'cus_new' })
        sessionsCreateMock.mockReset().mockResolvedValue({ url: 'https://stripe.test/session' })
    })

    it('fails with CreateCheckoutSessionError for an unknown package before any side effect', async () => {
        const exit = await Effect.runPromiseExit(
            createCheckoutSession(USER, 'mega' as Parameters<typeof createCheckoutSession>[1])
        )

        expect(failureTag(exit)).toBe('CreateCheckoutSessionError')
        expect(createSbServerClientMock).not.toHaveBeenCalled()
    })

    it('reuses the stored Stripe customer without creating a new one', async () => {
        const { update, supabase } = makeSupabase({
            data: { stripe_customer_id: 'cus_existing' },
            error: null,
        })
        createSbServerClientMock.mockResolvedValue(supabase)

        const url = await Effect.runPromise(createCheckoutSession(USER, PKG.id))

        expect(url).toBe('https://stripe.test/session')
        expect(customersCreateMock).not.toHaveBeenCalled()
        expect(update).not.toHaveBeenCalled()
        expect(sessionsCreateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                customer: 'cus_existing',
                mode: 'payment',
                metadata: { userId: 'user-1', credits: String(PKG.credits) },
                success_url: 'https://test.local/tokens?success=true',
                cancel_url: 'https://test.local/tokens?canceled=true',
            })
        )
    })

    it('creates and stores a Stripe customer for first-time buyers', async () => {
        const { update, supabase } = makeSupabase({ data: null, error: null })
        createSbServerClientMock.mockResolvedValue(supabase)

        await Effect.runPromise(createCheckoutSession(USER, PKG.id))

        expect(customersCreateMock).toHaveBeenCalledWith({ email: 'user@example.com' })
        expect(update).toHaveBeenCalledWith({ stripe_customer_id: 'cus_new' })
        expect(sessionsCreateMock).toHaveBeenCalledWith(
            expect.objectContaining({ customer: 'cus_new' })
        )
    })

    it('still creates the checkout session when reading cookies fails', async () => {
        const { supabase } = makeSupabase({
            data: { stripe_customer_id: 'cus_existing' },
            error: null,
        })
        createSbServerClientMock.mockResolvedValue(supabase)
        cookiesMock.mockRejectedValue(new Error('no request scope'))

        await expect(Effect.runPromise(createCheckoutSession(USER, PKG.id))).resolves.toBe(
            'https://stripe.test/session'
        )
    })
})
