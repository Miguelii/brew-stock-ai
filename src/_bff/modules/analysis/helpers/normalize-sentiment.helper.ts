const NEUTRAL_SENTIMENT = 50

/**
 * The model is asked for an integer from 0 to 100, but the schema can't enforce it.
 * Round and clamp to that range; a non-finite value falls back to neutral.
 */
export function normalizeSentiment(value: number): number {
    if (!Number.isFinite(value)) return NEUTRAL_SENTIMENT

    return Math.min(100, Math.max(0, Math.round(value)))
}
