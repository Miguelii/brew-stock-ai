import 'server-only'

import { PROMPT_TYPES } from '@/lib/constants'
import {
    DeepFinancialBreakdownPrompt,
    GrowthPotentialAnalysisPrompt,
    MoatAnalysisPrompt,
    RiskAnalysisPrompt,
    WallStreetStyleStockAnalysisPrompt,
} from './prompts'
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
            'Integer from 0 to 100. 0–30 bearish, 31–69 neutral, 70–100 bullish. Must be between 0 and 100.'
        ),
})

export const TOKEN_PACKAGES = [
    { id: 'starter', credits: 5, amount: 249, label: 'Starter' },
    { id: 'pro', credits: 15, amount: 599, label: 'Pro' },
    { id: 'expert', credits: 50, amount: 1499, label: 'Expert' },
] as const
