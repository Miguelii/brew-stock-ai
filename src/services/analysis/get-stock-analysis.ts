import 'server-only'

import { generateText, Output } from 'ai'
import { Effect } from 'effect'
import { anthropic } from '@/services/utils/init-anthropic'
import { SystemPrompt } from '@/services/utils/prompts'
import {
    AiGenerationError,
    InvalidPromptTypeError,
    PROMPTS_MAP,
    stockAnalysisSchema,
} from '@/services/utils/constants'
import type { ReportDTO } from '@/types/ReportDTO'
import { saveAnalysisToReport } from './save-analysis-to-report'

export const getStockAnalysis = Effect.fn('getStockAnalysis')(function* (
    stockSymbol: string,
    promptType: string,
    reportId: ReportDTO['id']
) {
    const basePrompt = PROMPTS_MAP[promptType]

    if (!basePrompt) {
        return yield* new InvalidPromptTypeError({ promptType, error_hash: 'elogprtntf' })
    }

    const resolvedPrompt = basePrompt.replaceAll('##TICKER##', stockSymbol)

    const { output } = yield* Effect.tryPromise({
        try: () =>
            generateText({
                model: anthropic('claude-haiku-4-5'),
                output: Output.object({ schema: stockAnalysisSchema }),
                system: SystemPrompt,
                prompt: resolvedPrompt,
                maxOutputTokens: 4000,
            }),
        catch: (cause) => {
            console.error('[getStockAnalysis] raw AI error:', cause)
            return new AiGenerationError({ cause, error_hash: 'elogaierf1' })
        },
    })

    const { analysis, sentiment } = output

    if (!analysis) {
        return yield* new AiGenerationError({
            cause: 'Model returned incomplete output',
            error_hash: 'elogaioptnull',
        })
    }

    yield* saveAnalysisToReport(reportId, analysis, sentiment)

    return { analysis, sentiment }
})
