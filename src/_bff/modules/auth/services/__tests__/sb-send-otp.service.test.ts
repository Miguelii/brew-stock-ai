import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { sbSendOtp } from '@/_bff/modules/auth/services/sb-send-otp.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbServerClientMock } = vi.hoisted(() => ({ createSbServerClientMock: vi.fn() }))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))

const signInWithOtp = vi.fn()

describe('sbSendOtp', () => {
    beforeEach(() => {
        signInWithOtp.mockReset().mockResolvedValue({ error: null })
        createSbServerClientMock.mockReset().mockResolvedValue({ auth: { signInWithOtp } })
    })

    it('sends the OTP allowing new users to be created', async () => {
        const result = await Effect.runPromise(sbSendOtp('user@example.com'))

        expect(result).toEqual({ status: 200 })
        expect(signInWithOtp).toHaveBeenCalledWith({
            email: 'user@example.com',
            options: { shouldCreateUser: true },
        })
    })

    it('fails with SendOtpError when Supabase returns an error', async () => {
        signInWithOtp.mockResolvedValue({ error: { message: 'rate limited' } })

        const exit = await Effect.runPromiseExit(sbSendOtp('user@example.com'))
        expect(failureTag(exit)).toBe('SendOtpError')
    })

    it('fails with SendOtpError when the request rejects', async () => {
        signInWithOtp.mockRejectedValue(new Error('network down'))

        const exit = await Effect.runPromiseExit(sbSendOtp('user@example.com'))
        expect(failureTag(exit)).toBe('SendOtpError')
    })
})
