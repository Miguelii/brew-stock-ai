import 'server-only'

import { PROMPT_TYPES } from '@/lib/constants'
import { Data } from 'effect'
import {
    DeepFinancialBreakdownPrompt,
    GrowthPotentialAnalysisPrompt,
    MoatAnalysisPrompt,
    RiskAnalysisPrompt,
    WallStreetStyleStockAnalysisPrompt,
} from './prompts'
import { z } from 'zod'

export class InvalidPromptTypeError extends Data.TaggedError('InvalidPromptTypeError')<{
    promptType: string
    error_hash: string
}> {}

export class AiGenerationError extends Data.TaggedError('AiGenerationError')<{
    cause: unknown
    error_hash: string
}> {}

export class CreateSbClientError extends Data.TaggedError('CreateSbClientError')<{
    cause: unknown
    error_hash: string
}> {}

export class UnauthenticatedError extends Data.TaggedError('UnauthenticatedError')<{
    error_hash: string
}> {}

export class GetUserError extends Data.TaggedError('GetUserError')<{
    cause: unknown
    error_hash: string
}> {}

export class CreateReportError extends Data.TaggedError('CreateReportError')<{
    cause: unknown
    error_hash: string
}> {}

export class SaveAnalysisError extends Data.TaggedError('SaveAnalysisError')<{
    cause: unknown
    error_hash: string
}> {}

export class GetReportByIdError extends Data.TaggedError('GetReportByIdError')<{
    cause: unknown
    error_hash: string
}> {}

export class GetReportsError extends Data.TaggedError('GetReportsError')<{
    cause: unknown
    error_hash: string
}> {}

export class FetchReportForTaskError extends Data.TaggedError('FetchReportForTaskError')<{
    cause: unknown
    error_hash: string
}> {}

export class MarkReportFailedError extends Data.TaggedError('MarkReportFailedError')<{
    cause: unknown
    error_hash: string
}> {}

export class SignInWithPasswordError extends Data.TaggedError('SignInWithPasswordError')<{
    cause: unknown
    error_hash: string
}> {}

export class SignUpError extends Data.TaggedError('SignUpError')<{
    cause: unknown
    error_hash: string
}> {}

export class LogoutError extends Data.TaggedError('LogoutError')<{
    cause: unknown
    error_hash: string
}> {}

export class ExportReportError extends Data.TaggedError('ExportReportError')<{
    cause: unknown
    error_hash: string
}> {}

export const PROMPTS_MAP: Record<string, string> = {
    [PROMPT_TYPES.STOCK_ANALYSIS.type]: WallStreetStyleStockAnalysisPrompt,
    [PROMPT_TYPES.DEEP_FINANCIAL_BREAKDOWN.type]: DeepFinancialBreakdownPrompt,
    [PROMPT_TYPES.MOAT_ANALYSIS.type]: MoatAnalysisPrompt,
    [PROMPT_TYPES.RISK_ANALYSIS.type]: RiskAnalysisPrompt,
    [PROMPT_TYPES.GROWTH_POTENTIAL_ANALYSIS.type]: GrowthPotentialAnalysisPrompt,
}

export const stockAnalysisSchema = z.object({
    analysis: z.string().describe('Full analysis as valid inner HTML (no <html>/<body> tags)'),
    sentiment: z
        .number()
        .describe(
            'Integer from 0 to 100. 0–30 bearish, 31–69 neutral, 70–100 bullish. Must be between 0 and 100.'
        ),
})
