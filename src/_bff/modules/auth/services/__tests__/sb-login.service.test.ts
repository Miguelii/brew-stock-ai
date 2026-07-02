import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { sbLogin } from '@/_bff/modules/auth/services/sb-login.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbServerClientMock } = vi.hoisted(() => ({ createSbServerClientMock: vi.fn() }))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))

const signInWithPassword = vi.fn()
const makeClient = () => ({ auth: { signInWithPassword } })

describe('sbLogin', () => {
    beforeEach(() => {
        signInWithPassword.mockReset().mockResolvedValue({ error: null })
        createSbServerClientMock.mockReset().mockResolvedValue(makeClient())
    })

    it('signs in with the provided credentials', async () => {
        const result = await Effect.runPromise(sbLogin('user@example.com', 'secret'))

        expect(result).toEqual({ status: 200 })
        expect(signInWithPassword).toHaveBeenCalledWith({
            email: 'user@example.com',
            password: 'secret',
        })
    })

    it('fails with SignInWithPasswordError when Supabase rejects the credentials', async () => {
        signInWithPassword.mockResolvedValue({ error: { message: 'invalid credentials' } })

        const exit = await Effect.runPromiseExit(sbLogin('user@example.com', 'wrong'))
        expect(failureTag(exit)).toBe('SignInWithPasswordError')
    })

    it('fails with SignInWithPasswordError when the request rejects', async () => {
        signInWithPassword.mockRejectedValue(new Error('network down'))

        const exit = await Effect.runPromiseExit(sbLogin('user@example.com', 'secret'))
        expect(failureTag(exit)).toBe('SignInWithPasswordError')
    })

    it('fails with CreateSbClientError when the Supabase client cannot be created', async () => {
        createSbServerClientMock.mockRejectedValue(new Error('no env'))

        const exit = await Effect.runPromiseExit(sbLogin('user@example.com', 'secret'))
        expect(failureTag(exit)).toBe('CreateSbClientError')
    })
})
