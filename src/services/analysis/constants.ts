import 'server-only'

import { PROMPT_TYPES } from '@/lib/constants'
import {
    DeepFinancialBreakdownPrompt,
    GrowthPotentialAnalysisPrompt,
    MoatAnalysisPrompt,
    RiskAnalysisPrompt,
    WallStreetStyleStockAnalysisPrompt,
} from '@/services/analysis/helpers/prompts'
import { z } from 'zod'

export const PROMPTS_MAP: Record<string, string> = {
    [PROMPT_TYPES.STOCK_ANALYSIS.type]: WallStreetStyleStockAnalysisPrompt,
    [PROMPT_TYPES.DEEP_FINANCIAL_BREAKDOWN.type]: DeepFinancialBreakdownPrompt,
    [PROMPT_TYPES.MOAT_ANALYSIS.type]: MoatAnalysisPrompt,
    [PROMPT_TYPES.RISK_ANALYSIS.type]: RiskAnalysisPrompt,
    [PROMPT_TYPES.GROWTH_POTENTIAL_ANALYSIS.type]: GrowthPotentialAnalysisPrompt,
}

export const PROMPT_COSTS_MAP: Record<string, number> = Object.fromEntries(
    Object.values(PROMPT_TYPES).map(({ type, cost }) => [type, cost])
)

export const stockAnalysisSchema = z.object({
    analysis: z.string().describe('Full analysis as valid inner HTML (no <html>/<body> tags)'),
    sentiment: z
        .number()
        .describe(
            'Integer from 0 to 100. 0–24 extreme bearish, 25–42 bearish, 43–57 neutral, 58–75 bullish, 76–100 extreme bullish. Must be between 0 and 100.'
        ),
})

export const FREE_MODEL = 'claude-haiku-4-5'

export const PROD_MODEL = 'claude-sonnet-4-5-20250929'

// Token budgets for the analysis generation.
//
// INVARIANT: with extended thinking, the thinking tokens count toward `max_tokens`,
// so `maxOutputTokens` MUST be comfortably larger than `THINKING_BUDGET_TOKENS` —
// otherwise the model spends its whole budget reasoning and emits no final JSON,
// which surfaces as `AI_NoOutputGeneratedError` when reading `result.output`.
export const THINKING_BUDGET_TOKENS = 6000

// Prod (Sonnet + thinking): room for the thinking budget plus the full HTML answer.
export const MAX_OUTPUT_TOKENS_PROD = 16000

// Free (Haiku, no thinking): the whole budget is available for the answer.
export const MAX_OUTPUT_TOKENS_FREE = 8000
