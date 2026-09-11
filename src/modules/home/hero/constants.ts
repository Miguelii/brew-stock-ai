export const HERO_LINES = ['Professional stock analysis.', 'For smarter investing.'] as const

export const TICKERS = ['NVDA', 'AAPL', 'ASML', 'GOOGL'] as const

export const TYPE_INTERVAL_MS = 160

export const GENERATING_MS = 1800

export const READY_MS = 1600

/**
 * Entrance cascade for the hero, in seconds. The headline owns 0.25-0.37; every
 * block below picks up from there so the section lands as one movement.
 */
export const HERO_ENTRANCE = {
    copy: { delay: 0.55, duration: 0.9, y: 28 },
    actions: { delay: 0.68, duration: 0.9, y: 24 },
    badges: { delay: 0.8, stagger: 0.07, duration: 0.8, y: 18 },
    card: { delay: 0.95, duration: 1, y: 56 },
} as const
