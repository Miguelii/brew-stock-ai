import {
    BEARISH_COLOR,
    BULLISH_COLOR,
    EXTREME_BEARISH_COLOR,
    EXTREME_BULLISH_COLOR,
    NEUTRAL_COLOR,
} from '@/_bff/core/constants/sentiment.constants'

type SentimentInfo = {
    label: string
    color: string // hex, usable in SVG / PDF / Tailwind inline styles
}

/**
 * Maps a 0–100 sentiment score to a label, level key, and colour.
 */
export function getSentimentInfo(score: number): SentimentInfo {
    if (score <= 24) return { label: 'Extreme Bearish', color: EXTREME_BEARISH_COLOR }
    if (score <= 42) return { label: 'Bearish', color: BEARISH_COLOR }
    if (score <= 57) return { label: 'Neutral', color: NEUTRAL_COLOR }
    if (score <= 75) return { label: 'Bullish', color: BULLISH_COLOR }
    return { label: 'Extreme Bullish', color: EXTREME_BULLISH_COLOR }
}

/**
 * Maps a 0–100 sentiment score to a risk level label and colour.
 * Used for Risk Analysis reports where lower score = higher risk.
 */
export function getRiskLevelInfo(score: number): SentimentInfo {
    if (score <= 24) return { label: 'Very High Risk', color: EXTREME_BEARISH_COLOR }
    if (score <= 42) return { label: 'High Risk', color: BEARISH_COLOR }
    if (score <= 57) return { label: 'Moderate Risk', color: NEUTRAL_COLOR }
    if (score <= 75) return { label: 'Low Risk', color: BULLISH_COLOR }
    return { label: 'Very Low Risk', color: EXTREME_BULLISH_COLOR }
}
