import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import type { User } from '@supabase/supabase-js'
import { getCredits } from '@/backend/modules/credits/services/get-credits.service'

const { createSbServerClientMock, selectCreditsMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    selectCreditsMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/backend/modules/credits/repositories/credits.repository', () => ({
    selectCredits: selectCreditsMock,
}))

const USER = { id: 'user-1' } as User
const SUPABASE = { from: vi.fn() }

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

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
