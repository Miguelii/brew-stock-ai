import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { getCredits } from '@/_bff/modules/credits/services/get-credits.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbServerClientMock, selectCreditsMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    selectCreditsMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_bff/modules/credits/repositories/credits.repository', () => ({
    selectCredits: selectCreditsMock,
}))

const USER = { id: 'user-1' } as User
const SUPABASE = { from: vi.fn() }

describe('getCredits', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        selectCreditsMock.mockReset().mockReturnValue(Effect.succeed(7))
    })

    it('returns the balance from the repository for the current user', async () => {
        await expect(Effect.runPromise(getCredits(USER))).resolves.toBe(7)
        expect(selectCreditsMock).toHaveBeenCalledWith(SUPABASE, 'user-1')
    })

    it('fails with CreateSbClientError when the Supabase client cannot be created', async () => {
        createSbServerClientMock.mockRejectedValue(new Error('no env'))

        const exit = await Effect.runPromiseExit(getCredits(USER))
        expect(failureTag(exit)).toBe('CreateSbClientError')
    })
})
