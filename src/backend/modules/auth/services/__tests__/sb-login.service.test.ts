import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { sbLogin } from '@/backend/modules/auth/services/sb-login.service'

const { createSbServerClientMock } = vi.hoisted(() => ({ createSbServerClientMock: vi.fn() }))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))

const signInWithPassword = vi.fn()
const makeClient = () => ({ auth: { signInWithPassword } })

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

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
