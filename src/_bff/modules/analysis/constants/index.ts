import { z } from 'zod'
import {
    WallStreetStyleStockAnalysisPrompt,
    DeepFinancialBreakdownPrompt,
    MoatAnalysisPrompt,
    RiskAnalysisPrompt,
    GrowthPotentialAnalysisPrompt,
} from '@/_bff/modules/analysis/prompts/analysis.prompt'
import { PropmptsEnum } from '@/types/PropmptsEnum'

export const PROMPT_TYPES = {
    [PropmptsEnum.STOCK_ANALYSIS]: {
        type: PropmptsEnum.STOCK_ANALYSIS,
        label: 'Full Wall Street Style Stock Analysis',
        cost: 2,
    },
    [PropmptsEnum.DEEP_FINANCIAL_BREAKDOWN]: {
        type: PropmptsEnum.DEEP_FINANCIAL_BREAKDOWN,
        label: 'Deep Financial Breakdown',
        cost: 2,
    },
    [PropmptsEnum.MOAT_ANALYSIS]: {
        type: PropmptsEnum.MOAT_ANALYSIS,
        label: 'Competitive Advantage (Moat) Analysis',
        cost: 1,
    },
    [PropmptsEnum.RISK_ANALYSIS]: {
        type: PropmptsEnum.RISK_ANALYSIS,
        label: 'Risk Analysis',
        cost: 1,
    },
    [PropmptsEnum.GROWTH_POTENTIAL_ANALYSIS]: {
        type: PropmptsEnum.GROWTH_POTENTIAL_ANALYSIS,
        label: 'Growth Potential Analysis',
        cost: 1,
    },
} as const

export const PROMPTS_MAP: Record<string, string> = {
    [PROMPT_TYPES.STOCK_ANALYSIS.type]: WallStreetStyleStockAnalysisPrompt,
    [PROMPT_TYPES.DEEP_FINANCIAL_BREAKDOWN.type]: DeepFinancialBreakdownPrompt,
    [PROMPT_TYPES.MOAT_ANALYSIS.type]: MoatAnalysisPrompt,
    [PROMPT_TYPES.RISK_ANALYSIS.type]: RiskAnalysisPrompt,
    [PROMPT_TYPES.GROWTH_POTENTIAL_ANALYSIS.type]: GrowthPotentialAnalysisPrompt,
}

export const PROMPT_OPTIONS = Object.values(PROMPT_TYPES)

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
