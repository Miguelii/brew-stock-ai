interface SentimentInfo {
    label: string
    color: string // hex, usable in SVG / PDF / Tailwind inline styles
}

/**
 * Maps a 0–100 sentiment score to a label, level key, and colour.
 *
 *  0–24   → Extreme Bearish  (#ef4444)
 * 25–44   → Bearish          (#f97316)
 * 45–55   → Neutral          (#f59e0b)
 * 56–75   → Bullish          (#84cc16)
 * 76–100  → Extreme Bullish  (#22c55e)
 */
export function getSentimentInfo(score: number): SentimentInfo {
    if (score <= 24) return { label: 'Extreme Bearish', color: '#ef4444' }
    if (score <= 44) return { label: 'Bearish', color: '#f97316' }
    if (score <= 55) return { label: 'Neutral', color: '#f59e0b' }
    if (score <= 75) return { label: 'Bullish', color: '#84cc16' }
    return { label: 'Extreme Bullish', color: EXTREME_BULLISH_COLOR }
}

export const EXTREME_BEARISH_COLOR = '#ef4444'

export const NEUTRAL_COLOR = '#f59e0b'

export const EXTREME_BULLISH_COLOR = '#22c55e'
