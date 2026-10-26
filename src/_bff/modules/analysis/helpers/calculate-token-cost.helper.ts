import { hasOwnKey } from '@/_bff/core/utils/lookup.utils'

const MODEL_PRICING = {
    'claude-haiku-4-5': { inputPerMTok: 1, outputPerMTok: 5 },
    'claude-sonnet-5': { inputPerMTok: 2, outputPerMTok: 10 },
} satisfies Record<string, { inputPerMTok: number; outputPerMTok: number }>

export function calculateTokenCost(
    model: string,
    promptTokens: number | undefined | null,
    completionTokens: number | undefined | null
): number | 'N/A' {
    if (!hasOwnKey(MODEL_PRICING, model)) return 'N/A'

    const pricing = MODEL_PRICING[model]

    if (!promptTokens || !completionTokens) return 'N/A'

    return (
        (promptTokens / 1_000_000) * pricing.inputPerMTok +
        (completionTokens / 1_000_000) * pricing.outputPerMTok
    )
}
