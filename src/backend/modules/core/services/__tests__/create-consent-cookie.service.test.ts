import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { createConsentCookie } from '@/backend/modules/core/services/create-consent-cookie.service'
import { CONSENT_COOKIE, GTM_ID_WITHOUT_G } from '@/lib/constants'
import { failureTag } from '@/backend/__tests__/utils'

const { cookiesMock } = vi.hoisted(() => ({ cookiesMock: vi.fn() }))

vi.mock('next/headers', () => ({ cookies: cookiesMock }))

const cookieStore = { set: vi.fn(), delete: vi.fn() }

describe('createConsentCookie', () => {
    beforeEach(() => {
        cookieStore.set.mockReset()
        cookieStore.delete.mockReset()
        cookiesMock.mockReset().mockResolvedValue(cookieStore)
    })

    it('sets the consent cookie to true and keeps analytics cookies', async () => {
        await Effect.runPromise(createConsentCookie(true))

        expect(cookieStore.set).toHaveBeenCalledWith(
            expect.objectContaining({ name: CONSENT_COOKIE, value: 'true', sameSite: 'lax' })
        )
        expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('sets the consent cookie to false and removes the GA cookies', async () => {
        await Effect.runPromise(createConsentCookie(false))

        expect(cookieStore.set).toHaveBeenCalledWith(
            expect.objectContaining({ name: CONSENT_COOKIE, value: 'false' })
        )
        expect(cookieStore.delete).toHaveBeenCalledWith('stats_ga')
        expect(cookieStore.delete).toHaveBeenCalledWith(`stats_ga_${GTM_ID_WITHOUT_G}`)
    })

    it('fails with CreateConsentCookieError when the cookie store is unavailable', async () => {
        cookiesMock.mockRejectedValue(new Error('no request scope'))

        const exit = await Effect.runPromiseExit(createConsentCookie(true))
        expect(failureTag(exit)).toBe('CreateConsentCookieError')
    })
})
