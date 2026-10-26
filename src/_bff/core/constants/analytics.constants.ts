import type { GTMWithoutPrefix } from '@/types/GTM'

export const GTM_ID = 'G-3VFDWM9Q9V'

export const GTM_ID_WITHOUT_G = '3VFDWM9Q9V' satisfies GTMWithoutPrefix<typeof GTM_ID>

export const CONSENT_COOKIE = 'brew_stock_cookie_consent'

export const ANALYTICS_EVENTS = {
    SIGN_UP: 'sign_up',
    LOGIN: 'login',
    REPORT_CREATED: 'report_created',
    BEGIN_CHECKOUT: 'begin_checkout',
    PURCHASE: 'purchase',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

export const AUTH_METHODS = {
    GOOGLE: 'google',
    OTP: 'otp',
} as const

/**
 * Query params that hand a conversion off to the client, for flows ending in a
 * server-side redirect that have no place to fire the event themselves. They are
 * stripped from the URL once consumed, so they must stay distinct from params the
 * pages themselves read (`success` and `canceled` on /tokens).
 */
export const AUTH_EVENT_PARAMS = {
    EVENT: 'authEvent',
    METHOD: 'authMethod',
} as const

export const CHECKOUT_EVENT_PARAMS = {
    SESSION_ID: 'session_id',
    VALUE: 'value',
    CREDITS: 'credits',
} as const
