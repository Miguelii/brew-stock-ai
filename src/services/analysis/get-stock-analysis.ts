import 'server-only'

import { generateText, Output } from 'ai'
import { Effect } from 'effect'
import { anthropic } from '@/services/utils/init-anthropic'
import { SystemPrompt } from '@/services/utils/prompts'
import { AiGenerationError, InvalidPromptTypeError } from '@/services/utils/tagged-errors'
import type { ReportDTO } from '@/types/ReportDTO'
import { saveAnalysisToReport } from './save-analysis-to-report'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PROMPTS_MAP, stockAnalysisSchema } from '@/services/utils/constants'

export const getStockAnalysis = Effect.fn('getStockAnalysis')(function* (
    stockSymbol: string,
    promptType: string,
    reportId: ReportDTO['id'],
    supabaseClient?: SupabaseClient,
    useBaseModel?: boolean
) {
    const basePrompt = PROMPTS_MAP[promptType]

    if (!basePrompt) {
        return yield* new InvalidPromptTypeError({ promptType, error_hash: 'elogprtntf' })
    }

    const resolvedPrompt = basePrompt.replaceAll('##TICKER##', stockSymbol)

    const FREE_MODEL = 'claude-haiku-4-5'
    const PROD_MODEL = 'claude-sonnet-4-5-20250929'

    const { output } = yield* Effect.tryPromise({
        try: () =>
            generateText({
                model: anthropic(useBaseModel ? FREE_MODEL : PROD_MODEL),
                ...(useBaseModel
                    ? {}
                    : {
                          providerOptions: {
                              anthropic: {
                                  thinking: { type: 'enabled', budgetTokens: 1500 },
                              },
                          },
                      }),
                output: Output.object({ schema: stockAnalysisSchema }),
                system: SystemPrompt,
                prompt: resolvedPrompt,
                maxOutputTokens: useBaseModel ? 4000 : 5000,
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

    yield* saveAnalysisToReport(reportId, analysis, sentiment, supabaseClient)

    return { analysis, sentiment }
})
