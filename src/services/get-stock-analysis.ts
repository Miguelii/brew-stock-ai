import 'server-only'

import { generateText } from 'ai'
import { PROMPT_TYPES } from '@/lib/constants'
import {
    DeepFinancialBreakdownPrompt,
    GrowthPotentialAnalysisPrompt,
    MoatAnalysisPrompt,
    RiskAnalysisPrompt,
    SystemPrompt,
    WallStreetStyleStockAnalysisPrompt,
} from './prompts'

// Maps the PROMPT_TYPES option to the actual prompt
const PROMPTS_MAP: Record<string, string> = {
    [PROMPT_TYPES.STOCK_ANALYSIS.type]: WallStreetStyleStockAnalysisPrompt,
    [PROMPT_TYPES.DEEP_FINANCIAL_BREAKDOWN.type]: DeepFinancialBreakdownPrompt,
    [PROMPT_TYPES.MOAT_ANALYSIS.type]: MoatAnalysisPrompt,
    [PROMPT_TYPES.RISK_ANALYSIS.type]: RiskAnalysisPrompt,
    [PROMPT_TYPES.GROWTH_POTENTIAL_ANALYSIS.type]: GrowthPotentialAnalysisPrompt,
}

type Return = {
    status: 'success' | 'error'
    data?: string
    error?: string
}

export async function getStockAnalysis(stockSymbol: string, promptType: string): Promise<Return> {
    const basePrompt = PROMPTS_MAP[promptType]

    if (!basePrompt) {
        return { status: 'success', error: 'Invalid prompt type' }
    }

    const resolvedPrompt = basePrompt.replaceAll('##TICKER##', stockSymbol)

    const { text } = await generateText({
        model: 'google/gemini-3-pro-preview',
        system: SystemPrompt,
        prompt: resolvedPrompt,
    })

    return {
        status: 'success',
        data: text,
    }
}
