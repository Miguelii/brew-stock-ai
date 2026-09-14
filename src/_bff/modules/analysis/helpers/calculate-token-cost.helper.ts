const MODEL_PRICING: Record<string, { inputPerMTok: number; outputPerMTok: number }> = {
    'claude-haiku-4-5': { inputPerMTok: 1, outputPerMTok: 5 },
    'claude-sonnet-5': { inputPerMTok: 2, outputPerMTok: 10 },
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
