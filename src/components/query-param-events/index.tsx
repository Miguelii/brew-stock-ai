'use client'

import { useEffect } from 'react'
import {
    ANALYTICS_EVENTS,
    AUTH_EVENT_PARAMS,
    CHECKOUT_EVENT_PARAMS,
} from '@/_bff/core/constants/analytics.constants'
import { trackEvent } from '@/lib/analytics'

const CONSUMED_PARAMS = [
    AUTH_EVENT_PARAMS.EVENT,
    AUTH_EVENT_PARAMS.METHOD,
    CHECKOUT_EVENT_PARAMS.SESSION_ID,
    CHECKOUT_EVENT_PARAMS.VALUE,
    CHECKOUT_EVENT_PARAMS.CREDITS,
]

// Once per document load rather than per mount: a remount must not replay a URL
// that has already been consumed.
let consumed = false

/** `Number(null)` and `Number('')` are both 0, which would report a free purchase. */
const toNumber = (raw: string | null) => {
    // oxlint-disable-next-line unicorn/no-useless-undefined
    if (raw === null || raw.trim() === '') return undefined

    const parsed = Number(raw)

    return Number.isFinite(parsed) ? parsed : undefined
}

const reportConversions = (params: URLSearchParams) => {
    const authEvent = params.get(AUTH_EVENT_PARAMS.EVENT)

    if (authEvent === ANALYTICS_EVENTS.SIGN_UP || authEvent === ANALYTICS_EVENTS.LOGIN) {
        trackEvent(authEvent, { method: params.get(AUTH_EVENT_PARAMS.METHOD) ?? undefined })
    }

    const sessionId = params.get(CHECKOUT_EVENT_PARAMS.SESSION_ID)

    if (!sessionId) return

    trackEvent(ANALYTICS_EVENTS.PURCHASE, {
        // GA4 deduplicates on `transaction_id`, so even a replayed URL cannot
        // inflate revenue.
        transaction_id: sessionId,
        currency: 'EUR',
        value: toNumber(params.get(CHECKOUT_EVENT_PARAMS.VALUE)),
        credits: toNumber(params.get(CHECKOUT_EVENT_PARAMS.CREDITS)),
    })
}

/** Strips the params in a single pass and reports whether anything was removed. */
const stripConsumedParams = (params: URLSearchParams) => {
    let stripped = false

    for (const param of CONSUMED_PARAMS) {
        if (!params.has(param)) continue

        params.delete(param)
        stripped = true
    }

    return stripped
}

/**
 * Fires the conversions whose flows end in a server-side redirect (Google sign-in
 * and Stripe checkout), which leaves no client callback to report them from.
 *
 * Reads `window.location.search` inside an effect rather than `useSearchParams`:
 * this is mounted in the root layout, and `useSearchParams` there would opt every
 * page out of static prerendering.
 *
 * The consumed params are dropped with `history.replaceState` so a refresh does
 * not refire them, leaving the params the pages themselves read (`success` and
 * `canceled` on /tokens) untouched and without a re-render.
 */
export function QueryParamEvents() {
    useEffect(() => {
        // This runs on every page load of the site, and almost all of them carry no
        // query string, so the common case costs one string read instead of parsing
        // a URL and probing five params.
        if (consumed || !window.location.search) return

        consumed = true

        const url = new URL(window.location.href)

        reportConversions(url.searchParams)

        if (!stripConsumedParams(url.searchParams)) return

        window.history.replaceState(window.history.state, '', url.toString())
    }, [])

    return null
}
