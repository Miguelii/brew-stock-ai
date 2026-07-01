import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import { failureTag, asClient } from '@/_backend/__tests__/utils'
import {
    selectCredits,
    selectStripeCustomerId,
} from '@/_backend/modules/credits/repositories/credits.repository'

describe('selectCredits', () => {
    const makeCreditsChain = (result: { data: unknown; error: unknown }) => {
        const maybeSingle = vi.fn().mockResolvedValue(result)
        const eq = vi.fn(() => ({ maybeSingle }))
        const select = vi.fn(() => ({ eq }))
        return { eq, supabase: asClient({ select }) }
    }

    it('returns the credit balance for the user', async () => {
        const { eq, supabase } = makeCreditsChain({ data: { credits: 7 }, error: null })

        await expect(Effect.runPromise(selectCredits(supabase, 'user-1'))).resolves.toBe(7)
        expect(eq).toHaveBeenCalledWith('user_id', 'user-1')
    })

    it('returns 0 when the user has no credits row', async () => {
        const { supabase } = makeCreditsChain({ data: null, error: null })

        await expect(Effect.runPromise(selectCredits(supabase, 'user-1'))).resolves.toBe(0)
    })

    it('fails with GetCreditsError when the query returns an error', async () => {
        const { supabase } = makeCreditsChain({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(selectCredits(supabase, 'user-1'))
        expect(failureTag(exit)).toBe('GetCreditsError')
    })

    it('fails with GetCreditsError when the query rejects', async () => {
        const maybeSingle = vi.fn().mockRejectedValue(new Error('network down'))
        const supabase = asClient({ select: () => ({ eq: () => ({ maybeSingle }) }) })

        const exit = await Effect.runPromiseExit(selectCredits(supabase, 'user-1'))
        expect(failureTag(exit)).toBe('GetCreditsError')
    })
})

describe('selectStripeCustomerId', () => {
    const makeCustomerChain = (result: { data: unknown; error?: unknown }) => {
        const single = vi.fn().mockResolvedValue(result)
        const eq = vi.fn(() => ({ single }))
        const select = vi.fn(() => ({ eq }))
        return asClient({ select })
    }

    it('returns the stored Stripe customer id', async () => {
        const supabase = makeCustomerChain({ data: { stripe_customer_id: 'cus_123' } })

        await expect(Effect.runPromise(selectStripeCustomerId(supabase, 'user-1'))).resolves.toBe(
            'cus_123'
        )
    })

    it('returns null when the user has no Stripe customer id yet', async () => {
        const supabase = makeCustomerChain({ data: null })

        await expect(Effect.runPromise(selectStripeCustomerId(supabase, 'user-1'))).resolves.toBe(
            null
        )
    })

    it('fails with GetInvoicesError when the query rejects', async () => {
        const single = vi.fn().mockRejectedValue(new Error('network down'))
        const supabase = asClient({ select: () => ({ eq: () => ({ single }) }) })

        const exit = await Effect.runPromiseExit(selectStripeCustomerId(supabase, 'user-1'))
        expect(failureTag(exit)).toBe('GetInvoicesError')
    })
})
