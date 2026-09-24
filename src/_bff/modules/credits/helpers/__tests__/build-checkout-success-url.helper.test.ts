import { describe, it, expect } from 'vitest'
import { buildCheckoutSuccessUrl } from '@/_bff/modules/credits/helpers/build-checkout-success-url.helper'
import { TOKEN_PACKAGES } from '@/_bff/core/constants/credit-packages.constants'
import type { PickTokenPackage } from '@/types/TokenPackage'

const BASE_URL = 'https://brewstockai.com'

const pkg = (amount: number, credits: number): PickTokenPackage => ({
    id: 'starter',
    label: 'Starter',
    amount,
    credits,
})

describe('buildCheckoutSuccessUrl', () => {
    it('points at the tokens page with the banner flag the page reads', () => {
        const url = new URL(buildCheckoutSuccessUrl(BASE_URL, pkg(249, 15)))

        expect(url.origin).toBe(BASE_URL)
        expect(url.pathname).toBe('/tokens')
        expect(url.searchParams.get('success')).toBe('true')
    })

    it('leaves the Stripe session placeholder unencoded', () => {
        const url = buildCheckoutSuccessUrl(BASE_URL, pkg(249, 15))

        // Percent-encoded braces would stop Stripe substituting the real session id,
        // which would take the purchase event's transaction_id with it.
        expect(url).toContain('session_id={CHECKOUT_SESSION_ID}')
        expect(url).not.toContain('%7B')
    })

    it('converts the amount from cents to euros', () => {
        const value = (amount: number) =>
            new URL(buildCheckoutSuccessUrl(BASE_URL, pkg(amount, 5))).searchParams.get('value')

        expect(value(50)).toBe('0.5')
        expect(value(99)).toBe('0.99')
        expect(value(249)).toBe('2.49')
        expect(value(599)).toBe('5.99')
    })

    it('carries the credit count', () => {
        const url = new URL(buildCheckoutSuccessUrl(BASE_URL, pkg(599, 50)))

        expect(url.searchParams.get('credits')).toBe('50')
    })

    it('produces a parseable URL for every package actually on sale', () => {
        for (const item of TOKEN_PACKAGES) {
            const url = new URL(buildCheckoutSuccessUrl(BASE_URL, item))

            expect(Number(url.searchParams.get('value'))).toBeCloseTo(item.amount / 100, 2)
            expect(url.searchParams.get('credits')).toBe(String(item.credits))
        }
    })
})
