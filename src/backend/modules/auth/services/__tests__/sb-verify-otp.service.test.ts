import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { sbVerifyOtp } from '@/backend/modules/auth/services/sb-verify-otp.service'

const { createSbServerClientMock, loggerMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    loggerMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/lib/logger', () => ({ Logger: loggerMock }))

const verifyOtp = vi.fn()

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

describe('sbVerifyOtp', () => {
    beforeEach(() => {
        verifyOtp.mockReset().mockResolvedValue({ error: null })
        createSbServerClientMock.mockReset().mockResolvedValue({ auth: { verifyOtp } })
        loggerMock.mockReset()
    })

    it('verifies the email OTP token', async () => {
        const result = await Effect.runPromise(sbVerifyOtp('user@example.com', '123456'))

        expect(result).toEqual({ status: 200 })
        expect(verifyOtp).toHaveBeenCalledWith({
            email: 'user@example.com',
            token: '123456',
            type: 'email',
        })
    })

    it('logs and fails with VerifyOtpError when the token is rejected', async () => {
        verifyOtp.mockResolvedValue({ error: { message: 'invalid token' } })

        const exit = await Effect.runPromiseExit(sbVerifyOtp('user@example.com', '000000'))
        expect(failureTag(exit)).toBe('VerifyOtpError')
        expect(loggerMock).toHaveBeenCalled()
    })
})
