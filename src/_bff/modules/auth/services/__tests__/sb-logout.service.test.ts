import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { sbLogout } from '@/_bff/modules/auth/services/sb-logout.service'
import { failureTag } from '@/_bff/lib/tests-utils'

const { createDBServerClientMock, revalidatePathMock } = vi.hoisted(() => ({
    createDBServerClientMock: vi.fn(),
    revalidatePathMock: vi.fn(),
}))

vi.mock('@/_bff/core/db', () => ({
    createDBServerClient: createDBServerClientMock,
}))
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }))

const signOut = vi.fn()

describe('sbLogout', () => {
    beforeEach(() => {
        signOut.mockReset().mockResolvedValue({ error: null })
        createDBServerClientMock.mockReset().mockResolvedValue({ auth: { signOut } })
        revalidatePathMock.mockReset()
    })

    it('signs out and revalidates the home layout', async () => {
        const result = await Effect.runPromise(sbLogout())

        expect(result).toEqual({ status: 200 })
        expect(signOut).toHaveBeenCalled()
        expect(revalidatePathMock).toHaveBeenCalledWith('/', 'layout')
    })

    it('fails with LogoutError and skips revalidation when sign-out fails', async () => {
        signOut.mockResolvedValue({ error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(sbLogout())
        expect(failureTag(exit)).toBe('LogoutError')
        expect(revalidatePathMock).not.toHaveBeenCalled()
    })
})
