import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { sbVerifyOtp } from '@/_bff/modules/auth/services/sb-verify-otp.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbServerClientMock, loggerMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    loggerMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_bff/lib/server-logger', () => ({ Logger: loggerMock }))

const verifyOtp = vi.fn()

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
