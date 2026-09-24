import type { AnalyticsEvent } from '@/_bff/core/constants/analytics.constants'

type EventParams = Record<string, string | number | boolean | undefined>

/**
 * Events queue on `dataLayer`, which the bootstrap script initialises before
 * hydration, so a call made before gtag.js has finished loading is still
 * delivered once it does.
 */
export const trackEvent = (event: AnalyticsEvent, params?: EventParams) => {
    globalThis.gtag?.('event', event, params)
}
