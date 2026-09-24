import { CHECKOUT_EVENT_PARAMS } from '@/_bff/core/constants/analytics.constants'
import type { PickTokenPackage } from '@/types/TokenPackage'

/** Stripe stores amounts in cents; GA4 expects the order value in major units. */
const CENTS_PER_EURO = 100

/**
 * Builds the URL Stripe returns the buyer to after payment.
 *
 * `success` is what the /tokens page reads to show its banner; the rest is what the
 * client needs to report the `purchase` conversion, since the webhook that actually
 * grants the credits has no way to reach the visitor's analytics.
 *
 * `{CHECKOUT_SESSION_ID}` is a Stripe placeholder matched on its literal braces, so
 * it is appended raw: passing it through URLSearchParams would percent-encode it and
 * the substitution would silently never happen.
 */
export const buildCheckoutSuccessUrl = (baseUrl: string, pkg: PickTokenPackage) => {
    const params = new URLSearchParams({
        success: 'true',
        [CHECKOUT_EVENT_PARAMS.VALUE]: String(pkg.amount / CENTS_PER_EURO),
        [CHECKOUT_EVENT_PARAMS.CREDITS]: String(pkg.credits),
    })

    return `${baseUrl}/tokens?${params}&${CHECKOUT_EVENT_PARAMS.SESSION_ID}={CHECKOUT_SESSION_ID}`
}
