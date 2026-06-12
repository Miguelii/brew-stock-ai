import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { sbLogout } from '@/backend/modules/auth/services/sb-logout.service'
import { HOME_PAGE_PATH } from '@/lib/constants'

const { createSbServerClientMock, revalidatePathMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    revalidatePathMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }))

const signOut = vi.fn()

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

describe('sbLogout', () => {
    beforeEach(() => {
        signOut.mockReset().mockResolvedValue({ error: null })
        createSbServerClientMock.mockReset().mockResolvedValue({ auth: { signOut } })
        revalidatePathMock.mockReset()
    })

    it('signs out and revalidates the home layout', async () => {
        const result = await Effect.runPromise(sbLogout())

        expect(result).toEqual({ status: 200 })
        expect(signOut).toHaveBeenCalled()
        expect(revalidatePathMock).toHaveBeenCalledWith(HOME_PAGE_PATH, 'layout')
    })

    it('fails with LogoutError and skips revalidation when sign-out fails', async () => {
        signOut.mockResolvedValue({ error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(sbLogout())
        expect(failureTag(exit)).toBe('LogoutError')
        expect(revalidatePathMock).not.toHaveBeenCalled()
    })
})
