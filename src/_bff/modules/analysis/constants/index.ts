import { z } from 'zod'
import {
    WallStreetStyleStockAnalysisPrompt,
    DeepFinancialBreakdownPrompt,
    MoatAnalysisPrompt,
    RiskAnalysisPrompt,
    GrowthPotentialAnalysisPrompt,
} from '@/_bff/modules/analysis/prompts/analysis.prompt'
import { PROMPT_TYPES } from '@/_bff/core/constants/prompt-types.constants'

export const PROMPTS_MAP = {
    [PROMPT_TYPES.STOCK_ANALYSIS.type]: WallStreetStyleStockAnalysisPrompt,
    [PROMPT_TYPES.DEEP_FINANCIAL_BREAKDOWN.type]: DeepFinancialBreakdownPrompt,
    [PROMPT_TYPES.MOAT_ANALYSIS.type]: MoatAnalysisPrompt,
    [PROMPT_TYPES.RISK_ANALYSIS.type]: RiskAnalysisPrompt,
    [PROMPT_TYPES.GROWTH_POTENTIAL_ANALYSIS.type]: GrowthPotentialAnalysisPrompt,
} satisfies Record<string, string>

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

export const PROD_MODEL = 'claude-sonnet-5'

// Token budgets for the analysis generation.
//
// INVARIANT: with adaptive thinking, the thinking tokens count toward `max_tokens`,
// so `maxOutputTokens` MUST leave comfortable room for the final answer after the
// model reasons. Otherwise it spends the whole budget thinking and emits no final
// JSON, which surfaces as `AI_NoOutputGeneratedError` when reading `result.output`.

// Prod (Sonnet + adaptive thinking): room for the reasoning plus the full HTML answer.
export const MAX_OUTPUT_TOKENS_PROD = 16000

// Dev mode: the model is never called, the analysis comes from mocks/stock-analysis.mock.json
export const MOCK_ANALYSIS_DELAY = '20 seconds'
