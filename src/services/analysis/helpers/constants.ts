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
            'Integer from 0 to 100. 0–30 bearish, 31–69 neutral, 70–100 bullish. Must be between 0 and 100.'
        ),
})

export const YAHOO_DATA_TTL = 3 * 24 * 60 * 60 * 1000 // 3 days

export const LATEST_NEWS_CACHE_KEY = 'latest-news'
export const LATEST_NEWS_TTL = 24 * 60 * 60 // 1 day in seconds (for unstable_cache)

export const GET_PRICE_HISTORY_CACHE_KEY = 'price-history'
export const GET_PRICE_HISTORY_TTL = 60 * 60 * 12 // 12h in seconds (for unstable_cache)
