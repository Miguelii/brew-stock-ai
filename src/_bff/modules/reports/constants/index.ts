// stock_data is refreshed by the Trigger.dev pipeline (outside the Next runtime, where
// tag revalidation is unavailable) — keep the TTL short to bound staleness.
export const STOCK_DATA_CACHE_KEY = 'stock-data'
export const STOCK_DATA_CACHE_TTL = 60 * 60 // 1h in seconds (for unstable_cache)
