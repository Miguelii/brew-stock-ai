import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { deductCredit } from '@/_backend/modules/credits/services/deduct-credit.service'
import { failureTag } from '@/_backend/__tests__/utils'

// The processor only reaches createSbServerClient when no client is passed;
// every test passes one, so the env-validating module is mocked away.
vi.mock('@/lib/utils.server', () => ({ createSbServerClient: vi.fn() }))

const makeClient = (rpc: ReturnType<typeof vi.fn>): SupabaseClient =>
    ({ rpc }) as unknown as SupabaseClient

describe('deductCredit', () => {
    it('returns the new balance and calls the RPC with a default amount of 1', async () => {
        const rpc = vi.fn().mockResolvedValue({ data: 5, error: null })

        const result = await Effect.runPromise(deductCredit('user-1', makeClient(rpc)))
        expect(result).toBe(5)
        expect(rpc).toHaveBeenCalledWith('deduct_credit', { p_user_id: 'user-1', p_amount: 1 })
    })

    it('forwards a custom amount to the RPC', async () => {
        const rpc = vi.fn().mockResolvedValue({ data: 2, error: null })

        await Effect.runPromise(deductCredit('user-1', makeClient(rpc), 3))
        expect(rpc).toHaveBeenCalledWith('deduct_credit', { p_user_id: 'user-1', p_amount: 3 })
    })

    it('treats a balance of exactly 0 as a successful deduction', async () => {
        const rpc = vi.fn().mockResolvedValue({ data: 0, error: null })

        await expect(Effect.runPromise(deductCredit('user-1', makeClient(rpc)))).resolves.toBe(0)
    })

    it('fails with DeductCreditError when the RPC returns an error', async () => {
        const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(deductCredit('user-1', makeClient(rpc)))
        expect(failureTag(exit)).toBe('DeductCreditError')
    })

    it('fails with DeductCreditError when the RPC call rejects', async () => {
        const rpc = vi.fn().mockRejectedValue(new Error('network down'))

        const exit = await Effect.runPromiseExit(deductCredit('user-1', makeClient(rpc)))
        expect(failureTag(exit)).toBe('DeductCreditError')
    })

    it('fails with InsufficientCreditsError when the RPC returns null (balance below cost)', async () => {
        const rpc = vi.fn().mockResolvedValue({ data: null, error: null })

        const exit = await Effect.runPromiseExit(deductCredit('user-1', makeClient(rpc)))
        expect(failureTag(exit)).toBe('InsufficientCreditsError')
    })

    it('fails with InsufficientCreditsError when the RPC returns a negative balance', async () => {
        const rpc = vi.fn().mockResolvedValue({ data: -1, error: null })

        const exit = await Effect.runPromiseExit(deductCredit('user-1', makeClient(rpc)))
        expect(failureTag(exit)).toBe('InsufficientCreditsError')
    })
})
