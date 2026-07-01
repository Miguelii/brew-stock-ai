import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { sbLogout } from '@/_backend/modules/auth/services/sb-logout.service'
import { HOME_PAGE_PATH } from '@/lib/constants'
import { failureTag } from '@/_backend/__tests__/utils'

const { createSbServerClientMock, revalidatePathMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    revalidatePathMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }))

const signOut = vi.fn()

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
