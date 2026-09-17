export const LATEST_NEWS_CACHE_KEY = 'latest-news'

export const LATEST_NEWS_TTL = 24 * 60 * 60 // 1 day in seconds (for unstable_cache)

// Items the analysis pipeline feeds into the prompt (most recent first)
export const ANALYSIS_NEWS_COUNT = 3

// The report news card shows one featured story plus this many recent headlines
export const NEWS_CARD_LIST_SIZE = 4

// A photo story older than this is not promoted to the featured slot
export const NEWS_LEAD_MAX_AGE_SECONDS = 7 * 24 * 60 * 60
