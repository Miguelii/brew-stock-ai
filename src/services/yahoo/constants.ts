import 'server-only'

export const YAHOO_DATA_TTL = 3 * 24 * 60 * 60 * 1000 // 3 days

export const GET_PRICE_HISTORY_CACHE_KEY = 'price-history'

export const GET_PRICE_HISTORY_TTL = 60 * 60 * 12 // 12h in seconds (for unstable_cache)
