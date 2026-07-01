const MODEL_PRICING: Record<string, { inputPerMTok: number; outputPerMTok: number }> = {
    'claude-haiku-4-5': { inputPerMTok: 0.8, outputPerMTok: 4 },
    'claude-sonnet-4-5-20250929': { inputPerMTok: 3, outputPerMTok: 15 },
}

export function calculateTokenCost(
    model: string,
    promptTokens: number | undefined | null,
    completionTokens: number | undefined | null
): number | 'N/A' {
    const pricing = MODEL_PRICING[model]

    if (!pricing) return 'N/A'

    if (!promptTokens || !completionTokens) return 'N/A'

    return (
        (promptTokens / 1_000_000) * pricing.inputPerMTok +
        (completionTokens / 1_000_000) * pricing.outputPerMTok
    )
}
